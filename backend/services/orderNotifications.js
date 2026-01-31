const AdminSettings = require("../models/AdminSettings");
const firebaseAdmin = require("../config/firebaseAdmin");
const { sendNewOrderEmail } = require("./notificationEmails");

exports.notifyAdmins = async (order, app) => {
    const io = app.locals.io;

    if (!io) {
        console.log("❌ Socket IO not available");
        return;
    }

    const settingsList = await AdminSettings.find({});
    let allPushTokens = [];

    for (const settings of settingsList) {

        // 🔔 SOCKET (ADMIN PANEL OPEN)
        io.to(`admin_${settings.adminId}`).emit("notification", {
            type: "order_created",
            title: "New Order",
            message: `Order #${order._id} has been placed`,
            orderId: order._id,
            time: new Date(),
        });

        // 📧 EMAIL
        if (settings.emailEnabled && settings.email) {
            await sendNewOrderEmail(settings.email, order);
        }

        // 📲 PUSH TOKENS
        if (settings.pushTokens?.length) {
            allPushTokens.push(...settings.pushTokens);
        }
    }

    // 🚀 FIREBASE PUSH (ADMIN PANEL CLOSED)
    if (allPushTokens.length > 0) {
        await firebaseAdmin.messaging().sendEachForMulticast({
            tokens: allPushTokens,
            notification: {
                title: "🛒 New Order Received",
                body: `Order #${order._id} has been placed`,
            },
            data: {
                type: "order_created",
                orderId: order._id.toString(),
            },
        });
    }
};
