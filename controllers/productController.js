const cloudinary = require('cloudinary');
const xlsx = require('xlsx');
const slugify = require('slugify');
const fs = require('fs');
const Product = require('../models/productSchema');

const cleanNumber = (value) => {
    if (value === undefined || value === null) return NaN;
    const cleaned = String(value).replace(/[^0-9.]/g, "");
    return cleaned === "" ? NaN : Number(cleaned);
};

const normalizeBoolean = (value) => {
    if (value === undefined || value === null) return false;

    if (typeof value === "boolean") return value;

    if (typeof value === "number") return value === 1;

    if (typeof value === "string") {
        const v = value.trim().toLowerCase();
        return ["true", "yes", "1", "y", "featured"].includes(v);
    }

    return false;
};


// categories allowed by schema
const ALLOWED_CATEGORIES = [
    "Bouquet",
    "Bouquet in Bag",
    "Box Arrangements",
    "Cake",
    "Cakes and Flowers",
    "Chocolate",
    "Chocolate and Flowers",
    "Combo Deals",
    "Flowers",
    "Forever Flowers",
    "Fresh Cakes",
    "Flower Basket",
    "Fruits and Flowers",
    "Hand Bouquet",
    "Mini Bag Arrangements",
    "Mini Bouquet",
    "Necklace",
    "Plants",
    "Vase Arrangements"
];


const normalizeCategory = (value) => {
    if (!value) return "Bouquet";

    // Split categories from Excel
    const parts = String(value)
        .split(",")
        .map(v => v.trim())
        .filter(v => v.toLowerCase() !== "all products");

    if (!parts.length) return "Bouquet";

    let category = parts[0];

    // FIX naming mismatches
    const CATEGORY_MAP = {
        "Vase Arrangement": "Vase Arrangements",
        "Cake Arrangement": "Cake",
        "Bouquets": "Bouquet"
    };

    if (CATEGORY_MAP[category]) {
        category = CATEGORY_MAP[category];
    }

    return ALLOWED_CATEGORIES.includes(category)
        ? category
        : "Bouquet";
};


// normalize product type
const normalizeType = (value) => {
    return String(value || "simple").toLowerCase() === "variable"
        ? "variable"
        : "simple";
};

const addProduct = async (req, res) => {
    try {
        const {
            name,
            type = "simple",
            sku,
            regularPrice,
            price,
            stock = 0,
            description,
            occasions,
            category,
            addons,
            availableIn,
            isFeatured = false,
            variations
        } = req.body;

        if (!name || !regularPrice || !description || !category) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        // Generate slug
        const slug = `${slugify(name, { lower: true, strict: true })}-${Date.now()}`;

        // Upload images
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        const imageUrls = await Promise.all(
            req.files.map(async (file) => {
                const uploaded = await cloudinary.uploader.upload(file.path, {
                    folder: "products"
                });
                return uploaded.secure_url;
            })
        );

        const product = new Product({
            name,
            slug,
            type,
            sku,
            regularPrice,
            price: price || regularPrice,
            stock,
            inStock: stock > 0,
            description,
            occasions,
            category,
            isFeatured,
            image: imageUrls,
            availableIn: availableIn
                ? Array.isArray(availableIn)
                    ? availableIn
                    : JSON.parse(availableIn)
                : undefined,
            addons: addons ? JSON.parse(addons) : [],
            variations: type === "variable" && variations
                ? JSON.parse(variations)
                : []
        });

        await product.save();

        res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (error) {
        console.error("addProduct error:", error);
        res.status(500).json({ message: error.message });
    }
};



const getProduct = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const singleProduct = async (req, res) => {
    try {
        const { idOrSlug } = req.params;

        const product = mongoose.Types.ObjectId.isValid(idOrSlug)
            ? await Product.findById(idOrSlug)
            : await Product.findOne({ slug: idOrSlug });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const fields = [
            "name", "type", "sku", "regularPrice", "price",
            "description", "category", "occasions",
            "isFeatured", "availableIn"
        ];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        // Update slug if name changes
        if (req.body.name) {
            product.slug = `${slugify(req.body.name, { lower: true, strict: true })}-${Date.now()}`;
        }

        if (req.body.stock !== undefined) {
            product.stock = Number(req.body.stock);
            product.inStock = product.stock > 0;
        }

        if (req.body.variations && product.type === "variable") {
            product.variations = JSON.parse(req.body.variations);
        }

        // Upload new images
        if (req.files && req.files.length > 0) {
            const uploadedImages = await Promise.all(
                req.files.map(file =>
                    cloudinary.uploader.upload(file.path, { folder: "products" })
                )
            );
            product.image = uploadedImages.map(i => i.secure_url);
        }

        await product.save();

        res.json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error("editProduct error:", error);
        res.status(500).json({ message: error.message });
    }
};



const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        await Product.findByIdAndDelete(id)
        res.status(200).json({ message: 'product deleted succesfull' })
    } catch (error) {
        console.log(error, 'error occured on deleteProduct')
        res.status(500).json({ message: error.message })
    }
}


