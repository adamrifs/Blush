const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");
const User = require("../models/userSchema");
const AdminSettings = require('../models/AdminSettings');
const { sendEmail } = require('../config/emailSender');
const Admin = require("../models/adminSchema");
const firebaseAdmin = require("../config/firebaseAdmin");
const { sendNewOrderEmail, sendOrderCancelledEmail, sendPaymentFailedEmail } = require("../services/notificationEmails");
const { notifyAdmins } = require("../services/orderNotifications");
const OrderNotification = require('../models/OrderNotification')

exports.createOrder = async (req, res) => {
  try {

    // ✅ ONLY for COD / NO PAYMENT
    if (req.body.paymentMethod !== "cod") {
      return res.status(400).json({
        message: "Order must be created after payment confirmation",
      });
    }

    const order = new Order({
      ...req.body,
      payment: {
        method: "cod",
        status: "pending",
      },
    });

    await order.save();

    await OrderNotification.create({
      title: 'New Order Received',
      message: `Order #${order._id} has been placed`
    });

    await notifyAdmins(order, req.app.locals.io);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ORDERS (ADMIN)

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price image description category")
      .populate("userId", "name email phone");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("Get All Orders Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// GET ORDER BY ID
// ===============================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productId", "name price image description category")
      .populate("userId", "name email phone subscription");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log("Get Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getOrdersByCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;

    const orders = await Order.find({ userId: customerId })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price image description category");

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.log("Get Orders By Customer Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// ===============================
// GET USER ORDERS
// ===============================
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price image description category");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("Get User Orders Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// UPDATE ORDER STATUS (ADMIN)
// ===============================
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findById(orderId).populate("userId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    // 📧 ORDER CANCELLED EMAIL
    if (status === "cancelled") {
      const adminSettingsList = await AdminSettings.find({});

      for (const settings of adminSettingsList) {
        if (settings.emailEnabled && settings.email) {
          await sendOrderCancelledEmail(settings.email, order);
        }
      }
    }

    // 🔥 SEND PUSH NOTIFICATION IF USER IS SUBSCRIBED
    if (order.userId && order.userId.subscription) {
      await sendPushNotification(order.userId.subscription, {
        title: "Blush Order Update 💐",
        message: `Your order is now ${status.replace(/_/g, " ")}.`,
      });
      console.log("Push notification sent!");
    }

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.log("Status Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// DELETE ORDER (OPTIONAL)
// ===============================
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.log("Delete Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ORDER BY STRIPE SESSION ID
exports.getOrderBySessionId = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const order = await Order.findOne({
      "payment.orderId": sessionId,
    }).populate("items.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Get order by session error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.markAllOrdersRead = async (req, res) => {
  const result = await Order.updateMany(
    { isReadByAdmin: false },
    { $set: { isReadByAdmin: true } }
  );

  console.log("Orders marked read:", result.modifiedCount);

  res.json({ success: true });
};

