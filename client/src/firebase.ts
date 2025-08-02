// firebase.ts

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Vite injects environment variables via import.meta.env
// Since Vite environment loading isn't working, use the actual Firebase config directly
const firebaseConfig = {
  apiKey: "AIzaSyByZHjnXf0aPkq_ZWj4kzHxmyN2nd-aPtg",
  authDomain: "smartspend-app-5eab0.firebaseapp.com",
  projectId: "smartspend-app-5eab0",
  storageBucket: "smartspend-app-5eab0.appspot.com",
  messagingSenderId: "129832934713",
  appId: "1:129832934713:web:95b032702334e420e05ce8",
  measurementId: "G-3NYVTGP9DZ",
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