const bulkUploadProducts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const workbook = xlsx.readFile(req.file.path, {
            raw: false,
            defval: ""
        });

        const sheetName = workbook.SheetNames[0];
        const rows = xlsx.utils.sheet_to_json(
            workbook.Sheets[sheetName],
            { defval: "" }
        );

        fs.unlinkSync(req.file.path);

        const validProducts = [];
        const skippedRows = [];

        rows.forEach((row, index) => {
            try {
                const name = row.name || row.Name;
                if (!name) throw new Error("Missing product name");

                // ---- PRICE HANDLING (SAFE) ----
                const salePrice = cleanNumber(row.sale_price || row.Sale_price || row.SalePrice);
                const regularPriceRaw = cleanNumber(row.regular_price || row.Regular_price || row.RegularPrice);
                const fallbackPrice = cleanNumber(row.price);

                // final selling price
                const price =
                    !isNaN(salePrice)
                        ? salePrice
                        : !isNaN(regularPriceRaw)
                            ? regularPriceRaw
                            : fallbackPrice;

                if (isNaN(price)) {
                    throw new Error(
                        `Missing price (sale_price / regular_price)`
                    );
                }

                // regular price fallback
                const regularPrice = !isNaN(regularPriceRaw)
                    ? regularPriceRaw
                    : price;

                // ---- STOCK HANDLING (SAFE) ----
                let stock = cleanNumber(
                    row.stock_quantity || row.stock || row.Stock
                );

                // empty stock is VALID → default to 0
                if (isNaN(stock)) stock = 0;


                const category = normalizeCategory(
                    row.category || row.Category || row.Categories
                );

                const type = normalizeType(row.type || row.Type);

                const sku =
                    row.sku ||
                    row.SKU ||
                    `SKU-${slugify(name, { upper: true })}-${index + 1}`;

                const description =
                    row.description ||
                    row.Description ||
                    `Description for ${name}`;

                const imageValue = row.image || row.Image;

                const isFeatured = normalizeBoolean(
                    row.is_featured || row.Is_featured || row["Is featured"] || row.Featured
                );

                const inStockFromFile = normalizeBoolean(
                    row.in_stock || row.In_stock || row["In stock?"] || row.InStock
                );

                validProducts.push({
                    name,
                    slug: slugify(name, { lower: true, strict: true }),
                    sku,
                    type,
                    price,
                    regularPrice,
                    stock,
                    isFeatured,
                    inStock: inStockFromFile ?? stock > 0,
                    description,
                    category,
                    occasions: row.occasions || row.Occasions || "General",
                    availableIn: row.AvailableIn ? row.AvailableIn.split(",").map(e => e.trim()) : undefined,
                    image: imageValue ? imageValue.split(",").map(img => img.trim()) : [],
                    addons: row.addons ? JSON.parse(row.addons) : []
                });


            } catch (err) {
                skippedRows.push({
                    row: index + 2,
                    reason: err.message
                });
                console.log("Product validation error :", err)
            }
        });

        if (validProducts.length > 0) {
            await Product.insertMany(validProducts);
        }

        res.json({
            message: "Bulk upload completed",
            totalRows: rows.length,
            uploaded: validProducts.length,
            skipped: skippedRows.length,
            skippedRows
        });

    } catch (error) {
        console.error("Bulk upload error:", error);
        res.status(500).json({ message: "Bulk upload failed" });
    }
};

