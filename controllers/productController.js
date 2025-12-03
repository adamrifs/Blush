const cloudinary = require('cloudinary');
const xlsx = require('xlsx');
const fs = require('fs');
const Product = require('../models/productSchema');

const addProduct = async (req, res) => {
    try {
        const {
            name, price, stock, description, occasions, category, addons,
            availableIn   // ⭐ NEW FIELD
        } = req.body;

        if (!name || !price || !stock || !description || !occasions || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        // Upload product images
        let imageUrls = await Promise.all(
            req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'products',
                });
                return result.secure_url;
            })
        );

        let addonsArray = addons ? JSON.parse(addons) : [];

        // Upload addon images
        if (req.files.some(f => f.fieldname.startsWith('addonImage'))) {
            addonsArray = await Promise.all(
                addonsArray.map(async (addon, index) => {
                    const addonFile = req.files.find(f => f.fieldname === `addonImage_${index}`);
                    if (addonFile) {
                        const uploaded = await cloudinary.uploader.upload(addonFile.path, { folder: 'addons' });
                        addon.image = uploaded.secure_url;
                    }
                    return addon;
                })
            );
        }

        // ⭐ Convert availableIn into array (incoming may be string)
        const emiratesArray = availableIn
            ? (Array.isArray(availableIn) ? availableIn : JSON.parse(availableIn))
            : [
                "Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain",
                "Ras Al Khaimah", "Fujairah", "Al Ain"
            ];

        const newProduct = new Product({
            name,
            price,
            stock,
            description,
            occasions,
            category,
            addons: addonsArray,
            image: imageUrls,

            // ⭐ ADD HERE
            availableIn: emiratesArray
        });

        await newProduct.save();

        res.status(200).json({
            message: 'Product added successfully',
            product: newProduct,
        });
    } catch (error) {
        console.log(error, 'error on addProduct');
        res.status(500).json({ message: error.message });
    }
};


const getProduct = async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json({ products })
    } catch (error) {
        console.log(error, 'error occured on getProduct')
        res.status(500).json({ message: error.message })
    }
}

const singleProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'product fetched', product })
    } catch (error) {
        console.log(error, 'error occured on singleProduct')
        res.status(500).json({ message: error.message })
    }
}

const editProduct = async (req, res) => {
    try {
        const { name, price, description, stock, occasions, category, addons, availableIn } = req.body;
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (name) product.name = name;
        if (price) product.price = price;
        if (description) product.description = description;
        if (stock) product.stock = stock;
        if (category) product.category = category;
        if (occasions) product.occasions = occasions;

        // ⭐ Update emirates availability
        if (availableIn) {
            product.availableIn = Array.isArray(availableIn)
                ? availableIn
                : JSON.parse(availableIn);
        }

        let addonsArray = addons ? (typeof addons === 'string' ? JSON.parse(addons) : addons) : product.addons;

        // addon image upload
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < addonsArray.length; i++) {
                const file = req.files.find(f => f.fieldname === `addonImage_${i}`);
                if (file) {
                    const uploaded = await cloudinary.uploader.upload(file.path, { folder: 'addons' });
                    addonsArray[i].image = uploaded.secure_url;
                }
            }
        }

        product.addons = addonsArray;

        // product images
        if (req.files && req.files.length > 0) {
            const uploadedImages = await Promise.all(
                req.files.map((file) => {
                    return cloudinary.uploader.upload(file.path, { folder: 'products' });
                })
            );

            product.image = uploadedImages.map((img) => ({
                url: img.secure_url,
                public_id: img.public_id
            }));
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.log(error, 'error at editProduct')
        res.status(500).json({ message: error.message })
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
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        fs.unlinkSync(req.file.path);

        if (!sheetData || sheetData.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty or invalid' });
        }

        const products = sheetData.map((row) => ({
            name: row.name,
            price: Number(row.price),
            stock: Number(row.stock),
            description: row.description,
            occasions: row.occasions || "General",
            category: row.category,

            // ⭐ Improved trimming
            availableIn: row.availableIn
                ? row.availableIn.split(',').map(e => e.trim())
                : [],

            image: row.image ? [row.image] : [],

            addons: row.addons
                ? JSON.parse(row.addons)
                : [],
        }));

        await Product.insertMany(products);

        res.status(200).json({
            message: `${products.length} products uploaded successfully`,
            count: products.length,
        });
    } catch (error) {
        console.error('Error in bulkUploadProducts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.bulkDeleteProducts = async (req, res) => {
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

module.exports = { addProduct, getProduct, singleProduct, editProduct, deleteProduct, bulkUploadProducts, getProductsByEmirate, checkCartAvailability }