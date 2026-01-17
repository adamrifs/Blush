const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db.js')
const adminRoutes = require('./routes/adminRoutes.js')
const productRoutes = require('./routes/productRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
const cartRoutes = require('./routes/cartRoutes.js')
const addressRoutes = require('./routes/addressRoutes.js')
const paymentRoutes = require('./routes/paymentRoutes.js')
const webhookRoutes = require('./routes/webhookRoutes.js')
const stripeWebhookRoutes = require("./routes/stripeWebhookRoutes")
const orderRoutes = require('./routes/orderRoutes.js');
const pushRoutes = require('./routes/pushRoutes.js')
const customerRoutes = require('./routes/customerRoutes.js')
const settingsRoutes = require('./routes/settingsRoutes.js')
const mediaRoutes = require('./routes/mediaRoutes.js')
const connectCloudinary = require('./config/cloudinary.js')
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config()
const passport = require("passport");
require("./config/passport.js");
const http = require('http');
const { Server } = require('socket.io');

const app = express()
app.set("trust proxy", 1);
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        'https://www.blushflowers.ae',
        'https://blushflowers.ae'
    ],
    credentials: true
}))
app.use("/api/payment", stripeWebhookRoutes)
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
app.use("/api/payment", paymentRoutes)
app.use("/webhooks", webhookRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/push", pushRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/settings', settingsRoutes);
app.use("/api/media", mediaRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    },
    transports: ["polling", "websocket"],
    allowEIO3: true,
    path: "/socket.io"
});

app.locals.io = io;

io.on('connection', async (socket) => {


    const cookieHeader = socket.request.headers.cookie;
    let adminId = null;

    if (cookieHeader) {
        const jwtCookie = cookieHeader
            .split("; ")
            .find((row) => row.startsWith("jwt="));

        if (jwtCookie) {
            const token = jwtCookie.split("=")[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                adminId = decoded.id;
            } catch (err) {
                console.log("Failed to decode JWT in socket");
            }
        }
    }

    // --- FIXED: always join admin room automatically ---
    if (adminId) {
        socket.join(`admin_${adminId}`);
        console.log("Navbar joined room:", `admin_${adminId}`);
    }
    socket.on("join-admin-navbar", () => {
        if (adminId) {
            socket.join(`admin_${adminId}`);
            console.log("Navbar explicitly joined:", `admin_${adminId}`);
        }
    });

    console.log("Cookie header:", cookieHeader);
    console.log("Decoded adminId:", adminId);

});



const port = process.env.PORT

server.listen(port, () => {
    console.log(`server running succesfull on port ${port}`)
})
