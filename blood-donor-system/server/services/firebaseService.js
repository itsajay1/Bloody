import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// Attempt to initialize Firebase Admin SDK using properties from env or service account
let firebaseInitialized = false;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('ascii'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseInitialized = true;
    console.log('Firebase Admin initialized successfully from Base64 env variable');
  } else {
    console.warn('Firebase Admin is not initialized. Notifications will be logged to console. Please set FIREBASE_SERVICE_ACCOUNT_BASE64 in .env');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error.message);
}

/**
 * Sends a push notification to the specified device tokens.
 * @param {string[]} tokens - Array of FCM device tokens.
 * @param {object} payload - Notification payload (title, body, data).
 * @returns {Promise<object>} Results of the operation.
 */
export const sendPushNotification = async (tokens, payload) => {
  if (!tokens || tokens.length === 0) {
    console.log('No tokens provided for push notification');
    return { successCount: 0, failureCount: 0 };
  }

  // Filter out any empty/undefined tokens
  const validTokens = tokens.filter(t => t);

  if (validTokens.length === 0) {
    console.log('No valid tokens remaining after filter');
    return { successCount: 0, failureCount: 0 };
  }

  const message = {
    notification: {
      title: payload.title || 'Notification',
      body: payload.body || '',
    },
    data: payload.data || {},
    tokens: validTokens,
  };

  if (!firebaseInitialized) {
    console.log('[SIMULATED FCM] Would send notification:', JSON.stringify(message, null, 2));
    return { successCount: validTokens.length, failureCount: 0, simulated: true };
  }

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log(`${response.successCount} messages were sent successfully`);
    
    // Check for failed tokens (e.g. invalid or unregistered)
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(validTokens[idx]);
          console.error(`FCM Failure for token ${validTokens[idx]}:`, resp.error);
        }
      });
      // Optionally cleanup failed tokens from DB here if needed
    }

    return response;
  } catch (error) {
    console.error('Error sending multicast message:', error);
    return { successCount: 0, failureCount: validTokens.length, error };
  }
};
