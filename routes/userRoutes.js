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
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        // ✅ use your existing generateToken function
        const token = generateToken(req.user._id, res);

        // your generateToken already sets the cookie, so no need to call res.cookie again
        res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    }
);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/getUser', protectRoute, getUser)

module.exports = router;
