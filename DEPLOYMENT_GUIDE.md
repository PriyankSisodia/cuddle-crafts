# Free Hosting & Backend Setup Guide

## Recommended Solution: Vercel (Frontend) + Firebase (Backend)

### Why This Combination?
- ✅ **100% Free** for small to medium traffic
- ✅ **No credit card required** for basic usage
- ✅ **Easy deployment** - push to GitHub, auto-deploys
- ✅ **Real-time order tracking** via Firebase Console
- ✅ **Scalable** - grows with your business
- ✅ **Fast & Reliable** - industry standard

---

## Step 1: Set Up Firebase (Backend)

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it: `cuddle-crafts` (or your choice)
4. Disable Google Analytics (optional, saves resources)
5. Click "Create project"

### 1.2 Enable Firestore Database
1. In Firebase Console, click "Firestore Database" in left menu
2. Click "Create database"
3. Select "Start in test mode" (we'll add security rules later)
4. Choose a location closest to you (e.g., `us-central`)
5. Click "Enable"

### 1.3 Get Firebase Config
1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>`
5. Register app name: `Cuddle Crafts Web`
6. Copy the `firebaseConfig` object (you'll need this)

### 1.4 Install Firebase SDK
```bash
npm install firebase
```

---

## Step 2: Set Up Vercel (Frontend Hosting)

### 2.1 Push Code to GitHub
1. Create a new repository on GitHub (make it private if you want)
2. Push your code:
```bash
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/cuddle-crafts.git
git push -u origin main
```

### 2.2 Deploy to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Sign up with GitHub (free)
3. Click "Add New Project"
4. Import your `cuddle-crafts` repository
5. Vercel auto-detects React/Vite - click "Deploy"
6. Your site will be live in ~2 minutes!

### 2.3 Add Environment Variables
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add your Firebase config as environment variables (see Step 3)

---

## Step 3: Update Code for Firebase

### 3.1 Create Firebase Config File
Create `src/config/firebase.js` with your Firebase config:

```javascript
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
```

### 3.2 Add Environment Variables
Create `.env.local` file (don't commit this):
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

In Vercel, add these same variables in Settings → Environment Variables.

---

## Step 4: Update Storage Functions

Replace localStorage functions with Firebase Firestore. See `FIREBASE_MIGRATION.md` for detailed code changes.

---

## Step 5: Set Up Order Tracking

### 5.1 Firebase Console
- All orders will appear in Firestore Database
- View in real-time
- Filter, search, and export orders
- No coding needed!

### 5.2 Optional: Admin Dashboard
You can create a simple admin page that shows orders from Firebase.

---

## Free Tier Limits (More than enough for starting)

### Vercel:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains

### Firebase:
- ✅ 1GB storage
- ✅ 50K reads/day
- ✅ 20K writes/day
- ✅ 20K deletes/day

**Note:** These limits are generous for a new business. You can upgrade later if needed.

---

## Alternative Options

### Option 2: Netlify + Supabase
- Netlify: Similar to Vercel
- Supabase: PostgreSQL database (more SQL-like)
- Also 100% free

### Option 3: Railway (All-in-one)
- Hosts both frontend and backend
- Free tier: $5 credit/month
- Simpler but less free

---

## Next Steps After Setup

1. **Test locally** with Firebase
2. **Deploy to Vercel**
3. **Set up custom domain** (optional, free)
4. **Add security rules** to Firebase (important!)
5. **Monitor orders** in Firebase Console

---

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## Cost Summary

**Total Cost: $0/month** ✅

- Frontend hosting: Free (Vercel)
- Backend/Database: Free (Firebase)
- Domain (optional): ~$10-15/year (Namecheap, Google Domains)

You only pay if you exceed free tier limits (unlikely for a new business).

