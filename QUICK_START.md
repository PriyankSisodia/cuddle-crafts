# Quick Start: Deploy Your Store for Free

## 🚀 Fastest Way (15 minutes)

### Step 1: Set Up Firebase (5 min)

1. **Create Firebase Account**
   - Go to https://console.firebase.google.com/
   - Sign in with Google
   - Click "Add project"
   - Name: `cuddle-crafts`
   - Click "Create project"

2. **Enable Firestore**
   - Click "Firestore Database" in left menu
   - Click "Create database"
   - Select "Start in test mode"
   - Choose location (pick closest to you)
   - Click "Enable"

3. **Get Your Config**
   - Click ⚙️ (Settings) → "Project settings"
   - Scroll to "Your apps"
   - Click web icon `</>`
   - App name: `Cuddle Crafts`
   - Click "Register app"
   - **Copy the config object** (you'll need it)

### Step 2: Install Firebase (2 min)

```bash
npm install firebase
```

### Step 3: Add Firebase Config (3 min)

1. Create `.env.local` file in project root:
```bash
touch .env.local
```

2. Add your Firebase config (from Step 1):
```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### Step 4: Deploy to Vercel (5 min)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com/
   - Sign up with GitHub (free)
   - Click "Add New Project"
   - Import your repository
   - Click "Deploy"

3. **Add Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all 6 Firebase variables from `.env.local`
   - Redeploy

**Done!** Your store is live! 🎉

---

## 📊 Track Orders

1. Go to Firebase Console
2. Click "Firestore Database"
3. Click "orders" collection
4. See all customer orders in real-time!

---

## 💡 Next Steps

- **Custom Domain**: Add your domain in Vercel (optional)
- **Security Rules**: Update Firestore rules (see FIREBASE_MIGRATION.md)
- **Email Notifications**: Set up email alerts for new orders (optional)

---

## 🆘 Need Help?

- Check `DEPLOYMENT_GUIDE.md` for detailed steps
- Check `FIREBASE_MIGRATION.md` for code changes
- Firebase Docs: https://firebase.google.com/docs

---

## ✅ What You Get

- ✅ Free hosting (Vercel)
- ✅ Free database (Firebase)
- ✅ Real-time order tracking
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ **Total cost: $0/month**

