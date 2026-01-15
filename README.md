# Cuddle Crafts - Soft Toys E-commerce Website

A beautiful, child-friendly website for selling soft toys with product management capabilities.

## Features

- 🧸 Beautiful, colorful design perfect for children and gifting
- 📦 Product listing page with search functionality
- ➕ Admin panel with comprehensive management tools:
  - **Products**: Add, edit, delete products
  - **Orders**: Manage customer orders with status tracking
  - **Coupons**: Create and manage discount codes
- 🔐 Admin authentication system to distinguish admin and customer views
- 🎨 Beautiful pastel color scheme
- 📱 Responsive design for all devices
- 💾 Local storage for all data (no backend required)

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Usage

### Admin Authentication

**Default Admin Password:** `admin123`

**How to Access Admin Panel:**
1. Navigate directly to `/admin` in your browser (e.g., `http://localhost:5173/admin`)
2. Enter the admin password
3. Once logged in, you'll have full access to product management
4. Admin sessions last 24 hours
5. You can change the password from the Admin Panel after logging in

**Important:** The admin login is completely hidden from customers. There are no admin links visible in the customer interface. Only you (the admin) can access the admin panel by typing the URL directly.

**Admin vs Customer Views:**
- **Customers** see: Only Home and Products links - no admin references
- **Admin** (you): Access `/admin` directly via URL to manage products
- Only admins can access product management features
- Edit buttons on product pages are only visible to logged-in admins

### Adding Products

1. Log in as admin (see above)
2. Navigate to the "Admin Panel" from the navigation bar
3. Fill in the product details:
   - **Product Name** (required)
   - **Description** (required)
   - **Price** (optional)
   - **Category** (optional)
   - **Age Group** (optional)
   - **Material** (optional)
   - **Size** (optional)
   - **Image URL** (optional)
   - **Features** (comma-separated, optional)
   - **Care Instructions** (optional)
3. Click "Add Product" to save

### Admin Dashboard Features

The admin panel has three main sections accessible via tabs:

#### 1. Products Management 🧸
- **Add Products**: Fill in the form with product details
  - **Multiple Images**: Add multiple image URLs separated by commas (e.g., `url1.jpg, url2.jpg, url3.jpg`)
  - All product fields are available including name, description, price, category, age group, material, size, features, and care instructions
- **Edit Products**: Click the edit (✏️) button on any product
- **Delete Products**: Click the delete (🗑️) button to remove products
- **View Products**: Click the view (👁️) button to see product details with image gallery
- **Sample Products**: The website comes pre-loaded with 10 sample products with multiple images each

#### 2. Orders Management 📦
- **Add Orders**: Manually add orders with customer information
- **Edit Orders**: Update order status, customer details, or items
- **Delete Orders**: Remove orders from the system
- **Order Status**: Track orders with statuses:
  - Pending
  - Processing
  - Shipped
  - Delivered
  - Cancelled

**Order Fields:**
- Customer Name, Email, Phone
- Shipping Address
- Items (comma-separated list)
- Total Amount
- Status
- Notes

#### 3. Coupons Management 🎫
- **Add Coupons**: Create discount codes for customers
- **Edit Coupons**: Modify coupon details and activation status
- **Delete Coupons**: Remove coupons from the system

**Coupon Fields:**
- Coupon Code (e.g., SAVE20)
- Discount Type: Percentage or Fixed Amount
- Discount Value
- Minimum Purchase Amount
- Maximum Discount Limit
- Valid From/Until Dates
- Usage Limit
- Active/Inactive Status

### Viewing Products

- Browse all products on the "Products" page
- Click on any product to see detailed information
- **Image Gallery**: Products with multiple images show a thumbnail gallery below the main image
- Click on any thumbnail to view different product images
- Use the search bar to find specific products

### Sample Products

The website comes pre-loaded with 10 sample soft toys:
1. Cuddly Brown Bear
2. Fluffy White Rabbit
3. Playful Panda Friend
4. Adorable Fox Plush
5. Gentle Elephant Buddy
6. Rainbow Unicorn Magic
7. Cozy Penguin Pal
8. Sleepy Sloth Friend
9. Cute Koala Companion
10. Happy Hippo Hugger

Each sample product includes:
- Multiple high-quality images
- Complete product details
- Realistic pricing
- Features and care instructions

## Color Scheme

The website uses a beautiful pastel color palette:
- Soft Pink (#FFB6D9, #FFE5F0)
- Soft Blue (#B6E5FF, #E5F5FF)
- Soft Yellow (#FFE5B6, #FFF5E5)
- Soft Purple (#E5B6FF, #F5E5FF)
- Soft Green (#B6FFE5, #E5FFF5)

Perfect for a child-friendly, gift-oriented website!

## Technologies Used

- React 18
- React Router DOM
- Vite
- CSS3 with custom properties
- LocalStorage for data persistence

## Project Structure

```
cuddle-crafts/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   ├── AdminLogin.jsx
│   │   └── AdminLogin.css
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── Products.jsx
│   │   ├── Products.css
│   │   ├── ProductDetail.jsx
│   │   ├── ProductDetail.css
│   │   ├── Admin.jsx
│   │   └── Admin.css
│   ├── utils/
│   │   └── storage.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Notes

- Products are stored in the browser's localStorage
- Admin authentication is also stored in localStorage
- The website automatically refreshes product data every 2 seconds
- All product data persists across page refreshes
- Admin sessions expire after 24 hours
- No backend server required - everything runs in the browser!

## Security Note

⚠️ This is a client-side only application. The admin password is stored in localStorage and is not encrypted. For production use, consider implementing a proper backend with secure authentication.

Enjoy building your soft toys business! 🧸✨

