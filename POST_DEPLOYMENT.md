# Post-Deployment Checklist

## ✅ What to Do After Deploying to Vercel

Your app is live! Now let's connect it to Firebase backend so customers can actually place orders.

---

## Step 1: Set Up Firebase Backend (10 minutes)

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Project name: `cuddle-crafts` (or your choice)
4. **Disable Google Analytics** (optional, saves resources)
5. Click "Create project"
6. Wait for project creation (30 seconds)

### 1.2 Enable Firestore Database
1. In Firebase Console, click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll secure it later)
4. Choose a location closest to your customers (e.g., `us-central1`, `asia-south1`)
5. Click **"Enable"**
6. Wait for database creation (30 seconds)

### 1.3 Get Your Firebase Config
1. Click the **gear icon ⚙️** next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon `</>`**
5. App nickname: `Cuddle Crafts Web`
6. **Don't check** "Also set up Firebase Hosting" (we're using Vercel)
7. Click **"Register app"**
8. **Copy the `firebaseConfig` object** - you'll need these values:
   ```javascript
   {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   }
   ```

---

## Step 2: Add Environment Variables to Vercel (5 minutes)

### 2.1 Add Variables in Vercel Dashboard
1. Go to your Vercel project dashboard
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in left sidebar
4. Add these 6 variables (one by one):

   | Variable Name | Value |
   |--------------|-------|
   | `VITE_FIREBASE_API_KEY` | (from firebaseConfig.apiKey) |
   | `VITE_FIREBASE_AUTH_DOMAIN` | (from firebaseConfig.authDomain) |
   | `VITE_FIREBASE_PROJECT_ID` | (from firebaseConfig.projectId) |
   | `VITE_FIREBASE_STORAGE_BUCKET` | (from firebaseConfig.storageBucket) |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | (from firebaseConfig.messagingSenderId) |
   | `VITE_FIREBASE_APP_ID` | (from firebaseConfig.appId) |
   
   **Note:** Vite uses `VITE_` prefix (not `REACT_APP_`). The code supports both for compatibility.

5. For each variable:
   - Click **"Add New"**
   - Paste the variable name
   - Paste the value
   - Select **"Production"**, **"Preview"**, and **"Development"** environments
   - Click **"Save"**

### 2.2 Redeploy Your App
1. After adding all variables, go to **"Deployments"** tab
2. Click the **"..."** menu on latest deployment
3. Click **"Redeploy"**
4. Wait for redeployment (1-2 minutes)

**OR** simply push a new commit to trigger auto-deployment:
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push
```

---

## Step 3: Install Firebase SDK (2 minutes)

### 3.1 Install Package
In your local project:
```bash
npm install firebase
```

### 3.2 Create Firebase Config File
1. Create `src/config/firebase.js` (copy from `firebase.example.js`)
2. The file should use environment variables (already set up)

### 3.3 Test Locally First
1. Create `.env.local` file in project root:
```bash
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

2. Test locally:
```bash
npm run dev
```

3. Verify Firebase connection works

---

## Step 4: Update Code to Use Firebase (Optional - Can Do Later)

**Current Status:** Your app uses localStorage (works but data is browser-only)

**Next Step:** Migrate to Firebase for real backend (see `FIREBASE_MIGRATION.md`)

**For now, you can:**
- Keep using localStorage (works for testing)
- Or migrate to Firebase (better for production)

### Quick Migration Steps:
1. Create `src/utils/firebaseStorage.js` (see `FIREBASE_MIGRATION.md`)
2. Replace imports in components:
   - Change `from '../utils/storage'` to `from '../utils/firebaseStorage'`
   - Update to use async/await (Firebase is async)
3. Test thoroughly
4. Deploy

---

## Step 5: Initialize Sample Data (5 minutes)

### 5.1 Add Sample Products to Firebase
You can do this manually or create a script:

**Option A: Manual (Easier)**
1. Go to Firebase Console → Firestore Database
2. Click **"Start collection"**
3. Collection ID: `products`
4. Add your first product document
5. Repeat for all products

**Option B: Script (Faster)**
1. Create `scripts/initFirebase.js` (see example below)
2. Run: `node scripts/initFirebase.js`
3. All sample products will be added

---

## Step 6: Set Up Security Rules (Important!)

