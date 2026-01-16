// Utility functions for managing products in localStorage

const STORAGE_KEY = 'cuddle_crafts_products';
const ORDERS_KEY = 'cuddle_crafts_orders';
const COUPONS_KEY = 'cuddle_crafts_coupons';
const SHIPPING_KEY = 'cuddle_crafts_shipping';
const CART_KEY = 'cuddle_crafts_cart';
const REVIEWS_KEY = 'cuddle_crafts_reviews';
const ADMIN_AUTH_KEY = 'cuddle_crafts_admin_auth';
const ADMIN_PASSWORD_KEY = 'cuddle_crafts_admin_password';

// Default admin password (can be changed)
const DEFAULT_ADMIN_PASSWORD = 'admin123';

// Sample products with multiple images
const SAMPLE_PRODUCTS = [
  {
    id: 'sample-1',
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
    createdAt: new Date().toISOString(),
    badge: 'best-seller'
  },
  {
    id: 'sample-2',
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
    createdAt: new Date().toISOString(),
    badge: 'new'
  },
  {
    id: 'sample-3',
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
    characterStory: 'Pippin the panda is a playful friend from the bamboo forests. With his infectious smile and boundless energy, he brings joy to every playtime. Pippin loves to tumble, play hide-and-seek, and share bamboo treats with friends. His adventurous spirit and caring heart make him the perfect playmate for children who love to explore and imagine. Every day with Pippin is a new adventure!',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-4',
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
    characterStory: 'Fenwick the fox is a clever and curious explorer of the enchanted woods. With his bright orange coat and twinkling eyes, he\'s always ready for a new adventure. Fenwick loves solving mysteries, helping friends, and discovering hidden treasures. His quick wit and kind heart make him a wonderful companion for imaginative play. Together, you\'ll explore magical forests and create unforgettable memories.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-5',
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
    characterStory: 'Ellie the elephant is a wise and gentle giant with a heart full of love. Her floppy ears are perfect for listening to secrets, and her soft trunk gives the warmest hugs. Ellie comes from a family of storytellers and loves sharing tales of faraway lands and magical journeys. Her calm presence brings comfort during difficult moments, and her playful nature brings laughter to happy times.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-6',
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
    createdAt: new Date().toISOString(),
    badge: 'new'
  },
  {
    id: 'sample-7',
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
    characterStory: 'Penny the penguin is a cheerful friend from the snowy Antarctic. With her cozy scarf and warm heart, she brings the magic of winter to every season. Penny loves sliding on ice, building snow forts, and sharing stories of her polar adventures. Her friendly nature and winter wisdom make her the perfect companion for cozy cuddles and imaginative play. She teaches that every day is an adventure, even in the coldest weather!',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-8',
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
    characterStory: 'Sage the sloth is the master of mindfulness and peaceful moments. With his slow, gentle movements and calming presence, he teaches children the art of taking things one step at a time. Sage loves hanging in his favorite tree, watching sunsets, and sharing quiet moments of reflection. His long arms give the most comforting hugs, and his peaceful nature helps children find calm in busy days. He\'s the perfect friend for quiet time and relaxation.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-9',
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
    characterStory: 'Koko the koala is a gentle tree-dweller with a heart full of love. With her big, round eyes and fluffy ears, she\'s always ready for a cuddle. Koko lives high in the eucalyptus trees and loves to share stories of her forest home. Her calm and nurturing nature makes her the perfect companion for bedtime stories and quiet moments. She teaches children about the beauty of nature and the importance of rest.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-10',
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
    characterStory: 'Hugo the hippo is a joyful friend from the African rivers. With his big smile and playful spirit, he brings laughter and fun to every moment. Hugo loves splashing in water, playing games, and making everyone around him smile. His cheerful personality and warm hugs make him the perfect companion for playtime adventures. He teaches children about friendship, joy, and finding happiness in the simple things.',
    createdAt: new Date().toISOString()
  }
];

export const getProducts = () => {
  try {
    const products = localStorage.getItem(STORAGE_KEY);
    if (!products) {
      // Initialize with sample products if none exist
      saveProducts(SAMPLE_PRODUCTS);
      return SAMPLE_PRODUCTS;
    }
    return JSON.parse(products);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

export const saveProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};

export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (id, updatedProduct) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    saveProducts(products);
    return products[index];
  }
  return null;
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
  return filtered;
};

export const getProductById = (id) => {
  const products = getProducts();
  return products.find(p => p.id === id);
};

