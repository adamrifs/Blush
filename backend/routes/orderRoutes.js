const express = require("express");
const router = express.Router();

const protectRoute = require("../middleware/adminMiddleware");  // ← your existing middleware

const {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    getOrdersByCustomer,
    getOrderBySessionId,
    markAllOrdersRead
} = require("../controllers/orderController");

// USER ROUTES
router.post("/create", createOrder);
router.get("/user/:userId", getUserOrders);
router.get("/:id", getOrderById);
router.get("/byCustomer/:id", getOrdersByCustomer);

// ADMIN ROUTES (protected)
router.get("/admin/all", protectRoute, getAllOrders);
router.put("/admin/:id/status", protectRoute, updateOrderStatus);
router.patch("/admin/mark-read", protectRoute, markAllOrdersRead);

// GET ORDER USING STRIPE SESSION ID
router.get("/by-session/:sessionId", getOrderBySessionId);

module.exports = router;
