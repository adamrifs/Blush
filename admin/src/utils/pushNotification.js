// src/utils/pushNotification.js
import { getToken } from "firebase/messaging";   // ✅ MISSING IMPORT
import { messaging } from "../firebase";         // ✅ MISSING IMPORT
import { serverUrl } from "../../urls";          // ✅ MISSING IMPORT

export const registerAdminPush = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("PERMISSION:", permission);

    if (permission !== "granted") {
      console.log("❌ Permission not granted");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    console.log("🔥 FCM TOKEN:", token);

    if (!token) {
      console.log("❌ Token is NULL");
      return;
    }

    const res = await fetch(`${serverUrl}/settings/push-token`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    console.log("BACKEND RESPONSE:", data);
  } catch (err) {
    console.error("❌ Push registration failed", err);
  }
};
