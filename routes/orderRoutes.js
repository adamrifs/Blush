const express = require("express");
const router = express.Router();

const protectRoute = require("../middleware/adminMiddleware");  // ← your existing middleware

const {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

// USER ROUTES
router.post("/create", createOrder);
router.get("/user/:userId", getUserOrders);
router.get("/:id", getOrderById);

// ADMIN ROUTES (protected)
router.get("/admin/all", protectRoute, getAllOrders);
router.put("/admin/:id/status", protectRoute, updateOrderStatus);

module.exports = router;
