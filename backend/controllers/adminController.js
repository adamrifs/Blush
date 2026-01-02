const generateToken = require("../config/utils")
const Admin = require("../models/adminSchema")
const bcrypt = require('bcryptjs')

const adminRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(500).json({ message: "all fields required" })
        }
        const existingAdmin = await Admin.findOne({ email })
        if (existingAdmin) {
            return res.status(500).json({ message: 'admin already exist' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword
        })
        await newAdmin.save()
        res.status(200).json({ message: 'admin account created succesfull' })
    } catch (error) {
        console.log(error, 'error occured on adminRegister')
        res.status(500).json({ message: error.message })
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(500).json({ message: 'all fields required' })
        }
        const existingAdmin = await Admin.findOne({ email })
        if (!existingAdmin) {
            return res.status(400).json({ message: 'admin not found' })
        }
        const comparePassword = await bcrypt.compare(password, existingAdmin.password)
        if (!comparePassword) {
            return res.status(500).json({ message: 'password not match' })
        }
        const token = generateToken(existingAdmin._id, res)
        res.status(200).json({ message: 'login succesfull', email: existingAdmin.email, token })

    } catch (error) {
        console.log(error, 'error occured on adminLogin')
        res.status(500).json({ message: error.message })
    }
}

const adminLogout = async (req, res) => {
    try {
        res.cookie('jwt', "", { maxAge: 0 })
        res.status(200).json({ message: 'logout succesfull' })
    } catch (error) {
        console.log(error, 'error occured on adminLogin')
        res.status(500).json({ message: error.message })
    }
}

const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            admin: req.admin, 
        });
    } catch (err) {
        res.status(401).json({ message: "Not authenticated" });
    }
};

module.exports = { adminLogin, adminRegister, adminLogout ,getMe}