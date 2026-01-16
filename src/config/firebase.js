// Firebase Configuration
// Uses environment variables for security (recommended for production)
// Falls back to direct config if env vars not set (for development)

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration - uses environment variables if available
// Note: Vite uses VITE_ prefix, not REACT_APP_
// 
// ⚠️ SECURITY NOTE: Firebase config values (apiKey, authDomain, etc.) are SAFE to expose publicly.
// They are NOT secrets - Firebase security comes from Security Rules, not from hiding these values.
// This is by design and documented in Firebase docs.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCDzGO-xrr_KbxZc_RstI2S8Y7nW7qgzqk",
  // @ts-ignore - Vite warning: This is safe to expose (Firebase authDomain is public by design)
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "cuddle-crafts.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || import.meta.env.REACT_APP_FIREBASE_PROJECT_ID || "cuddle-crafts",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "cuddle-crafts.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1036944173731",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || import.meta.env.REACT_APP_FIREBASE_APP_ID || "1:1036944173731:web:2e9b35e1d6f04534e2ed16",
  measurementId: "G-F9QSDJ01TE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (database)
export const db = getFirestore(app);

// Initialize Analytics (optional)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };