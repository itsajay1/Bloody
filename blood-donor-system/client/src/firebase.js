import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
// Placedholders used here, actual config will be passed via .env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy_placeholder",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "blood-donor-system.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "blood-donor-system",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "blood-donor-system.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234:web:5678"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = typeof window !== 'undefined' && 'Notification' in window ? getMessaging(app) : null;

// Helper function to request notification permission and get the token
export const requestForToken = async () => {
  if (!messaging) return null;

  try {
    const currentToken = await getToken(messaging, { 
      // VAPID key is required for web push notifications. Add to .env when available.
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || 'YOUR_VAPID_KEY_PLACEHOLDER' 
    });
    
    if (currentToken) {
      console.log('FCM Token generated:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
