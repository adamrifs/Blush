const express = require('express')
const { addProduct, getProduct, editProduct, deleteProduct, singleProduct, bulkUploadProducts, getProductsByEmirate, checkCartAvailability, bulkDeleteProducts, bulkPreviewProducts, exportProductsExcel, } = require('../controllers/productController')
const upload = require('../middleware/multer')
const protectRoute = require('../middleware/adminMiddleware')
const router = express.Router()

router.post('/addProduct', upload.any(), protectRoute, addProduct)
router.post('/check-cart', checkCartAvailability)
router.get('/getProduct', getProduct)
router.get('/singleProduct/:idOrSlug', singleProduct)
router.get('/filter', getProductsByEmirate)
router.put('/editProduct/:id', upload.any(), protectRoute, editProduct)
router.delete('/deleteProduct/:id', protectRoute, deleteProduct)
router.get("/export-excel", exportProductsExcel);

router.post('/bulkUpload', upload.single('file'), protectRoute, bulkUploadProducts);
router.post("/bulk-preview",upload.single("file"),bulkPreviewProducts);
router.post("/bulkDelete", protectRoute, bulkDeleteProducts);
module.exports = router