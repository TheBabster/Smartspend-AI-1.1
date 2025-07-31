// firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // ✅ Required for authentication
import { getFirestore } from "firebase/firestore"; // ✅ Required for storing user data like name

const firebaseConfig = {
  apiKey: "AIzaSyByZHjnXf0aPkq_ZWj4kzHxmNy2n4-aPtg",
  authDomain: "smartspend-app-5eab0.firebaseapp.com",
  projectId: "smartspend-app-5eab0",
  storageBucket: "smartspend-app-5eab0.appspot.com", // ✅ Fixed: should be "appspot.com"
  messagingSenderId: "129832934713",
  appId: "1:129832934713:web:95b032702334e420e05ce8",
  measurementId: "G-3NYVTGP9DZ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // ✅ Initializes Firebase Auth
const db = getFirestore(app); // ✅ Initializes Firestore

export { app, analytics, auth, db }; // ✅ Export everything including Firestore