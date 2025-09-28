// Firebase configuration - ULTIMATE FORCE REBUILD
const FIREBASE_API_KEY = "AIzaSyDyeIgBxyp3zmfUakFXUQUMNhSBKGBHmkE";
const FIREBASE_AUTH_DOMAIN = "conn3ctr-fce52.firebaseapp.com";
const FIREBASE_PROJECT_ID = "conn3ctr-fce52";
const FIREBASE_STORAGE_BUCKET = "conn3ctr-fce52.firebasestorage.app";
const FIREBASE_MESSAGING_SENDER_ID = "144936221659";
const FIREBASE_APP_ID = "1:144936221659:web:efdfea531c7a45d96e85fe";

export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};

// Debug: Log Firebase config (remove in production)
console.log('🚀 ULTIMATE Firebase Config - Force Rebuild:', new Date().toISOString(), firebaseConfig);
console.log('🚀 API Key starts with:', FIREBASE_API_KEY.substring(0, 10) + '...');
console.log('🚀 Project ID:', FIREBASE_PROJECT_ID);
console.log('🚀 Full API Key:', FIREBASE_API_KEY);
