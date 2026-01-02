const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function () {
            return !this.googleId; // ✅ No password needed for Google users
        },
    },
    profileImage: {
        type: String,
        default: "",
    },
    googleId: { type: String },
    subscription: { type: Object, default: null },
}, { timestamps: true })

const User = mongoose.model('user', userSchema)
module.exports = User