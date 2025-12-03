const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const Admin = require('../models/adminSchema')
dotenv.config()

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const admin = await Admin.findById(decoded.id).select("-password");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.log("Error in protectRoute:", error);
        res.status(401).json({ message: "Authorization failed" });
    }
};

module.exports = protectRoute