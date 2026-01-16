// Script to initialize Firebase with sample products
// Run this after setting up Firebase: node scripts/initFirebase.js
//
// Usage:
//   1. Create .env.local file with Firebase config (see .env.example)
//   2. Or set environment variables directly
//   3. Run: npm run init-firebase

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Simple .env parser (no dotenv dependency needed)
function loadEnv() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const envPath = join(__dirname, '../.env.local')
  
  try {
    const envFile = readFileSync(envPath, 'utf-8')
    const envVars = {}
    envFile.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
        }
      }
    })
    return envVars
  } catch (error) {
    // .env.local doesn't exist, use process.env instead
    return {}
  }
}

const env = loadEnv()

// Get Firebase config from environment variables, .env.local, or use defaults
// Supports both VITE_ and REACT_APP_ prefixes
// Falls back to hardcoded config from firebase.js if env vars not set
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || env.REACT_APP_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCDzGO-xrr_KbxZc_RstI2S8Y7nW7qgzqk",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || env.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "cuddle-crafts.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || env.REACT_APP_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID || "cuddle-crafts",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || env.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "cuddle-crafts.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1036944173731",
  appId: env.VITE_FIREBASE_APP_ID || env.REACT_APP_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || process.env.REACT_APP_FIREBASE_APP_ID || "1:1036944173731:web:2e9b35e1d6f04534e2ed16"
}

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Error: Firebase configuration not found!')
  console.error('\nPlease either:')
  console.error('1. Create .env.local file with Firebase config (see .env.example)')
  console.error('2. Or set environment variables')
  console.error('3. Or update the hardcoded values in scripts/initFirebase.js\n')
  process.exit(1)
}

