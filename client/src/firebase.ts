// firebase.ts

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Vite injects environment variables via import.meta.env
// Temporary fix: Use direct values while we resolve env variable loading
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyByZHjnXf0aPkq_ZWj4kzHxmyN2nd-aPtg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smartspend-app-5eab0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smartspend-app-5eab0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smartspend-app-5eab0.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "129832934713",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:129832934713:web:95b032702334e420e05ce8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3NYVTGP9DZ",
};

console.log('🔧 Firebase Config loaded successfully:', firebaseConfig.projectId);

// ✅ Initialize Firebase services
const app = initializeApp(firebaseConfig);
// Disable analytics in development to avoid API key issues
const analytics = null; // getAnalytics(app); 
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Export Firebase services for use across the app
export { app, analytics, auth, db };