importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing config params
// Note: Service workers don't have access to process.env or Vite's import.meta.env, 
// so config needs to either be hardcoded or injected during a build step.
// For now, using placeholders.
const firebaseConfig = {
  apiKey: "AIzaSy_placeholder",
  authDomain: "blood-donor-system.firebaseapp.com",
  projectId: "blood-donor-system",
  storageBucket: "blood-donor-system.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234:web:5678"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
