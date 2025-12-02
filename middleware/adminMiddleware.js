const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const Admin = require('../models/adminSchema')
dotenv.config()

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(500).json({ message: 'token required' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(500).json({ message: 'unauthorized login' })
        }
        const admin = await Admin.findById(decoded.id).select('-password')
        if (!admin) {
            res.status(400).json({ message: 'admin not found' })
        }
        req.admin = admin
        next()
    } catch (error) {
        console.log(error, 'error occured on protectRoute')
    }
}
module.exports = protectRoute