console.log(`📦 Using Firebase project: ${firebaseConfig.projectId}\n`)

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Sample products (from storage.js)
const SAMPLE_PRODUCTS = [
  {
    name: 'Cuddly Brown Bear',
    description: 'A super soft and huggable brown teddy bear perfect for bedtime cuddles. Made with premium plush material that\'s gentle on sensitive skin.',
    price: 29.99,
    category: 'Bears',
    ageGroup: '0-10 years',
    material: 'Premium Plush, Polyester',
    size: '12 inches',
    images: [
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1601925260368-ae2f83f341ce?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1534361960057-19889dbdf1bb?w=800&h=800&fit=crop'
    ],
    features: ['Washable', 'Hypoallergenic', 'Handmade', 'CE Certified'],
    careInstructions: 'Machine wash cold, gentle cycle. Air dry. Do not bleach.',
    characterStory: 'Meet Barnaby, the gentle guardian of dreams. Born in a cozy forest cottage, Barnaby has spent years learning the art of comfort. With his warm embrace and soft fur, he\'s the perfect companion for bedtime adventures. Every night, he shares stories of magical forests and helps little ones drift into peaceful slumber. His kind eyes and gentle nature make him a trusted friend for life.',
    badge: 'best-seller'
  },
  {
    name: 'Fluffy White Rabbit',
    description: 'An adorable white bunny with long floppy ears and a fluffy tail. This charming rabbit is perfect for children who love soft, cuddly companions.',
    price: 24.99,
    category: 'Rabbits',
    ageGroup: '0-8 years',
    material: 'Soft Velvet, Cotton Filling',
    size: '10 inches',
    images: [
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=800&fit=crop'
    ],
    features: ['Eco-friendly', 'Washable', 'Soft & Safe', 'Perfect Gift'],
    careInstructions: 'Hand wash recommended. Air dry in shade.',
    characterStory: 'Luna the rabbit is a graceful explorer of moonlit gardens. With her silky white fur that glows in the starlight, she brings magic to every moment. Luna loves to hop through fields of wildflowers and dance under the stars. She teaches children about the beauty of nature and the wonder of nighttime adventures. Her gentle spirit and playful nature make her a beloved companion.',
    badge: 'new'
  },
  {
    name: 'Playful Panda Friend',
    description: 'A cute black and white panda with a friendly smile. This lovable panda is made with extra soft materials and is perfect for playtime and bedtime.',
    price: 34.99,
    category: 'Pandas',
    ageGroup: '0-12 years',
    material: 'Premium Plush, Organic Cotton',
    size: '14 inches',
    images: [
      'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1534567110760-2e5c8ceb3086?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=800&fit=crop'
    ],
    features: ['Organic Materials', 'Hypoallergenic', 'Durable', 'CE Certified'],
    careInstructions: 'Machine wash on gentle cycle. Tumble dry low.',
    characterStory: 'Pippin the panda is a playful friend from the bamboo forests. With his infectious smile and boundless energy, he brings joy to every playtime. Pippin loves to tumble, play hide-and-seek, and share bamboo treats with friends. His adventurous spirit and caring heart make him the perfect playmate for children who love to explore and imagine. Every day with Pippin is a new adventure!'
  },
  {
    name: 'Adorable Fox Plush',
    description: 'A charming orange fox with bright eyes and a bushy tail. This playful fox is perfect for imaginative play and makes a wonderful gift.',
    price: 27.99,
    category: 'Wildlife',
    ageGroup: '3-12 years',
    material: 'Soft Plush, Polyester Filling',
    size: '11 inches',
    images: [
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=800&fit=crop'
    ],
    features: ['Colorful Design', 'Washable', 'Safe for Kids', 'Handcrafted'],
    careInstructions: 'Spot clean or gentle hand wash. Air dry.',
    characterStory: 'Fenwick the fox is a clever and curious explorer of the enchanted woods. With his bright orange coat and twinkling eyes, he\'s always ready for a new adventure. Fenwick loves solving mysteries, helping friends, and discovering hidden treasures. His quick wit and kind heart make him a wonderful companion for imaginative play. Together, you\'ll explore magical forests and create unforgettable memories.'
  },
  {
    name: 'Gentle Elephant Buddy',
    description: 'A sweet gray elephant with floppy ears and a friendly trunk. Made with ultra-soft materials, this elephant is perfect for comforting little ones.',
    price: 32.99,
    category: 'Wildlife',
    ageGroup: '0-10 years',
    material: 'Premium Velvet, Hypoallergenic Filling',
    size: '13 inches',
    images: [
      'https://images.unsplash.com/photo-1534188753412-3e9336736ed7?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1534188753412-3e9336736ed7?w=800&h=800&fit=crop'
    ],
    features: ['Extra Soft', 'Hypoallergenic', 'Washable', 'Perfect Size'],
    careInstructions: 'Machine wash cold. Lay flat to dry.',
    characterStory: 'Ellie the elephant is a wise and gentle giant with a heart full of love. Her floppy ears are perfect for listening to secrets, and her soft trunk gives the warmest hugs. Ellie comes from a family of storytellers and loves sharing tales of faraway lands and magical journeys. Her calm presence brings comfort during difficult moments, and her playful nature brings laughter to happy times.'
  },
  {
    name: 'Rainbow Unicorn Magic',
    description: 'A magical unicorn with a rainbow mane and tail, sparkling horn, and dreamy eyes. This enchanting friend brings joy and imagination to playtime.',
    price: 39.99,
    category: 'Fantasy',
    ageGroup: '3-12 years',
    material: 'Shimmer Plush, Polyester Filling',
    size: '15 inches',
    images: [
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&h=800&fit=crop'
    ],
    features: ['Sparkly Design', 'Colorful', 'Washable', 'Magical Gift'],
    careInstructions: 'Hand wash recommended. Air dry to preserve sparkle.',
    characterStory: 'Stardust the unicorn lives in a realm of rainbows and dreams. With her shimmering rainbow mane and magical horn, she brings wonder and enchantment wherever she goes. Stardust can grant wishes, create rainbows, and make dreams come true. Her gentle magic teaches children about kindness, imagination, and believing in the impossible. Every day with Stardust is filled with sparkles and joy!',
    badge: 'new'
  },
  {
    name: 'Cozy Penguin Pal',
    description: 'A cute black and white penguin with a warm scarf. This friendly penguin is perfect for winter cuddles and makes a great companion for bedtime stories.',
    price: 26.99,
    category: 'Birds',
    ageGroup: '0-10 years',
    material: 'Soft Plush, Cotton Filling',
    size: '10 inches',
    images: [
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=800&fit=crop'
    ],
    features: ['Winter Theme', 'Washable', 'Soft & Cuddly', 'Perfect Gift'],
    careInstructions: 'Machine wash gentle cycle. Air dry.',
    characterStory: 'Penny the penguin is a cheerful friend from the snowy Antarctic. With her cozy scarf and warm heart, she brings the magic of winter to every season. Penny loves sliding on ice, building snow forts, and sharing stories of her polar adventures. Her friendly nature and winter wisdom make her the perfect companion for cozy cuddles and imaginative play. She teaches that every day is an adventure, even in the coldest weather!'
  },
  {
    name: 'Sleepy Sloth Friend',
    description: 'A relaxed sloth with a gentle smile and long arms perfect for hugging. This peaceful friend is ideal for quiet time and relaxation.',
    price: 31.99,
    category: 'Wildlife',
    ageGroup: '3-12 years',
    material: 'Premium Plush, Memory Foam Filling',
    size: '12 inches',
    images: [
      'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1534567110760-2e5c8ceb3086?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&h=800&fit=crop'
    ],
    features: ['Relaxing Design', 'Extra Soft', 'Washable', 'Calming'],
    careInstructions: 'Hand wash or gentle machine wash. Air dry.',
    characterStory: 'Sage the sloth is the master of mindfulness and peaceful moments. With his slow, gentle movements and calming presence, he teaches children the art of taking things one step at a time. Sage loves hanging in his favorite tree, watching sunsets, and sharing quiet moments of reflection. His long arms give the most comforting hugs, and his peaceful nature helps children find calm in busy days. He\'s the perfect friend for quiet time and relaxation.'
  },
  {
    name: 'Cute Koala Companion',
    description: 'An adorable gray koala with big round eyes and fluffy ears. Made with the softest materials, this koala is perfect for snuggling and comfort.',
    price: 28.99,
    category: 'Wildlife',
    ageGroup: '0-10 years',
    material: 'Ultra Soft Plush, Hypoallergenic Filling',
    size: '11 inches',
    images: [
      'https://images.unsplash.com/photo-1534567110760-2e5c8ceb3086?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1534567110760-2e5c8ceb3086?w=800&h=800&fit=crop'
    ],
    features: ['Ultra Soft', 'Hypoallergenic', 'Washable', 'CE Certified'],
    careInstructions: 'Machine wash cold. Tumble dry low heat.',
    characterStory: 'Koko the koala is a gentle tree-dweller with a heart full of love. With her big, round eyes and fluffy ears, she\'s always ready for a cuddle. Koko lives high in the eucalyptus trees and loves to share stories of her forest home. Her calm and nurturing nature makes her the perfect companion for bedtime stories and quiet moments. She teaches children about the beauty of nature and the importance of rest.'
  },
  {
    name: 'Happy Hippo Hugger',
    description: 'A cheerful purple hippo with a big smile and friendly eyes. This jolly friend brings laughter and joy to playtime and makes a wonderful gift.',
    price: 30.99,
    category: 'Wildlife',
    ageGroup: '0-12 years',
    material: 'Soft Plush, Polyester Filling',
    size: '13 inches',
    images: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=800&fit=crop'
    ],
    features: ['Colorful', 'Washable', 'Durable', 'Fun Design'],
    careInstructions: 'Machine wash on gentle cycle. Air dry.',
    characterStory: 'Hugo the hippo is a joyful friend from the African rivers. With his big smile and playful spirit, he brings laughter and fun to every moment. Hugo loves splashing in water, playing games, and making everyone around him smile. His cheerful personality and warm hugs make him the perfect companion for playtime adventures. He teaches children about friendship, joy, and finding happiness in the simple things.'
  }
]

