const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");
const User = require("../models/userSchema");
const webPush = require("web-push");
const AdminSettings = require('../models/AdminSettings');
const { sendEmail } = require('../config/emailSender');
const Admin = require("../models/adminSchema");
// VAPID CONFIG

webPush.setVapidDetails(
  "mailto:admin@blush.com",
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

// Reusable function to send push notifications
const sendPushNotification = async (subscription, payload) => {
  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    console.log("Push send error:", err);
  }
};

// CREATE ORDER
// for production
// exports.createOrder = async (req, res) => {
//     try {
//         if (!req.body.cardMessage) {
//             req.body.cardMessage = {
//                 option: "no_card",
//                 messageHTML: "",
//                 messageText: "",
//                 template: ""
//             };
//         }
//         //  Create order
//         const order = new Order(req.body);
//         await order.save();

//         //  Fetch ALL admin settings (each admin has own toggles)
//         const admins = await AdminSettings.find();

//         //  Load socket.io instance
//         const io = req.app.locals.io;

//         //  Notify all admins based on their settings
//         for (const settings of admins) {

//             // ==========================
//             // SOCKET.IO REAL-TIME ALERT
//             // ==========================
//             if (io) {
//                 io.to(`admin_${settings.adminId}`).emit("notification", {
//                     type: "order_created",
//                     title: "New Order",
//                     message: `Order #${order._id} has been placed`,
//                     orderId: order._id,
//                     time: new Date(),
//                 });
//             }

//             // ==========================
//             // EMAIL ALERT (RESEND)
//             // ==========================
//             if (settings.emailEnabled && settings.email) {
//                 const html = `
//     <h2>New Order Received</h2>
//     <p><strong>Order ID:</strong> ${order._id}</p>
//     <p><strong>Total:</strong> ${order.total || "N/A"}</p>

//     ${order.cardMessage?.option === "want_card" ?
//           `<hr/>
//           <h3>Card Message</h3>
//           <p><strong>Template:</strong> ${order.cardMessage.template}</p>
//           <div>${order.cardMessage.messageHTML}</div>`
//            : ""}
//           <p>A new order has been placed on your store.</p>`;

//                 await sendEmail(
//                     settings.email,
//                     `New Order #${order._id}`,
//                     html
//                 );

//                 console.log("Resend → Email sent to:", settings.email);
//             }
//         }

//         //  Legacy push system (optional)
//         const admin = await Admin.findOne();
//         if (admin?.subscription) {
//             await webPush.sendNotification(
//                 admin.subscription,
//                 JSON.stringify({
//                     title: "New Order Received 💐",
//                     message: `Order #${order._id} has been placed.`,
//                 })
//             );
//         }

//         //  Final response
//         res.status(201).json({
//             success: true,
//             message: "Order created successfully",
//             order,
//         });

//     } catch (error) {
//         console.log("Create Order Error:", error);
//         res.status(500).json({ message: error.message });
//     }
// };

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

    // 1️⃣ SAVE ORDER (CRITICAL PATH)
    const order = new Order(req.body);
    await order.save();

    // 2️⃣ NON-CRITICAL SIDE EFFECTS
    try {
      const admins = await AdminSettings.find();
      const io = req.app.locals.io;

      for (const settings of admins) {
        if (io) {
          io.to(`admin_${settings.adminId}`).emit("notification", {
            type: "order_created",
            title: "New Order",
            message: `Order #${order._id} has been placed`,
            orderId: order._id,
            time: new Date(),
          });
        }

        if (settings.emailEnabled && settings.email) {
          await sendEmail(
            settings.email,
            `New Order #${order._id}`,
            `<p>Order ${order._id} created</p>`
          );
        }
      }
    } catch (notifyErr) {
      console.log("Notifications skipped:", notifyErr.message);
    }

    // 3️⃣ LEGACY PUSH (OPTIONAL)
    try {
      const admin = await Admin.findOne();
      if (admin?.subscription) {
        await webPush.sendNotification(
          admin.subscription,
          JSON.stringify({
            title: "New Order",
            message: `Order #${order._id}`,
          })
        );
      }
    } catch (pushErr) {
      console.log("Web push skipped:", pushErr.message);
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
// GET ORDER BY STRIPE SESSION ID
exports.getOrderBySessionId = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const order = await Order.findOne({
      "payment.orderId": sessionId,
    })
      .populate("items.productId", "name price image description category")
      .populate("userId", "name email phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log("Get Order By Session Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
