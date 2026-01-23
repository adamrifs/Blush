const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");
const User = require("../models/userSchema");
const AdminSettings = require('../models/AdminSettings');
const { sendEmail } = require('../config/emailSender');
const Admin = require("../models/adminSchema");
const firebaseAdmin = require("../config/firebaseAdmin");

exports.createOrder = async (req, res) => {
  try {
    
    if (!req.body.cardMessage) {
      req.body.cardMessage = {
        option: "no_card",
        messageHTML: "",
        messageText: "",
        template: ""
      };
    }

    // 2️⃣ CREATE & SAVE ORDER
    const order = new Order(req.body);
    await order.save();

    // 3️⃣ NOTIFICATIONS (Socket + Email + Push)
    try {
      const adminSettingsList = await AdminSettings.find({
        pushTokens: { $exists: true, $ne: [] }
      });



      const io = req.app.locals.io;
      let allPushTokens = [];

      for (const settings of adminSettingsList) {

        // 🔔 SOCKET NOTIFICATION (Admin panel OPEN)
        if (io) {
          io.to(`admin_${settings.adminId}`).emit("notification", {
            type: "order_created",
            title: "New Order",
            message: `Order #${order._id} has been placed`,
            orderId: order._id,
            time: new Date(),
          });
        }

        // 📧 EMAIL NOTIFICATION
        if (settings.emailEnabled && settings.email) {
          await sendEmail(
            settings.email,
            `New Order #${order._id}`,
            `<p><strong>New Order Received</strong></p>
             <p>Order ID: ${order._id}</p>`
          );
        }

        // 📲 COLLECT PUSH TOKENS
        if (settings.pushTokens && settings.pushTokens.length > 0) {
          allPushTokens.push(...settings.pushTokens);
        }
      }

      // 🚀 PUSH NOTIFICATION (Admin panel CLOSED)
      if (allPushTokens.length > 0) {
        const response = await firebaseAdmin.messaging().sendMulticast({
          tokens: allPushTokens,
          data: {
            title: "🛒 New Order Received",
            body: `Order #${order._id} has been placed`,
            type: "order_created",
            orderId: order._id.toString(),
          },
        });

        console.log("🔥 FCM response:", response);
      }

    } catch (notifyErr) {
      console.log("Notification error (ignored):", notifyErr.message);
    }

    // 4️⃣ SUCCESS RESPONSE
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });

  } catch (error) {
    console.log("Create Order Error:", error);
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


