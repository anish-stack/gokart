const admin = require('firebase-admin');
const env = require('./env');
const logger = require('../utils/logger');

let initialized = false;

function initFirebase() {
  if (initialized) return admin;

  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL || !env.FIREBASE_PRIVATE_KEY) {
    logger.warn('Firebase credentials not configured - push notifications are disabled (demo mode).');
    return null;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY,
      }),
    });
    initialized = true;
    logger.info('Firebase Admin initialized');
    return admin;
  } catch (err) {
    logger.error(`Firebase Admin init failed: ${err.message}`);
    return null;
  }
}

module.exports = { initFirebase };
