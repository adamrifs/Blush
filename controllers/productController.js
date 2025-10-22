const cloudinary = require('cloudinary');
const Product = require('../models/productSchema');

const addProduct = async (req, res) => {
    try {
        const { name, price, stock, description, occasions, category, addons } = req.body;

        if (!name || !price || !stock || !description || !occasions || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        let imageUrls = await Promise.all(
            req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'products',
                });
                return result.secure_url
            })
        )

        let addonsArray = addons ? JSON.parse(addons) : [];

        // 3️⃣ Upload addon images if they exist
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


        const newProduct = new Product({
            name,
            price,
            stock,
            description,
            occasions,
            category,
            addons: addonsArray,
            image: imageUrls
        })
        await newProduct.save()
        res.status(200).json({
            message: 'Product added successfully',
            product: newProduct,
        });
    } catch (error) {
        console.log(error, 'error occured on addProduct')
        res.status(500).json({ message: error.message })
    }
}

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
        const { name, price, description, stock, occasions, category, addons } = req.body
        const { id } = req.params

        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (name) product.name = name
        if (price) product.price = price
        if (description) product.description = description
        if (stock) product.stock = stock
        if (category) product.category = category
        if (occasions) product.occasions = occasions

        let addonsArray = addons ? (typeof addons === 'string' ? JSON.parse(addons) : addons) : product.addons;

        // Upload addon images if any
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
        if (req.files && req.files.length > 0) {
            const uploadedImages = await Promise.all(
                req.files.map((file) => {
                    return cloudinary.uploader.upload(file.path, {
                        folder: 'products'
                    })
                })
            )

            product.image = uploadedImages.map((img) => ({
                url: img.secure_url,
                public_id: img.public_id
            }))
        }
        await product.save()
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.log(error, 'error occured on editProduct')
        res.status(500).json({ message: error.message })
    }
}

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

module.exports = { addProduct, getProduct, singleProduct, editProduct, deleteProduct }