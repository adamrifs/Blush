const express = require('express');
const { registerUser, loginUser, logoutUser, getUser, forgotPassword, resetPassword } = require('../controllers/userController.js');
const protectRoute = require('../middleware/authMiddleware.js')
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// google authentication 
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/" }),
    (req, res) => {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("authToken", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    }
);

router.post("/google-login", async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log("✅ Google user verified:", payload);

        // Check if user exists
        let user = await require("../models/userSchema.js").findOne({ email: payload.email });
        if (!user) {
            user = await require("../models/userSchema.js").create({
                firstname: payload.given_name,
                lastname: payload.family_name,
                email: payload.email,
                googleId: payload.sub,
                 profileImage: payload.picture,
            });
        }

        // Generate JWT
        const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("authToken", authToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Google login successful",
            token: authToken,
            user,
        });
    } catch (error) {
        console.error("❌ Google login error:", error);
        res.status(400).json({ message: "Google login failed" });
    }
});


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/getUser', protectRoute, getUser)

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