// Admin authentication functions
export const isAdminLoggedIn = () => {
  try {
    const auth = localStorage.getItem(ADMIN_AUTH_KEY);
    if (!auth) return false;
    const { isAdmin, expiresAt } = JSON.parse(auth);
    if (expiresAt && new Date(expiresAt) < new Date()) {
      logoutAdmin();
      return false;
    }
    return isAdmin === true;
  } catch (error) {
    return false;
  }
};

export const loginAdmin = (password) => {
  const savedPassword = getAdminPassword();
  if (password === savedPassword) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify({
      isAdmin: true,
      expiresAt: expiresAt.toISOString()
    }));
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_AUTH_KEY);
};

export const getAdminPassword = () => {
  try {
    const password = localStorage.getItem(ADMIN_PASSWORD_KEY);
    return password || DEFAULT_ADMIN_PASSWORD;
  } catch (error) {
    return DEFAULT_ADMIN_PASSWORD;
  }
};

export const setAdminPassword = (newPassword) => {
  if (newPassword && newPassword.length >= 4) {
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword);
    return true;
  }
  return false;
};

// Order management functions
export const getOrders = () => {
  try {
    const orders = localStorage.getItem(ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

export const saveOrders = (orders) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error('Error saving orders:', error);
    return false;
  }
};

export const addOrder = (order) => {
  const orders = getOrders();
  const newOrder = {
    ...order,
    id: Date.now().toString(),
    orderNumber: `ORD-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: order.status || 'pending'
  };
  orders.push(newOrder);
  saveOrders(orders);
  return newOrder;
};

export const updateOrder = (id, updatedOrder) => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updatedOrder, updatedAt: new Date().toISOString() };
    saveOrders(orders);
    return orders[index];
  }
  return null;
};

export const deleteOrder = (id) => {
  const orders = getOrders();
  const filtered = orders.filter(o => o.id !== id);
  saveOrders(filtered);
  return filtered;
};

export const getOrderById = (id) => {
  const orders = getOrders();
  return orders.find(o => o.id === id);
};

// Coupon management functions
export const getCoupons = () => {
  try {
    const coupons = localStorage.getItem(COUPONS_KEY);
    return coupons ? JSON.parse(coupons) : [];
  } catch (error) {
    console.error('Error loading coupons:', error);
    return [];
  }
};

export const saveCoupons = (coupons) => {
  try {
    localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
    return true;
  } catch (error) {
    console.error('Error saving coupons:', error);
    return false;
  }
};

export const addCoupon = (coupon) => {
  const coupons = getCoupons();
  const newCoupon = {
    ...coupon,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    isActive: coupon.isActive !== undefined ? coupon.isActive : true
  };
  coupons.push(newCoupon);
  saveCoupons(coupons);
  return newCoupon;
};

export const updateCoupon = (id, updatedCoupon) => {
  const coupons = getCoupons();
  const index = coupons.findIndex(c => c.id === id);
  if (index !== -1) {
    coupons[index] = { ...coupons[index], ...updatedCoupon, updatedAt: new Date().toISOString() };
    saveCoupons(coupons);
    return coupons[index];
  }
  return null;
};

export const deleteCoupon = (id) => {
  const coupons = getCoupons();
  const filtered = coupons.filter(c => c.id !== id);
  saveCoupons(filtered);
  return filtered;
};

export const getCouponById = (id) => {
  const coupons = getCoupons();
  return coupons.find(c => c.id === id);
};

export const getCouponByCode = (code) => {
  const coupons = getCoupons();
  return coupons.find(c => c.code.toLowerCase() === code.toLowerCase() && c.isActive);
};

// Shipping options management functions
export const getShippingOptions = () => {
  try {
    const shipping = localStorage.getItem(SHIPPING_KEY);
    if (!shipping) {
      // Initialize with default shipping options
      const defaultShipping = [
        {
          id: 'default-1',
          name: 'Standard Shipping',
          cost: 5.99,
          estimatedDays: '5-7',
          minOrderAmount: 0,
          maxOrderAmount: null,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'default-2',
          name: 'Express Shipping',
          cost: 12.99,
          estimatedDays: '2-3',
          minOrderAmount: 0,
          maxOrderAmount: null,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'default-3',
          name: 'Free Shipping',
          cost: 0,
          estimatedDays: '7-10',
          minOrderAmount: 50,
          maxOrderAmount: null,
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ];
      saveShippingOptions(defaultShipping);
      return defaultShipping;
    }
    return JSON.parse(shipping);
  } catch (error) {
    console.error('Error loading shipping options:', error);
    return [];
  }
};

export const saveShippingOptions = (shipping) => {
  try {
    localStorage.setItem(SHIPPING_KEY, JSON.stringify(shipping));
    return true;
  } catch (error) {
    console.error('Error saving shipping options:', error);
    return false;
  }
};

export const addShippingOption = (shipping) => {
  const shippingOptions = getShippingOptions();
  const newShipping = {
    ...shipping,
    id: Date.now().toString(),
    cost: parseFloat(shipping.cost) || 0,
    minOrderAmount: shipping.minOrderAmount ? parseFloat(shipping.minOrderAmount) : null,
    maxOrderAmount: shipping.maxOrderAmount ? parseFloat(shipping.maxOrderAmount) : null,
    createdAt: new Date().toISOString(),
    isActive: shipping.isActive !== undefined ? shipping.isActive : true
  };
  shippingOptions.push(newShipping);
  saveShippingOptions(shippingOptions);
  return newShipping;
};

export const updateShippingOption = (id, updatedShipping) => {
  const shippingOptions = getShippingOptions();
  const index = shippingOptions.findIndex(s => s.id === id);
  if (index !== -1) {
    shippingOptions[index] = {
      ...shippingOptions[index],
      ...updatedShipping,
      cost: parseFloat(updatedShipping.cost) || shippingOptions[index].cost,
      minOrderAmount: updatedShipping.minOrderAmount ? parseFloat(updatedShipping.minOrderAmount) : null,
      maxOrderAmount: updatedShipping.maxOrderAmount ? parseFloat(updatedShipping.maxOrderAmount) : null,
      updatedAt: new Date().toISOString()
    };
    saveShippingOptions(shippingOptions);
    return shippingOptions[index];
  }
  return null;
};

export const deleteShippingOption = (id) => {
  const shippingOptions = getShippingOptions();
  const filtered = shippingOptions.filter(s => s.id !== id);
  saveShippingOptions(filtered);
  return filtered;
};

export const getShippingOptionById = (id) => {
  const shippingOptions = getShippingOptions();
  return shippingOptions.find(s => s.id === id);
};

export const getAvailableShippingOptions = (orderTotal = 0) => {
  const shippingOptions = getShippingOptions();
  return shippingOptions.filter(option => {
    if (!option.isActive) return false;
    if (option.minOrderAmount && orderTotal < option.minOrderAmount) return false;
    if (option.maxOrderAmount && orderTotal > option.maxOrderAmount) return false;
    return true;
  });
};

// Cart management functions
export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

export const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return true;
  } catch (error) {
    console.error('Error saving cart:', error);
    return false;
  }
};

export const addToCart = (productId, quantity = 1) => {
  const cart = getCart();
  const product = getProductById(productId);
  if (!product) return false;
  
  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      addedAt: new Date().toISOString()
    });
  }
  saveCart(cart);
  return true;
};

export const updateCartItem = (productId, quantity) => {
  const cart = getCart();
  const item = cart.find(item => item.productId === productId);
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
    saveCart(cart);
    return true;
  }
  return false;
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  const filtered = cart.filter(item => item.productId !== productId);
  saveCart(filtered);
  return filtered;
};

export const clearCart = () => {
  saveCart([]);
  return true;
};

export const getCartItems = () => {
  const cart = getCart();
  return cart.map(item => {
    const product = getProductById(item.productId);
    return product ? { ...item, product } : null;
  }).filter(item => item !== null);
};

export const getCartTotal = () => {
  const items = getCartItems();
  return items.reduce((total, item) => {
    return total + (item.product.price || 0) * item.quantity;
  }, 0);
};

// Reviews management functions
export const getReviews = (productId = null) => {
  try {
    const reviews = localStorage.getItem(REVIEWS_KEY);
    const allReviews = reviews ? JSON.parse(reviews) : [];
    if (productId) {
      return allReviews.filter(r => r.productId === productId);
    }
    return allReviews;
  } catch (error) {
    console.error('Error loading reviews:', error);
    return [];
  }
};

export const saveReviews = (reviews) => {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    return true;
  } catch (error) {
    console.error('Error saving reviews:', error);
    return false;
  }
};

export const addReview = (review) => {
  const reviews = getReviews();
  const newReview = {
    ...review,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  reviews.push(newReview);
  saveReviews(reviews);
  return newReview;
};

export const deleteReview = (id) => {
  const reviews = getReviews();
  const filtered = reviews.filter(r => r.id !== id);
  saveReviews(filtered);
  return filtered;
};

