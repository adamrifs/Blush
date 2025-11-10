const express = require('express');
const { registerUser, loginUser, logoutUser, getUser } = require('../controllers/userController.js');
const protectRoute = require('../middleware/authMiddleware.js')
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// google authentication 
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
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

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/getUser', protectRoute, getUser)

module.exports = router;
