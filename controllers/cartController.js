const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");

const addToCart = async (req, res) => {
    try {
        const { productId, quantity, addons, sessionId } = req.body;
        const userId = req.user ? req.user._id : null;

        // Fetch product base price
        const product = await Product.findById(productId).select("price");
        if (!product) return res.status(404).json({ message: "Product not found" });

        const basePrice = product.price;

        // Find cart
        let cart = userId
            ? await Cart.findOne({ userId })
            : await Cart.findOne({ sessionId });

        if (!cart) {
            cart = new Cart({
                userId,
                sessionId,
                items: [{
                    productId,
                    quantity,
                    addons,
                    basePrice
                }]
            });
        } else {
            const index = cart.items.findIndex(
                item => item.productId.toString() === productId
            );

            if (index > -1) {
                cart.items[index].quantity += quantity;
            } else {
                cart.items.push({
                    productId,
                    quantity,
                    addons,
                    basePrice,
                });
            }
        }

        await cart.save();
        return res.status(200).json({
            message: "Item added to cart with VAT applied",
            cart
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};


const getCart = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        const { sessionId } = req.query;

        const cart = await Cart.findOne(
            userId ? { userId } : { sessionId }
        ).populate("items.productId", "name price image description");

        if (!cart) return res.json({ items: [] });
        res.status(200).json(cart);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


const mergeCart = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const userId = req.user._id;

        const guestCart = await Cart.findOne({ sessionId });
        const userCart = await Cart.findOne({ userId });

        if (!guestCart) return res.status(200).json({ message: "No guest cart found" });

        if (!userCart) {
            guestCart.userId = userId;
            guestCart.sessionId = null;
            await guestCart.save();
        } else {
            guestCart.items.forEach((guestItem) => {
                const existingProducts = userCart.items.find((item) => {
                    const userProdId = item.productId._id ? item.productId._id.toString() : item.productId.toString();
                    const guestProdId = guestItem.productId._id ? guestItem.productId._id.toString() : guestItem.productId.toString();
                    return userProdId === guestProdId;
                });

                if (existingProducts) {
                    existingProducts.quantity += guestItem.quantity;
                } else {
                    userCart.items.push(guestItem);
                }
            });

            await userCart.save();
            await guestCart.deleteOne();
        }

        res.status(200).json({ message: "Cart merged successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const { productId, sessionId } = req.body
        const userId = req.user ? req.user._id : null

        const cart = await Cart.findOne(userId ? { userId } : { sessionId })
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const filteredItem = cart.items.filter((item) => item.productId.toString() !== productId.toString())
        cart.items = filteredItem
        await cart.save()
        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
}

const clearCart = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        const { sessionId } = req.body;

        // Find the cart
        const cart = await Cart.findOne(userId ? { userId } : { sessionId });
        if (!cart) return res.status(200).json({ message: "Cart already empty" });

        // Clear items
        cart.items = [];
        await cart.save();

        res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to clear cart" });
    }
};


const updateQuantity = async (req, res) => {
    try {
        const { productId, sessionId, quantity } = req.body
        const userId = req.user ? req.user._id : null

        const cart = await Cart.findOne(userId ? { userId } : { sessionId })
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find((item) => item.productId.toString() === productId)
        if (!item) return res.status(404).json({ message: 'Item not found in cart' });

        item.quantity = quantity
        await cart.save()
        res.status(200).json({ message: 'Cart updated', cart });

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
}

module.exports = { addToCart, getCart, mergeCart, removeFromCart, updateQuantity, clearCart }