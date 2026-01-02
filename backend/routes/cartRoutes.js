const express = require('express')
const { addToCart, getCart, mergeCart, removeFromCart, updateQuantity, clearCart } = require('../controllers/cartController')
const protectRoute = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/addToCart', addToCart)
router.get('/getCart', getCart)
router.delete('/removeCart',removeFromCart)
router.delete('/clearCart', clearCart);
router.put('/updateCart',updateQuantity)
router.post('/mergeCart', protectRoute, mergeCart)

module.exports = router