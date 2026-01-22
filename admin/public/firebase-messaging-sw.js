importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBSzWXbFeAdrrrF1yyLqR8MmKwtGMVqDFU",
  authDomain: "blush-admin-notifications.firebaseapp.com",
  projectId: "blush-admin-notifications",
  messagingSenderId: "385795858857",
  appId: "1:385795858857:web:10152cd3b24c8bfee8a4b8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("🔥 FCM Background message:", payload);

  const { title, body } = payload.data || payload.notification || {};

  self.registration.showNotification(title || "New Notification", {
    body: body || "",
    icon: "/logo.png",
  });
});

self.addEventListener("push", (event) => {
  console.log("🔥 Raw push event received");

  if (!event.data) {
    self.registration.showNotification("New Notification", {
      body: "No payload",
    });
    return;
  }

  let data = {};

  try {
    // Try JSON first (real FCM)
    data = event.data.json();
  } catch (e) {
    // Fallback for DevTools test push
    data = {
      title: "Test Push",
      body: event.data.text(),
    };
  }

  self.registration.showNotification(data.title || "New Notification", {
    body: data.body || "",
    icon: "/logo.png",
  });
});