const bulkPreviewProducts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const workbook = xlsx.readFile(req.file.path, {
            raw: false,
            defval: ""
        });

        const sheetName = workbook.SheetNames[0];
        const rows = xlsx.utils.sheet_to_json(
            workbook.Sheets[sheetName],
            { defval: "" }
        );

        fs.unlinkSync(req.file.path);

        const validProducts = [];
        const skippedRows = [];

        rows.forEach((row, index) => {
            try {
                const name = row.name || row.Name;
                if (!name) throw new Error("Missing name");

                const price = cleanNumber(
                    row.sale_price || row.regular_price || row.price
                );

                const stock = cleanNumber(
                    row.stock_quantity || row.stock
                );

                if (isNaN(price) || isNaN(stock)) {
                    throw new Error("Invalid price or stock");
                }

                const category =
                    row.category || row.Category || row.Categories || "Bouquet";

                validProducts.push({
                    name,
                    price,
                    stock,
                    category,
                    imageCount: row.image
                        ? row.image.split(",").length
                        : 0
                });

            } catch (err) {
                skippedRows.push({
                    row: index + 2,
                    reason: err.message
                });
            }
        });

        res.json({
            total: rows.length,
            validCount: validProducts.length,
            skippedCount: skippedRows.length,
            validProducts,
            skippedRows
        });

    } catch (err) {
        res.status(500).json({ message: "Preview failed" });
    }
};


const bulkDeleteProducts = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid request. 'ids' must be an array." });
        }

        await Product.deleteMany({ _id: { $in: ids } });

        res.json({ message: "Products deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const exportProductsExcel = async (req, res) => {
    try {
        const products = await Product.find().lean();

        const excelData = products.map(p => ({
            Name: p.name,
            SKU: p.sku || "",
            Category: p.category,
            SalePrice: p.price,
            RegularPrice: p.regularPrice,
            Stock: p.stock,
            InStock: p.inStock ? "Yes" : "No",
            Featured: p.isFeatured ? "Yes" : "No",
            Type: p.type,
            Occasions: p.occasions,
            AvailableIn: (p.availableIn || []).join(", "),
            Image: (p.image || []).join(", "),
            Description: p.description
        }));

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(excelData);

        xlsx.utils.book_append_sheet(workbook, worksheet, "Products");

        const buffer = xlsx.write(workbook, {
            type: "buffer",
            bookType: "xlsx"
        });

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=products.xlsx"
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.send(buffer);

    } catch (error) {
        console.error("Export error:", error);
        res.status(500).json({ message: "Failed to export products" });
    }
};

const getProductsByEmirate = async (req, res) => {
    try {
        const emirate = req.query.emirate
        if (!emirate) return res.status(400).json({ message: "emirate query required" })

        // find products that list this emirate in availableIn
        const products = await Product.find({ availableIn: emirate })
        res.json({ products })
    } catch (error) {
        console.error('Error in getProductsByEmirate:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const checkCartAvailability = async (req, res) => {
    try {
        const { cartItems, emirate } = req.body
        if (!cartItems || !Array.isArray(cartItems) || !emirate) {
            return res.status(400).json({ message: "cartItems (array) and emirate required" })
        }

        // Find all product ids in one query
        const ids = cartItems.map(i => i.productId)
        const products = await Product.find({ _id: { $in: ids } })

        // Map products for quick lookup
        const prodMap = {}
        products.forEach(p => prodMap[p._id.toString()] = p)

        // Check availability per cart item
        const availability = cartItems.map(item => {
            const p = prodMap[item.productId]
            if (!p) {
                return { productId: item.productId, available: false, reason: "Not found" }
            }
            // check emirate availability and stock
            const availableInEmirate = (p.availableIn || []).includes(emirate)
            const enoughStock = (p.stock >= (item.quantity || 1))
            return {
                productId: item.productId,
                available: availableInEmirate && enoughStock,
                availableInEmirate,
                enoughStock,
                name: p.name,
                stock: p.stock
            }
        })

        const anyUnavailable = availability.some(a => !a.available)

        // Delivery charge rules
        // Abu Dhabi => 30 AED + VAT ; others => 60 AED + VAT
        const baseDelivery = (emirate.toLowerCase() === 'abu dhabi') ? 30 : 60
        const vat = 0.05
        const deliveryWithVat = +(baseDelivery * (1 + vat)).toFixed(2)

        res.json({
            availability,
            allAvailable: !anyUnavailable,
            delivery: {
                base: baseDelivery,
                vatPercent: vat * 100,
                total: deliveryWithVat
            }
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "server error" })
    }
}

module.exports = { addProduct, getProduct, singleProduct, editProduct, deleteProduct, bulkUploadProducts, getProductsByEmirate, checkCartAvailability, bulkDeleteProducts, bulkPreviewProducts, exportProductsExcel }