const User = require('../models/userSchema.js');
const bcrypt = require('bcryptjs');
const generateToken = require('../config/utils.js');

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
        res.status(500).json({ message: error.message });
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
module.exports = { registerUser, loginUser, logoutUser, getUser }