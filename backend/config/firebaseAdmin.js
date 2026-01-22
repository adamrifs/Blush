const admin = require("firebase-admin");
const path = require("path");

// 🔐 Path to your Firebase service account key
const serviceAccount = require(path.join(
  __dirname,
  "../firebase-service-account.json"
));

// Prevent re-initialization (important for dev / hot reload)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