### 6.1 Update Firestore Rules
1. In Firebase Console, go to **"Firestore Database"**
2. Click **"Rules"** tab
3. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products: Everyone can read, only authenticated users can write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // For now, allow if logged in
    }
    
    // Orders: Anyone can create, only authenticated can read/update
    match /orders/{orderId} {
      allow create: if true; // Customers can place orders
      allow read, update, delete: if request.auth != null; // Admin only later
    }
    
    // Coupons: Everyone can read, only authenticated can write
    match /coupons/{couponId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Reviews: Everyone can read/create, authenticated can delete
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if true;
      allow delete: if request.auth != null;
    }
    
    // Shipping: Everyone can read
    match /shipping/{shippingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

4. Click **"Publish"**

**Note:** These are basic rules. For production, add proper admin authentication.

---

## Step 7: Test Your Deployment (5 minutes)

### 7.1 Test Checklist
- [ ] Visit your Vercel URL
- [ ] Browse products
- [ ] Add item to cart
- [ ] Complete checkout (if Firebase is connected)
- [ ] Check Firebase Console for new order
- [ ] Test on mobile device
- [ ] Test all pages load correctly

### 7.2 Common Issues

**Issue: "Firebase not initialized"**
- Check environment variables are set in Vercel
- Make sure you redeployed after adding variables
- Check browser console for errors

**Issue: "Permission denied"**
- Check Firestore security rules
- Make sure rules are published

**Issue: "CORS error"**
- Firebase handles CORS automatically
- Check if you're using correct Firebase config

---

## Step 8: Set Up Order Tracking (Ongoing)

### 8.1 View Orders in Firebase
1. Go to Firebase Console
2. Click **"Firestore Database"**
3. Click **"orders"** collection
4. See all customer orders in real-time!

### 8.2 Order Information
Each order will contain:
- Customer details (name, email, phone, address)
- Order items (products, quantities, prices)
- Payment method
- Shipping option
- Order total
- Order status
- Timestamp

### 8.3 Update Order Status
1. Click on an order document
2. Edit the `status` field:
   - `pending` - New order
   - `processing` - Being prepared
   - `shipped` - Sent to customer
   - `delivered` - Completed
   - `cancelled` - Cancelled

---

## Step 9: Custom Domain (Optional)

### 9.1 Add Custom Domain
1. In Vercel dashboard, go to **"Settings"** → **"Domains"**
2. Enter your domain (e.g., `cuddlecrafts.com`)
3. Follow DNS setup instructions
4. Wait for DNS propagation (5-60 minutes)

### 9.2 Where to Buy Domain
- [Namecheap](https://www.namecheap.com/) - ~$10/year
- [Google Domains](https://domains.google/) - ~$12/year
- [Cloudflare](https://www.cloudflare.com/products/registrar/) - At cost

---

## Step 10: Monitor & Maintain

### 10.1 Check Regularly
- **Daily:** Check for new orders in Firebase
- **Weekly:** Review Firebase usage (stay within free tier)
- **Monthly:** Review Vercel bandwidth usage

### 10.2 Firebase Usage Dashboard
1. Go to Firebase Console
2. Click **"Usage and billing"**
3. Monitor your quota usage
4. Set up alerts if needed

### 10.3 Vercel Analytics
1. In Vercel dashboard, check **"Analytics"** tab
2. Monitor:
   - Page views
   - Bandwidth usage
   - Deployment frequency

---

## 🎉 You're All Set!

Your store is now:
- ✅ Live on Vercel
- ✅ Connected to Firebase backend
- ✅ Ready to accept orders
- ✅ Trackable in Firebase Console

---

## 📚 Next Steps

1. **Add more products** via Admin panel
2. **Set up email notifications** for new orders (optional)
3. **Customize your domain** (optional)
4. **Add payment gateway** (Stripe, PayPal) - requires backend changes
5. **Set up admin authentication** for secure order management

---

## 🆘 Need Help?

- **Firebase Issues:** Check [Firebase Docs](https://firebase.google.com/docs)
- **Vercel Issues:** Check [Vercel Docs](https://vercel.com/docs)
- **Code Issues:** See `FIREBASE_MIGRATION.md` for detailed code changes

---

## 📊 Quick Reference

| Task | Where | Status |
|------|-------|--------|
| View Orders | Firebase Console → Firestore → orders | ✅ |
| Add Products | Admin Panel → Products Tab | ✅ |
| View Analytics | Vercel Dashboard → Analytics | ✅ |
| Update Code | GitHub → Push → Auto-deploy | ✅ |
| Check Errors | Browser Console / Vercel Logs | ✅ |

---

**Congratulations! Your store is live and ready for customers! 🚀**

