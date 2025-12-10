const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db.js')
const adminRoutes = require('./routes/adminRoutes.js')
const productRoutes = require('./routes/productRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const cartRoutes = require('./routes/cartRoutes.js')
const addressRoutes = require('./routes/addressRoutes.js')
const paymobRoutes = require("./routes/paymobRoutes.js");
const orderRoutes = require('./routes/orderRoutes.js');
const pushRoutes = require('./routes/pushRoutes.js')
const customerRoutes = require('./routes/customerRoutes.js')
const settingsRoutes = require('./routes/settingsRoutes.js')
const connectCloudinary = require('./config/cloudinary.js')
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
dotenv.config()
const passport = require("passport");
require("./config/passport.js");
const http = require('http');
const { Server } = require('socket.io');

const app = express()
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'https://blush-beige.vercel.app', 'https://blush-adminpannel.vercel.app'],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));
app.use(passport.initialize());


connectDB()
connectCloudinary()

app.use('/api/admin', adminRoutes)
app.use('/api/product', productRoutes)
app.use('/api/user', userRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/address', addressRoutes)
app.use("/api/payment/paymob", paymobRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/push", pushRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/settings', settingsRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: true, credentials: true } 
});

// Make io accessible in controllers via app.locals
app.locals.io = io;


io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);

    socket.on('join-admin', (adminId) => {
        socket.join(`admin_${adminId}`);
        console.log(`Admin joined room: admin_${adminId}`);
    });
    socket.on("join-admin-navbar", () => {
        console.log("Navbar connected:", socket.id);
    });

    socket.on('disconnect', () => {
        console.log('socket disconnected', socket.id);
    });
});


const port = process.env.PORT

app.listen(port, () => {
    console.log(`server running succesfull on port ${port}`)
})
