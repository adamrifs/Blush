// src/utils/pushNotification.js
import { io } from "socket.io-client";
import { serverUrl } from "../../urls";   // ✅ Using your serverUrl everywhere

export async function registerAdminPush(vapidPublicKey, adminId) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications not supported in this browser.");
  }

  try {
    // 1) Register service worker
    const reg = await navigator.serviceWorker.register("/sw.js");
    console.log("Service worker registered:", reg);

    // 2) Ask notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission not granted.");
    }

    // 3) Subscribe to push
    function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const rawData = window.atob(base64);
      return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    }

    const existing = await reg.pushManager.getSubscription();
    const subscription =
      existing ||
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      }));

    console.log("Push subscription:", subscription);

    // 4) SEND SUBSCRIPTION TO BACKEND (using serverUrl)
    const response = await fetch(`${serverUrl}/push/admin/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        adminId,
        subscription,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Push subscribe failed:", err);
      throw new Error("Failed to subscribe on server");
    }

    console.log("Subscription sent to backend");

    // 5) SOCKET CONNECTION
    const SOCKET_URL = serverUrl.replace("/api", ""); // https://domain.com

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      if (adminId) socket.emit("join-admin", adminId);
    });

    socket.on("notification", (payload) => {
      console.log("Socket notification received:", payload);

      if (Notification.permission === "granted") {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            reg.showNotification(payload.title || "Notification", {
              body: payload.message || "",
              data: payload,
            });
          }
        });
      }
    });

    socket.on("disconnect", () => console.log("Socket disconnected"));

    return { success: true, subscription };
  } catch (error) {
    console.error("registerAdminPush error:", error);
    return { success: false, error: error?.message || error };
  }
}
