import axios from "axios";
import { serverUrl } from "../../url";

export const registerPush = async (userId, publicKey) => {
  try {
    if (!("serviceWorker" in navigator)) {
      console.log("Service worker not supported");
      return;
    }

    // STEP 1 — Ask for Permission
    const permission = await Notification.requestPermission();

    // console.log("Notification Permission:", permission);

    if (permission !== "granted") {
      console.log("User denied notifications");
      return;
    }

    // STEP 2 — Wait for service worker to be READY
    const sw = await navigator.serviceWorker.ready;

    // console.log("Service Worker Ready:", sw);

    // STEP 3 — Subscribe to Push
    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey,
    });

    // console.log("SUBSCRIPTION CREATED:", subscription);

    // STEP 4 — Save to backend
    await axios.post(`${serverUrl}/push/subscribe`, {
      userId,
      subscription,
    });

    // console.log("Push subscription saved to backend");

  } catch (err) {
    console.log("Push Error:", err);
  }
};
