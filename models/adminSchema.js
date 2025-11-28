const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    subscription: { type: Object, default: null },
}, {
    timestamps: true
})

const Admin = mongoose.model('admin', adminSchema)
module.exports = Admin
