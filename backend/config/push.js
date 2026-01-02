const webPush = require("web-push");

webPush.setVapidDetails(
  "mailto:admin@blush.com",
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

exports.sendPushNotification = (subscription, payload) => {
  try {
    webPush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    console.log("Push error:", err);
  }
};
