const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()


// In production we need sameSite: "none" + secure: true for cross-site requests
// In development we relax to sameSite: "lax" and secure: false for localhost

const generateToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5d' })
    res.cookie("jwt", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production'
    })
    return token
}
module.exports = generateToken