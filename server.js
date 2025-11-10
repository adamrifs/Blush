const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db.js')
const adminRoutes = require('./routes/adminRoutes.js')
const productRoutes = require('./routes/productRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const cartRoutes = require('./routes/cartRoutes.js')
const connectCloudinary = require('./config/cloudinary.js')
const cookieParser = require('cookie-parser');
const passport = require("passport");
require("./config/passport.js");
dotenv.config()

const app = express()
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'https://blush-beige.vercel.app', 'https://blush-adminpannel.vercel.app'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));
app.use(passport.initialize());
app.use(passport.session());

connectDB()
connectCloudinary()

app.use('/api/admin', adminRoutes)
app.use('/api/product', productRoutes)
app.use('/api/user', userRoutes)
app.use('/api/cart',cartRoutes)
const port = process.env.PORT

app.listen(port, () => {
    console.log(`server running succesfull on port ${port}`)
})
