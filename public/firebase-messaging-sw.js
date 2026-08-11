importScripts(
  "https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js",
);

// ... باقي الكود الخاص بـ firebase.initializeApp كما هو تماماً

// إجابة سؤالك: نضع نفس الإعدادات هنا تماماً
firebase.initializeApp({
  apiKey: "AIzaSyALKXDZNNdv7KmkcLOnXpUwps8SJOuMa4s",
  authDomain: "cadeau-botique.firebaseapp.com",
  projectId: "cadeau-botique",
  storageBucket: "cadeau-botique.firebasestorage.app",
  messagingSenderId: "54619016346",
  appId: "1:54619016346:web:40ee6954929f6eef792323", // الرمز الكامل
  measurementId: "G-XQZV7KL2FS",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
