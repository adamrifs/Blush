const express = require('express');
const { registerUser, loginUser, logoutUser, getUser } = require('../controllers/userController.js');
const protectRoute = require('../middleware/authMiddleware.js')

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/getUser',protectRoute, getUser)
                                                              
module.exports = router;
