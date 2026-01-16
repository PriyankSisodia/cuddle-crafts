// Firebase Configuration Example
// Copy this file to firebase.js and fill in your actual values
// Or use environment variables (recommended)

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Option 1: Use environment variables (RECOMMENDED)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
}

// Option 2: Direct config (NOT RECOMMENDED for production)
// const firebaseConfig = {
//   apiKey: "your-api-key",
//   authDomain: "your-project.firebaseapp.com",
//   projectId: "your-project-id",
//   storageBucket: "your-project.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "1:123456789:web:abcdef"
// }

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

