# Firebase Migration Guide

This guide shows how to replace localStorage with Firebase Firestore for real backend functionality.

## Step 1: Install Firebase

```bash
npm install firebase
```

## Step 2: Create Firebase Config

Create `src/config/firebase.js`:

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

## Step 3: Create Firebase Storage Service

Create `src/utils/firebaseStorage.js` to replace `storage.js`:

```javascript
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Collections
const PRODUCTS_COLLECTION = 'products'
const ORDERS_COLLECTION = 'orders'
const COUPONS_COLLECTION = 'coupons'
const SHIPPING_COLLECTION = 'shipping'
const REVIEWS_COLLECTION = 'reviews'

// ============ PRODUCTS ============
export const getProducts = async () => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION)
    const snapshot = await getDocs(productsRef)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting products:', error)
    return []
  }
}

export const getProductById = async (id) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Error getting product:', error)
    return null
  }
}

export const addProduct = async (product) => {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION)
    const newProduct = {
      ...product,
      createdAt: serverTimestamp()
    }
    const docRef = await addDoc(productsRef, newProduct)
    return { id: docRef.id, ...newProduct }
  } catch (error) {
    console.error('Error adding product:', error)
    throw error
  }
}

export const updateProduct = async (id, updatedProduct) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    await updateDoc(docRef, updatedProduct)
    return { id, ...updatedProduct }
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// ============ ORDERS ============
export const getOrders = async () => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION)
    const q = query(ordersRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting orders:', error)
    return []
  }
}

export const addOrder = async (order) => {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION)
    const newOrder = {
      ...order,
      status: order.status || 'pending',
      createdAt: serverTimestamp()
    }
    const docRef = await addDoc(ordersRef, newOrder)
    return { id: docRef.id, ...newOrder }
  } catch (error) {
    console.error('Error adding order:', error)
    throw error
  }
}

export const updateOrder = async (id, updatedOrder) => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, id)
    await updateDoc(docRef, updatedOrder)
    return { id, ...updatedOrder }
  } catch (error) {
    console.error('Error updating order:', error)
    throw error
  }
}

export const deleteOrder = async (id) => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, id)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error('Error deleting order:', error)
    throw error
  }
}

// ============ COUPONS ============
export const getCoupons = async () => {
  try {
    const couponsRef = collection(db, COUPONS_COLLECTION)
    const snapshot = await getDocs(couponsRef)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting coupons:', error)
    return []
  }
}

export const getCouponByCode = async (code) => {
  try {
    const couponsRef = collection(db, COUPONS_COLLECTION)
    const q = query(
      couponsRef, 
      where('code', '==', code.toUpperCase()),
      where('isActive', '==', true)
    )
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      return { id: doc.id, ...doc.data() }
    }
    return null
  } catch (error) {
    console.error('Error getting coupon:', error)
    return null
  }
}

export const addCoupon = async (coupon) => {
  try {
    const couponsRef = collection(db, COUPONS_COLLECTION)
    const newCoupon = {
      ...coupon,
      code: coupon.code.toUpperCase(),
      isActive: coupon.isActive !== undefined ? coupon.isActive : true,
      createdAt: serverTimestamp()
    }
    const docRef = await addDoc(couponsRef, newCoupon)
    return { id: docRef.id, ...newCoupon }
  } catch (error) {
    console.error('Error adding coupon:', error)
    throw error
  }
}

// ============ SHIPPING ============
export const getShippingOptions = async () => {
  try {
    const shippingRef = collection(db, SHIPPING_COLLECTION)
    const q = query(shippingRef, where('isActive', '==', true))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting shipping options:', error)
    return []
  }
}

// ============ REVIEWS ============
export const getReviews = async (productId) => {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION)
    const q = query(
      reviewsRef,
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting reviews:', error)
    return []
  }
}

export const addReview = async (review) => {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION)
    const newReview = {
      ...review,
      createdAt: serverTimestamp()
    }
    const docRef = await addDoc(reviewsRef, newReview)
    return { id: docRef.id, ...newReview }
  } catch (error) {
    console.error('Error adding review:', error)
    throw error
  }
}

// ============ CART (Keep localStorage for now, or move to Firebase) ============
// Cart can stay in localStorage for simplicity, or you can move it to Firebase
// For now, we'll keep it in localStorage as it's user-specific
```

## Step 4: Update Components to Use Firebase

Replace imports in your components:

**Before:**
```javascript
import { getProducts, addToCart } from '../utils/storage'
```

**After:**
```javascript
import { getProducts } from '../utils/firebaseStorage'
import { addToCart } from '../utils/storage' // Keep cart in localStorage
```

## Step 5: Handle Async Functions

Since Firebase functions are async, update components:

```javascript
// Before
const products = getProducts()

// After
const [products, setProducts] = useState([])

useEffect(() => {
  const loadProducts = async () => {
    const data = await getProducts()
    setProducts(data)
  }
  loadProducts()
}, [])
```

## Step 6: Initialize Sample Data

Create a script to initialize sample products in Firebase:

```javascript
// scripts/initFirebase.js
import { addProduct } from '../src/utils/firebaseStorage'
import { SAMPLE_PRODUCTS } from '../src/utils/storage'

const initFirebase = async () => {
  for (const product of SAMPLE_PRODUCTS) {
    await addProduct(product)
    console.log(`Added: ${product.name}`)
  }
}

initFirebase()
```

## Step 7: Firebase Security Rules

Update Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products: Read for all, Write for admin only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null; // Add admin check later
    }
    
    // Orders: Write for all, Read for admin only
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null; // Admin only
    }
    
    // Coupons: Read for all, Write for admin only
    match /coupons/{couponId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Reviews: Read for all, Create for all
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if true;
      allow delete: if request.auth != null; // Admin only
    }
  }
}
```

## Benefits of Firebase Migration

✅ **Real backend** - Data stored in cloud, not browser
✅ **Order tracking** - View all orders in Firebase Console
✅ **Real-time updates** - Changes sync instantly
✅ **Scalable** - Handles growth automatically
✅ **Secure** - Built-in security rules
✅ **Free tier** - Generous limits for starting

## Testing Locally

1. Create `.env.local` with Firebase config
2. Run `npm run dev`
3. Test all functions
4. Check Firebase Console to see data

## Deployment

1. Add environment variables to Vercel
2. Push code to GitHub
3. Vercel auto-deploys
4. Orders will be saved to Firebase!

