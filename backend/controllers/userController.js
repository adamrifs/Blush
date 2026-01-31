const User = require('../models/userSchema.js');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const generateToken = require('../config/utils.js');
const sendEmail = require("../config/sendEmail.js");

// Register
const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // hash password manually before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const user = await User.create({ firstname, lastname, email, password: hashedPassword });

        // generate and store JWT in cookie (using utils.js)
        generateToken(user._id, res);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // generate and send token
        const token = generateToken(user._id, res);

        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            },
            token
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to login. Please try again later."
        });
        console.log(error)
    }
};

// Logout
const logoutUser = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 }); // clear token cookie
    res.status(200).json({ message: 'Logged out successfully' });
};

// get user 
const getUser = async (req, res) => {
    try {
        const { id } = req.user
        const user = await User.findById(id).select('-password')
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error)
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        // ✅ Google user guard
        if (user?.googleId) {
            return res.status(200).json({
                message: "This account uses Google Sign-In.",
            });
        }

        if (!user) {
            return res.status(200).json({
                message: "If this email exists, a reset link has been sent.",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Reset Your Password",
            html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset.</p>
        <a href="${resetUrl}" style="padding:10px 15px;background:#0f708a;color:#fff;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
      `,
        });

        res.status(200).json({
            message: "Password reset link sent to your email.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to send reset email. Please try again.",
        });
    }
};

// POST /api/user/reset-password/:token
const resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            message: "Password reset successful. Please login."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Unable to reset password. Please try again."
        });
    }
};

module.exports = { registerUser, loginUser, logoutUser, getUser, forgotPassword, resetPassword }