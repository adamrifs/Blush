const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");

dotenv.config();

/* =========================
   IMPORT ROUTES
========================= */
const connectDB = require("./config/db.js");
const connectCloudinary = require("./config/cloudinary.js");

const adminRoutes = require("./routes/adminRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const addressRoutes = require("./routes/addressRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const pushRoutes = require("./routes/pushRoutes.js");
const customerRoutes = require("./routes/customerRoutes.js");
const settingsRoutes = require("./routes/settingsRoutes.js");
const mediaRoutes = require("./routes/mediaRoutes.js");
const notificationRoutes = require('./routes/notificationRoutes.js')
require("./config/passport.js");

/* =========================
   APP INIT
========================= */
const app = express();
app.set("trust proxy", 1);

/* =========================
   STRIPE WEBHOOK (RAW BODY)
   ⚠️ MUST BE BEFORE express.json()
========================= */
app.use(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    require("./routes/stripeWebhookRoutes")
);

/* =========================
   ALLOWED ORIGINS
========================= */
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://blushflowers.ae",
    "https://www.blushflowers.ae",
    "https://admin.blushflowers.ae",
];

/* =========================
   CORS
========================= */
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

/* =========================
   NORMAL MIDDLEWARE
========================= */
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(passport.initialize());

/* =========================
   HTTP SERVER + SOCKET.IO
========================= */
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
    transports: ["websocket", "polling"],
});

app.locals.io = io;

/* =========================
   SOCKET CONNECTION
========================= */
io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    const adminId = socket.handshake.auth?.adminId;

    if (adminId) {
        socket.join(`admin_${adminId}`);
        console.log("✅ Admin joined room:", `admin_${adminId}`);
    }

    socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
    });
});

setTimeout(() => {
    if (app.locals.io) {
        console.log("🧪 Emitting test notification");
        app.locals.io.emit("notification", {
            title: "Test Notification",
            message: "If you see this, socket works",
        });
    }
}, 5000);

/* =========================
   CONNECT SERVICES
========================= */
connectDB();
connectCloudinary();

/* =========================
   API ROUTES
========================= */
app.use("/api/admin", adminRoutes);
app.use("/api/product", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/push", pushRoutes);
app.use("/api",notificationRoutes)
app.use("/api/customers", customerRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/media", mediaRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
    res.send("🚀 Blush API running");
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`🚀 Server running successfully on port ${PORT}`);
});
