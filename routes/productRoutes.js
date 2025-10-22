const express = require('express')
const { addProduct, getProduct, editProduct, deleteProduct, singleProduct } = require('../controllers/productController')
const upload = require('../middleware/multer')
const protectRoute = require('../middleware/adminMiddleware')
const router = express.Router()

router.post('/addProduct', upload.any(), protectRoute, addProduct)
router.get('/getProduct', getProduct)
router.get('/singleProduct/:id', singleProduct)
router.put('/editProduct/:id', upload.any(), protectRoute, editProduct)
router.delete('/deleteProduct/:id', protectRoute, deleteProduct)

module.exports = router