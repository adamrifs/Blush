const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db.js')
const adminRoutes = require('./routes/adminRoutes.js')
const productRoutes = require('./routes/productRoutes.js')
const connectCloudinary = require('./config/cloudinary.js')
const cookieParser = require('cookie-parser');
dotenv.config()

const app = express()
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://blush-adminpannel.vercel.app'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));

connectDB()
connectCloudinary()

app.use('/api/admin', adminRoutes)
app.use('/api/product', productRoutes)
const port = process.env.PORT

app.listen(port, () => {
    console.log(`server running succesfull on port ${port}`)
})