async function initFirebase() {
  try {
    console.log('🚀 Initializing Firebase with sample products...\n')
    
    // Check if products already exist
    const productsRef = collection(db, 'products')
    const existingProducts = await getDocs(productsRef)
    
    if (!existingProducts.empty) {
      console.log('⚠️  Products already exist in Firebase!')
      console.log(`Found ${existingProducts.size} existing products.`)
      console.log('Skipping initialization. Delete existing products first if you want to reinitialize.\n')
      return
    }
    
    // Add all sample products
    console.log(`Adding ${SAMPLE_PRODUCTS.length} products...\n`)
    
    for (let i = 0; i < SAMPLE_PRODUCTS.length; i++) {
      const product = SAMPLE_PRODUCTS[i]
      const docRef = await addDoc(productsRef, {
        ...product,
        createdAt: new Date()
      })
      console.log(`✅ [${i + 1}/${SAMPLE_PRODUCTS.length}] Added: ${product.name} (ID: ${docRef.id})`)
    }
    
    console.log('\n🎉 Successfully initialized Firebase with sample products!')
    console.log('You can now view them in Firebase Console → Firestore Database → products\n')
    
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error.message)
    if (error.code === 'permission-denied') {
      console.error('\n💡 Tip: Make sure Firestore is enabled and security rules allow writes.')
    }
    process.exit(1)
  }
}

// Run the initialization
initFirebase()

