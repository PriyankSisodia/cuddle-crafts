# ✅ Post-Deployment Checklist

## After Deploying to Vercel - What to Do Next

### 🔥 Step 1: Connect Firebase Backend (10 min)

- [ ] **Create Firebase Project**
  - Go to [Firebase Console](https://console.firebase.google.com/)
  - Create project: `cuddle-crafts`
  - Enable Firestore Database (test mode is fine for now)

- [ ] **Add Environment Variables to Vercel**
  - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
  - Add these 6 variables (use `VITE_` prefix for Vite):
    - `VITE_FIREBASE_API_KEY` (or `REACT_APP_FIREBASE_API_KEY`)
    - `VITE_FIREBASE_AUTH_DOMAIN` (or `REACT_APP_FIREBASE_AUTH_DOMAIN`)
    - `VITE_FIREBASE_PROJECT_ID` (or `REACT_APP_FIREBASE_PROJECT_ID`)
    - `VITE_FIREBASE_STORAGE_BUCKET` (or `REACT_APP_FIREBASE_STORAGE_BUCKET`)
    - `VITE_FIREBASE_MESSAGING_SENDER_ID` (or `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`)
    - `VITE_FIREBASE_APP_ID` (or `REACT_APP_FIREBASE_APP_ID`)
  - Get values from Firebase Console → Project Settings → Your apps

- [ ] **Redeploy After Adding Variables**
  - Vercel Dashboard → Deployments → Redeploy latest
  - OR push a new commit to trigger auto-deploy

### 📦 Step 2: Initialize Sample Data (5 min)

- [ ] **Add Sample Products to Firebase**
  - Option A: Use the script: `npm run init-firebase`
  - Option B: Manually add via Firebase Console
  - Option C: Use Admin panel to add products

### 🔒 Step 3: Set Up Security Rules (5 min)

- [ ] **Update Firestore Rules**
  - Firebase Console → Firestore Database → Rules
  - Copy rules from `POST_DEPLOYMENT.md` Step 6
  - Click "Publish"

### 🧪 Step 4: Test Everything (10 min)

- [ ] **Test Your Live Site**
  - Visit your Vercel URL
  - Browse products
  - Add to cart
  - Complete checkout (if Firebase connected)
  - Check Firebase Console for new order

- [ ] **Test on Mobile**
  - Open site on phone
  - Test all features

### 📊 Step 5: Set Up Order Tracking (Ongoing)

- [ ] **Learn to View Orders**
  - Firebase Console → Firestore Database → `orders` collection
  - All customer orders appear here in real-time

- [ ] **Set Up Order Status Updates**
  - Click on order → Edit `status` field
  - Statuses: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

### 🌐 Step 6: Custom Domain (Optional)

- [ ] **Add Custom Domain**
  - Vercel Dashboard → Settings → Domains
  - Add your domain
  - Follow DNS setup instructions

### 📈 Step 7: Monitor & Maintain

- [ ] **Set Up Monitoring**
  - Check Firebase usage dashboard weekly
  - Monitor Vercel analytics
  - Set up alerts if needed

---

## 🎯 Quick Actions

### View Orders Right Now
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Firestore Database"
3. Click "orders" collection
4. See all customer orders!

### Add New Product
1. Go to your site: `/admin`
2. Login with admin password
3. Click "Products" tab
4. Click "Add New Product"
5. Fill in details
6. Save

### Check Site Status
1. Vercel Dashboard → Deployments
2. See latest deployment status
3. Check for any errors

---

## 🆘 Common Issues

### "Firebase not initialized"
- ✅ Check environment variables are set in Vercel
- ✅ Make sure you redeployed after adding variables
- ✅ Check browser console for errors

### "Permission denied"
- ✅ Check Firestore security rules are published
- ✅ Make sure rules allow read/write as needed

### "Products not showing"
- ✅ Check if products exist in Firebase
- ✅ Run `npm run init-firebase` to add sample products
- ✅ Check browser console for errors

---

## 📚 Next Steps

1. **Read `POST_DEPLOYMENT.md`** for detailed instructions
2. **Read `FIREBASE_MIGRATION.md`** to migrate from localStorage to Firebase
3. **Set up email notifications** for new orders (optional)
4. **Add payment gateway** (Stripe/PayPal) - requires backend changes

---

## ✅ You're Done When:

- [x] Site is live on Vercel
- [x] Firebase is connected
- [x] Environment variables are set
- [x] Sample products are added
- [x] Security rules are published
- [x] You can view orders in Firebase Console
- [x] Test order was placed successfully

**Congratulations! Your store is ready for customers! 🎉**

