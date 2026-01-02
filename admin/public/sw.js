// public/sw.js
self.addEventListener("push", function (event) {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = { title: "New notification", message: "You have a message" };
  }

  const title = payload.title || "New Notification";
  const options = {
    body: payload.message || "",
    icon: payload.icon || "/favicon.ico",
    data: payload.data || {},
    badge: payload.badge || "/favicon.ico",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(urlToOpen));
});
