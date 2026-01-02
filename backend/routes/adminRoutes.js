const express = require('express')
const { adminRegister, adminLogin, adminLogout, getMe } = require('../controllers/adminController')
const protectRoute = require('../middleware/adminMiddleware')
const router = express.Router()

router.post('/adminRegister', adminRegister)
router.post('/adminLogin', adminLogin)
router.post('/adminLogout', adminLogout)
router.get("/me", protectRoute, getMe);

module.exports = router
