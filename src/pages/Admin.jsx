import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  getProducts, addProduct, updateProduct, deleteProduct,
  getOrders, addOrder, updateOrder, deleteOrder,
  getCoupons, addCoupon, updateCoupon, deleteCoupon,
  getShippingOptions, addShippingOption, updateShippingOption, deleteShippingOption,
  isAdminLoggedIn, logoutAdmin, getAdminPassword, setAdminPassword 
} from '../utils/storage'
import AdminLogin from '../components/AdminLogin'
import './Admin.css'

function Admin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Products state
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [productFormData, setProductFormData] = useState({
    name: '', description: '', price: '', category: '', ageGroup: '',
    material: '', size: '', images: '', features: '', careInstructions: '', characterStory: ''
  })
  
  // Orders state
  const [orders, setOrders] = useState([])
  const [editingOrder, setEditingOrder] = useState(null)
  const [orderFormData, setOrderFormData] = useState({
    customerName: '', email: '', phone: '', address: '',
    items: '', totalAmount: '', status: 'pending', notes: ''
  })
  
  // Coupons state
  const [coupons, setCoupons] = useState([])
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [couponFormData, setCouponFormData] = useState({
    code: '', discountType: 'percentage', discountValue: '',
    minPurchase: '', maxDiscount: '', validFrom: '', validUntil: '',
    usageLimit: '', isActive: true
  })
  
  // Shipping state
  const [shippingOptions, setShippingOptions] = useState([])
  const [editingShipping, setEditingShipping] = useState(null)
  const [shippingFormData, setShippingFormData] = useState({
    name: '', cost: '', estimatedDays: '', minOrderAmount: '', maxOrderAmount: '', isActive: true
  })
  
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    checkAuth()
    if (isAdminLoggedIn()) {
      loadAllData()
      const interval = setInterval(loadAllData, 2000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const checkAuth = () => {
    setIsAuthenticated(isAdminLoggedIn())
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    loadAllData()
  }

  const handleLogout = () => {
    logoutAdmin()
    setIsAuthenticated(false)
    setShowPasswordChange(false)
  }

  const loadAllData = () => {
    setProducts(getProducts())
    setOrders(getOrders())
    setCoupons(getCoupons())
    setShippingOptions(getShippingOptions())
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    if (newPassword.length < 4) {
      alert('Password must be at least 4 characters long!')
      return
    }
    if (setAdminPassword(newPassword)) {
      alert('Password changed successfully!')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordChange(false)
    } else {
      alert('Failed to change password. Please try again.')
    }
  }

  // Product handlers
  const handleProductInputChange = (e) => {
    const { name, value } = e.target
    setProductFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleProductSubmit = (e) => {
    e.preventDefault()
    const productData = {
      ...productFormData,
      price: productFormData.price ? parseFloat(productFormData.price) : null,
      features: productFormData.features 
        ? productFormData.features.split(',').map(f => f.trim()).filter(f => f)
        : [],
      images: productFormData.images 
        ? productFormData.images.split(',').map(img => img.trim()).filter(img => img)
        : []
    }
    if (editingProduct) {
      updateProduct(editingProduct.id, productData)
    } else {
      addProduct(productData)
    }
    resetProductForm()
    loadAllData()
  }

  const handleProductEdit = (product) => {
    setEditingProduct(product)
    // Handle both old single image and new multiple images format
    let imagesValue = ''
    if (product.images && Array.isArray(product.images)) {
      imagesValue = product.images.join(', ')
    } else if (product.image) {
      imagesValue = product.image
    }
    setProductFormData({
      name: product.name || '', description: product.description || '',
      price: product.price || '', category: product.category || '',
      ageGroup: product.ageGroup || '', material: product.material || '',
      size: product.size || '', images: imagesValue,
      features: product.features ? product.features.join(', ') : '',
      careInstructions: product.careInstructions || '',
      characterStory: product.characterStory || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleProductDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id)
      loadAllData()
      if (editingProduct && editingProduct.id === id) {
        resetProductForm()
      }
    }
  }

  const resetProductForm = () => {
    setProductFormData({
      name: '', description: '', price: '', category: '', ageGroup: '',
      material: '', size: '', images: '', features: '', careInstructions: '', characterStory: ''
    })
    setEditingProduct(null)
  }

  // Order handlers
  const handleOrderInputChange = (e) => {
    const { name, value } = e.target
    setOrderFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleOrderSubmit = (e) => {
    e.preventDefault()
    const orderData = {
      ...orderFormData,
      totalAmount: orderFormData.totalAmount ? parseFloat(orderFormData.totalAmount) : 0,
      items: orderFormData.items ? orderFormData.items.split(',').map(i => i.trim()).filter(i => i) : []
    }
    if (editingOrder) {
      updateOrder(editingOrder.id, orderData)
    } else {
      addOrder(orderData)
    }
    resetOrderForm()
    loadAllData()
  }

  const handleOrderEdit = (order) => {
    setEditingOrder(order)
    setOrderFormData({
      customerName: order.customerName || '',
      email: order.email || '',
      phone: order.phone || '',
      address: order.address || '',
      items: order.items ? (Array.isArray(order.items) ? order.items.join(', ') : order.items) : '',
      totalAmount: order.totalAmount || '',
      status: order.status || 'pending',
      notes: order.notes || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOrderDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(id)
      loadAllData()
      if (editingOrder && editingOrder.id === id) {
        resetOrderForm()
      }
    }
  }

  const resetOrderForm = () => {
    setOrderFormData({
      customerName: '', email: '', phone: '', address: '',
      items: '', totalAmount: '', status: 'pending', notes: ''
    })
    setEditingOrder(null)
  }

  // Coupon handlers
  const handleCouponInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setCouponFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleCouponSubmit = (e) => {
    e.preventDefault()
    const couponData = {
      ...couponFormData,
      discountValue: parseFloat(couponFormData.discountValue) || 0,
      minPurchase: couponFormData.minPurchase ? parseFloat(couponFormData.minPurchase) : null,
      maxDiscount: couponFormData.maxDiscount ? parseFloat(couponFormData.maxDiscount) : null,
      usageLimit: couponFormData.usageLimit ? parseInt(couponFormData.usageLimit) : null
    }
    if (editingCoupon) {
      updateCoupon(editingCoupon.id, couponData)
    } else {
      addCoupon(couponData)
    }
    resetCouponForm()
    loadAllData()
  }

  const handleCouponEdit = (coupon) => {
    setEditingCoupon(coupon)
    setCouponFormData({
      code: coupon.code || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue || '',
      minPurchase: coupon.minPurchase || '',
      maxDiscount: coupon.maxDiscount || '',
      validFrom: coupon.validFrom ? coupon.validFrom.split('T')[0] : '',
      validUntil: coupon.validUntil ? coupon.validUntil.split('T')[0] : '',
      usageLimit: coupon.usageLimit || '',
      isActive: coupon.isActive !== undefined ? coupon.isActive : true
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCouponDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      deleteCoupon(id)
      loadAllData()
      if (editingCoupon && editingCoupon.id === id) {
        resetCouponForm()
      }
    }
  }

  const resetCouponForm = () => {
    setCouponFormData({
      code: '', discountType: 'percentage', discountValue: '',
      minPurchase: '', maxDiscount: '', validFrom: '', validUntil: '',
      usageLimit: '', isActive: true
    })
    setEditingCoupon(null)
  }

  // Shipping handlers
  const handleShippingInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setShippingFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    const shippingData = {
      ...shippingFormData,
      cost: parseFloat(shippingFormData.cost) || 0,
      minOrderAmount: shippingFormData.minOrderAmount ? parseFloat(shippingFormData.minOrderAmount) : null,
      maxOrderAmount: shippingFormData.maxOrderAmount ? parseFloat(shippingFormData.maxOrderAmount) : null,
      isActive: shippingFormData.isActive !== undefined ? shippingFormData.isActive : true
    }
    if (editingShipping) {
      updateShippingOption(editingShipping.id, shippingData)
    } else {
      addShippingOption(shippingData)
    }
    resetShippingForm()
    loadAllData()
  }

  const handleShippingEdit = (shipping) => {
    setEditingShipping(shipping)
    setShippingFormData({
      name: shipping.name || '',
      cost: shipping.cost || '',
      estimatedDays: shipping.estimatedDays || '',
      minOrderAmount: shipping.minOrderAmount || '',
      maxOrderAmount: shipping.maxOrderAmount || '',
      isActive: shipping.isActive !== undefined ? shipping.isActive : true
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleShippingDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this shipping option?')) {
      deleteShippingOption(id)
      loadAllData()
      if (editingShipping && editingShipping.id === id) {
        resetShippingForm()
      }
    }
  }

  const resetShippingForm = () => {
    setShippingFormData({
      name: '', cost: '', estimatedDays: '', minOrderAmount: '', maxOrderAmount: '', isActive: true
    })
    setEditingShipping(null)
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-top">
          <div>
            <h1>Admin Dashboard 🎨</h1>
            <p>Manage products, orders, and coupons</p>
          </div>
          <div className="admin-controls">
            <div className="admin-badge">
              <span className="badge-icon">👤</span>
              <span>Admin Mode</span>
            </div>
            <button onClick={() => setShowPasswordChange(!showPasswordChange)} className="btn btn-secondary btn-small">
              {showPasswordChange ? 'Cancel' : 'Change Password'}
            </button>
            <button onClick={handleLogout} className="btn btn-secondary btn-small">
              Logout
            </button>
          </div>
        </div>
        
        {showPasswordChange && (
          <div className="password-change-card">
            <h3>Change Admin Password</h3>
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label htmlFor="newPassword">New Password (min 4 characters)</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="4"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="4"
                />
              </div>
              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🧸 Products ({products.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders ({orders.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'coupons' ? 'active' : ''}`}
          onClick={() => setActiveTab('coupons')}
        >
          🎫 Coupons ({coupons.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'shipping' ? 'active' : ''}`}
          onClick={() => setActiveTab('shipping')}
        >
          🚚 Shipping ({shippingOptions.length})
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="admin-container">
          <div className="admin-form-section">
            <div className="form-card">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleProductSubmit} className="product-form">
                <div className="form-group">
                  <label htmlFor="name">Product Name *</label>
                  <input type="text" id="name" name="name" value={productFormData.name} onChange={handleProductInputChange} required placeholder="e.g., Cuddly Bear" />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea id="description" name="description" value={productFormData.description} onChange={handleProductInputChange} required rows="4" placeholder="Describe the product..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input type="number" id="price" name="price" value={productFormData.price} onChange={handleProductInputChange} step="0.01" min="0" placeholder="29.99" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input type="text" id="category" name="category" value={productFormData.category} onChange={handleProductInputChange} placeholder="e.g., Bears, Rabbits" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ageGroup">Age Group</label>
                    <input type="text" id="ageGroup" name="ageGroup" value={productFormData.ageGroup} onChange={handleProductInputChange} placeholder="e.g., 0-3 years" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="size">Size</label>
                    <input type="text" id="size" name="size" value={productFormData.size} onChange={handleProductInputChange} placeholder="e.g., Small, Medium, Large" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="material">Material</label>
                  <input type="text" id="material" name="material" value={productFormData.material} onChange={handleProductInputChange} placeholder="e.g., Soft plush, Cotton" />
                </div>
                <div className="form-group">
                  <label htmlFor="images">Image URLs (comma-separated) *</label>
                  <textarea 
                    id="images" 
                    name="images" 
                    value={productFormData.images} 
                    onChange={handleProductInputChange} 
                    rows="3"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg, https://example.com/image3.jpg" 
                  />
                  <small style={{color: 'var(--text-light)', fontSize: '0.85rem'}}>Enter multiple image URLs separated by commas</small>
                </div>
                <div className="form-group">
                  <label htmlFor="features">Features (comma-separated)</label>
                  <input type="text" id="features" name="features" value={productFormData.features} onChange={handleProductInputChange} placeholder="e.g., Washable, Hypoallergenic, Handmade" />
                </div>
                <div className="form-group">
                  <label htmlFor="careInstructions">Care Instructions</label>
                  <textarea id="careInstructions" name="careInstructions" value={productFormData.careInstructions} onChange={handleProductInputChange} rows="3" placeholder="How to care for this product..." />
                </div>
                <div className="form-group">
                  <label htmlFor="characterStory">Character Story</label>
                  <textarea id="characterStory" name="characterStory" value={productFormData.characterStory} onChange={handleProductInputChange} rows="5" placeholder="Write a unique story for this character... (e.g., Meet Barnaby, the gentle guardian of dreams...)" />
                  <small style={{color: 'var(--text-light)', fontSize: '0.85rem'}}>This story will be displayed on the homepage and product pages</small>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editingProduct ? 'Update Product' : 'Add Product'}</button>
                  {editingProduct && <button type="button" onClick={resetProductForm} className="btn btn-secondary">Cancel</button>}
                </div>
              </form>
            </div>
          </div>
          <div className="admin-products-section">
            <h2>All Products ({products.length})</h2>
            {products.length === 0 ? (
              <div className="empty-products"><p>No products yet. Add your first product above! 🧸</p></div>
            ) : (
              <div className="admin-products-list">
                {products.map(product => (
                  <div key={product.id} className="admin-product-card">
                    <div className="admin-product-image">
                      {(() => {
                        const firstImage = product.images && Array.isArray(product.images) && product.images.length > 0 
                          ? product.images[0] 
                          : (product.image || null);
                        return firstImage ? <img src={firstImage} alt={product.name} /> : <div className="admin-placeholder">🧸</div>;
                      })()}
                    </div>
                    <div className="admin-product-info">
                      <h3>{product.name}</h3>
                      <p className="admin-product-desc">{product.description}</p>
                      {product.price && <div className="admin-product-price">${product.price}</div>}
                    </div>
                    <div className="admin-product-actions">
                      <button onClick={() => handleProductEdit(product)} className="btn-icon edit-btn" title="Edit">✏️</button>
                      <button onClick={() => navigate(`/product/${product.id}`)} className="btn-icon view-btn" title="View">👁️</button>
                      <button onClick={() => handleProductDelete(product.id)} className="btn-icon delete-btn" title="Delete">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="admin-container">
          <div className="admin-form-section">
            <div className="form-card">
              <h2>{editingOrder ? 'Edit Order' : 'Add New Order'}</h2>
              <form onSubmit={handleOrderSubmit} className="product-form">
                <div className="form-group">
                  <label htmlFor="customerName">Customer Name *</label>
                  <input type="text" id="customerName" name="customerName" value={orderFormData.customerName} onChange={handleOrderInputChange} required placeholder="John Doe" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" name="email" value={orderFormData.email} onChange={handleOrderInputChange} required placeholder="john@example.com" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" value={orderFormData.phone} onChange={handleOrderInputChange} placeholder="+1234567890" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <textarea id="address" name="address" value={orderFormData.address} onChange={handleOrderInputChange} required rows="3" placeholder="Full shipping address" />
                </div>
                <div className="form-group">
                  <label htmlFor="items">Items (comma-separated) *</label>
                  <input type="text" id="items" name="items" value={orderFormData.items} onChange={handleOrderInputChange} required placeholder="e.g., Cuddly Bear, Soft Rabbit" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="totalAmount">Total Amount ($) *</label>
                    <input type="number" id="totalAmount" name="totalAmount" value={orderFormData.totalAmount} onChange={handleOrderInputChange} required step="0.01" min="0" placeholder="49.99" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="status">Status *</label>
                    <select id="status" name="status" value={orderFormData.status} onChange={handleOrderInputChange} required>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea id="notes" name="notes" value={orderFormData.notes} onChange={handleOrderInputChange} rows="3" placeholder="Additional notes..." />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editingOrder ? 'Update Order' : 'Add Order'}</button>
                  {editingOrder && <button type="button" onClick={resetOrderForm} className="btn btn-secondary">Cancel</button>}
                </div>
              </form>
            </div>
          </div>
          <div className="admin-products-section">
            <h2>All Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <div className="empty-products"><p>No orders yet. Add your first order above! 📦</p></div>
            ) : (
              <div className="admin-orders-list">
                {orders.map(order => (
                  <div key={order.id} className="admin-order-card">
                    <div className="admin-order-header">
                      <div>
                        <h3>{order.orderNumber || `Order #${order.id.slice(-6)}`}</h3>
                        <p className="admin-order-customer">{order.customerName}</p>
                        <p className="admin-order-email">{order.email}</p>
                      </div>
                      <div className={`admin-order-status status-${order.status}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="admin-order-details">
                      <p><strong>Items:</strong> {Array.isArray(order.items) ? order.items.join(', ') : order.items}</p>
                      <p><strong>Total:</strong> ${order.totalAmount || 0}</p>
                      {order.address && <p><strong>Address:</strong> {order.address}</p>}
                      {order.phone && <p><strong>Phone:</strong> {order.phone}</p>}
                      {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                      <p className="admin-order-date"><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="admin-product-actions">
                      <button onClick={() => handleOrderEdit(order)} className="btn-icon edit-btn" title="Edit">✏️</button>
                      <button onClick={() => handleOrderDelete(order.id)} className="btn-icon delete-btn" title="Delete">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="admin-container">
          <div className="admin-form-section">
            <div className="form-card">
              <h2>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</h2>
              <form onSubmit={handleCouponSubmit} className="product-form">
                <div className="form-group">
                  <label htmlFor="code">Coupon Code *</label>
                  <input type="text" id="code" name="code" value={couponFormData.code} onChange={handleCouponInputChange} required placeholder="e.g., SAVE20" style={{textTransform: 'uppercase'}} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="discountType">Discount Type *</label>
                    <select id="discountType" name="discountType" value={couponFormData.discountType} onChange={handleCouponInputChange} required>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="discountValue">Discount Value *</label>
                    <input type="number" id="discountValue" name="discountValue" value={couponFormData.discountValue} onChange={handleCouponInputChange} required step="0.01" min="0" placeholder={couponFormData.discountType === 'percentage' ? '20' : '10'} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="minPurchase">Minimum Purchase ($)</label>
                    <input type="number" id="minPurchase" name="minPurchase" value={couponFormData.minPurchase} onChange={handleCouponInputChange} step="0.01" min="0" placeholder="0" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="maxDiscount">Max Discount ($)</label>
                    <input type="number" id="maxDiscount" name="maxDiscount" value={couponFormData.maxDiscount} onChange={handleCouponInputChange} step="0.01" min="0" placeholder="No limit" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="validFrom">Valid From</label>
                    <input type="date" id="validFrom" name="validFrom" value={couponFormData.validFrom} onChange={handleCouponInputChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="validUntil">Valid Until</label>
                    <input type="date" id="validUntil" name="validUntil" value={couponFormData.validUntil} onChange={handleCouponInputChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="usageLimit">Usage Limit</label>
                  <input type="number" id="usageLimit" name="usageLimit" value={couponFormData.usageLimit} onChange={handleCouponInputChange} min="1" placeholder="Unlimited" />
                </div>
                <div className="form-group">
                  <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <input type="checkbox" id="isActive" name="isActive" checked={couponFormData.isActive} onChange={handleCouponInputChange} />
                    Active
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editingCoupon ? 'Update Coupon' : 'Add Coupon'}</button>
                  {editingCoupon && <button type="button" onClick={resetCouponForm} className="btn btn-secondary">Cancel</button>}
                </div>
              </form>
            </div>
          </div>
          <div className="admin-products-section">
            <h2>All Coupons ({coupons.length})</h2>
            {coupons.length === 0 ? (
              <div className="empty-products"><p>No coupons yet. Add your first coupon above! 🎫</p></div>
            ) : (
              <div className="admin-coupons-list">
                {coupons.map(coupon => (
                  <div key={coupon.id} className={`admin-coupon-card ${!coupon.isActive ? 'inactive' : ''}`}>
                    <div className="admin-coupon-header">
                      <div>
                        <h3 className="admin-coupon-code">{coupon.code}</h3>
                        <p className="admin-coupon-discount">
                          {coupon.discountType === 'percentage' 
                            ? `${coupon.discountValue}% OFF` 
                            : `$${coupon.discountValue} OFF`}
                        </p>
                      </div>
                      <div className={`admin-coupon-status ${coupon.isActive ? 'active' : 'inactive'}`}>
                        {coupon.isActive ? '✓ Active' : '✗ Inactive'}
                      </div>
                    </div>
                    <div className="admin-coupon-details">
                      {coupon.minPurchase && <p><strong>Min Purchase:</strong> ${coupon.minPurchase}</p>}
                      {coupon.maxDiscount && <p><strong>Max Discount:</strong> ${coupon.maxDiscount}</p>}
                      {coupon.validFrom && <p><strong>Valid From:</strong> {new Date(coupon.validFrom).toLocaleDateString()}</p>}
                      {coupon.validUntil && <p><strong>Valid Until:</strong> {new Date(coupon.validUntil).toLocaleDateString()}</p>}
                      {coupon.usageLimit && <p><strong>Usage Limit:</strong> {coupon.usageLimit}</p>}
                      <p className="admin-order-date"><strong>Created:</strong> {new Date(coupon.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="admin-product-actions">
                      <button onClick={() => handleCouponEdit(coupon)} className="btn-icon edit-btn" title="Edit">✏️</button>
                      <button onClick={() => handleCouponDelete(coupon.id)} className="btn-icon delete-btn" title="Delete">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shipping Tab */}
      {activeTab === 'shipping' && (
        <div className="admin-container">
          <div className="admin-form-section">
            <div className="form-card">
              <h2>{editingShipping ? 'Edit Shipping Option' : 'Add New Shipping Option'}</h2>
              <form onSubmit={handleShippingSubmit} className="product-form">
                <div className="form-group">
                  <label htmlFor="shippingName">Shipping Name *</label>
                  <input type="text" id="shippingName" name="name" value={shippingFormData.name} onChange={handleShippingInputChange} required placeholder="e.g., Standard Shipping" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="shippingCost">Cost ($) *</label>
                    <input type="number" id="shippingCost" name="cost" value={shippingFormData.cost} onChange={handleShippingInputChange} required step="0.01" min="0" placeholder="5.99" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="estimatedDays">Estimated Days *</label>
                    <input type="text" id="estimatedDays" name="estimatedDays" value={shippingFormData.estimatedDays} onChange={handleShippingInputChange} required placeholder="e.g., 5-7" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="minOrderAmount">Minimum Order Amount ($)</label>
                    <input type="number" id="minOrderAmount" name="minOrderAmount" value={shippingFormData.minOrderAmount} onChange={handleShippingInputChange} step="0.01" min="0" placeholder="0 (no minimum)" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="maxOrderAmount">Maximum Order Amount ($)</label>
                    <input type="number" id="maxOrderAmount" name="maxOrderAmount" value={shippingFormData.maxOrderAmount} onChange={handleShippingInputChange} step="0.01" min="0" placeholder="Leave empty for no limit" />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <input type="checkbox" id="shippingIsActive" name="isActive" checked={shippingFormData.isActive} onChange={handleShippingInputChange} />
                    Active
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editingShipping ? 'Update Shipping' : 'Add Shipping'}</button>
                  {editingShipping && <button type="button" onClick={resetShippingForm} className="btn btn-secondary">Cancel</button>}
                </div>
              </form>
            </div>
          </div>
          <div className="admin-products-section">
            <h2>All Shipping Options ({shippingOptions.length})</h2>
            {shippingOptions.length === 0 ? (
              <div className="empty-products"><p>No shipping options yet. Add your first shipping option above! 🚚</p></div>
            ) : (
              <div className="admin-coupons-list">
                {shippingOptions.map(shipping => (
                  <div key={shipping.id} className={`admin-coupon-card ${!shipping.isActive ? 'inactive' : ''}`}>
                    <div className="admin-coupon-header">
                      <div>
                        <h3 className="admin-coupon-code">{shipping.name}</h3>
                        <p className="admin-coupon-discount">
                          ${shipping.cost.toFixed(2)} • {shipping.estimatedDays} days
                        </p>
                      </div>
                      <div className={`admin-coupon-status ${shipping.isActive ? 'active' : 'inactive'}`}>
                        {shipping.isActive ? '✓ Active' : '✗ Inactive'}
                      </div>
                    </div>
                    <div className="admin-coupon-details">
                      {shipping.minOrderAmount && <p><strong>Min Order:</strong> ${shipping.minOrderAmount.toFixed(2)}</p>}
                      {shipping.maxOrderAmount && <p><strong>Max Order:</strong> ${shipping.maxOrderAmount.toFixed(2)}</p>}
                      <p className="admin-order-date"><strong>Created:</strong> {new Date(shipping.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="admin-product-actions">
                      <button onClick={() => handleShippingEdit(shipping)} className="btn-icon edit-btn" title="Edit">✏️</button>
                      <button onClick={() => handleShippingDelete(shipping.id)} className="btn-icon delete-btn" title="Delete">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
