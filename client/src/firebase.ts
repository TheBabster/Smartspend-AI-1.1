// firebase.ts

import { initializeApp, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

console.log('🔧 Firebase Config loaded successfully:', firebaseConfig.projectId);

// ✅ Initialize Firebase services (with duplicate app check)
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // If app already exists, get the existing instance
  if (error.code === 'app/duplicate-app') {
    app = getApp();
  } else {
    throw error;
  }
}

// Disable analytics in development to avoid API key issues
const analytics = null; // getAnalytics(app); 
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export Firebase services for use across the app
export { app, analytics, auth, db };