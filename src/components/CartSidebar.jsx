import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCartItems, clearCart, getCoupons, getCouponByCode, addOrder, updateCartItem, removeFromCart, getAvailableShippingOptions } from '../utils/storage'
import './CartSidebar.css'

function CartSidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [coupons, setCoupons] = useState([])
  const [shippingOptions, setShippingOptions] = useState([])
  const [selectedShipping, setSelectedShipping] = useState(null)
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    couponCode: '',
    shippingOption: ''
  })
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [errors, setErrors] = useState({})
  const [showCheckout, setShowCheckout] = useState(false)

  const loadCartItems = () => {
    const items = getCartItems()
    setCartItems(items)
  }

  useEffect(() => {
    if (isOpen) {
      loadCartItems()
      const activeCoupons = getCoupons().filter(c => c.isActive)
      setCoupons(activeCoupons)
      const interval = setInterval(loadCartItems, 1000)
      return () => clearInterval(interval)
    }
  }, [isOpen])

  // Load shipping options when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0)
      const available = getAvailableShippingOptions(subtotal)
      setShippingOptions(available)
      // Auto-select first shipping option if none selected
      if (!selectedShipping && available.length > 0) {
        setSelectedShipping(available[0])
        setFormData(prev => ({ ...prev, shippingOption: available[0].id }))
      }
    } else {
      setShippingOptions([])
      setSelectedShipping(null)
    }
  }, [cartItems])

  // Recalculate discount when cart items change
  useEffect(() => {
    if (appliedCoupon && cartItems.length > 0) {
      const currentSubtotal = cartItems.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0)
      const minPurchase = parseFloat(appliedCoupon.minPurchase) || 0
      
      // If coupon becomes invalid (e.g., minimum purchase not met), remove it
      if (minPurchase > 0 && currentSubtotal < minPurchase) {
        setAppliedCoupon(null)
        setFormData(prev => ({ ...prev, couponCode: '' }))
        setErrors(prev => ({ ...prev, couponCode: `Minimum purchase of $${minPurchase.toFixed(2)} required` }))
      }
    }
  }, [cartItems])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0)
  
  function calculateDiscount(amount, coupon) {
    if (!coupon) return 0
    if (coupon.minPurchase && amount < parseFloat(coupon.minPurchase)) return 0
    
    let discount = 0
    const discountValue = parseFloat(coupon.discountValue) || 0
    
    if (coupon.discountType === 'percentage') {
      discount = (amount * discountValue) / 100
    } else {
      discount = discountValue
    }
    
    if (coupon.maxDiscount && discount > parseFloat(coupon.maxDiscount)) {
      discount = parseFloat(coupon.maxDiscount)
    }
    
    return Math.max(0, discount) // Ensure discount is never negative
  }

  const discount = appliedCoupon ? calculateDiscount(subtotal, appliedCoupon) : 0
  const shippingCost = selectedShipping ? parseFloat(selectedShipping.cost) || 0 : 0
  const total = Math.max(0, subtotal - discount + shippingCost) // Ensure total is never negative

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    // Handle shipping option change
    if (name === 'shippingOption') {
      const shipping = shippingOptions.find(s => s.id === value)
      setSelectedShipping(shipping || null)
    }
  }

  const handleApplyCoupon = () => {
    if (!formData.couponCode.trim()) {
      setErrors(prev => ({ ...prev, couponCode: 'Please enter a coupon code' }))
      return
    }
    
    const coupon = getCouponByCode(formData.couponCode.trim())
    if (coupon) {
      // Validate coupon dates
      const now = new Date()
      if (coupon.validFrom && new Date(coupon.validFrom) > now) {
        setErrors(prev => ({ ...prev, couponCode: 'Coupon is not yet valid' }))
        setAppliedCoupon(null)
        return
      }
      if (coupon.validUntil && new Date(coupon.validUntil) < now) {
        setErrors(prev => ({ ...prev, couponCode: 'Coupon has expired' }))
        setAppliedCoupon(null)
        return
      }
      // Check minimum purchase
      const minPurchase = parseFloat(coupon.minPurchase) || 0
      if (minPurchase > 0 && subtotal < minPurchase) {
        setErrors(prev => ({ ...prev, couponCode: `Minimum purchase of $${minPurchase.toFixed(2)} required` }))
        setAppliedCoupon(null)
        return
      }
      setAppliedCoupon(coupon)
      setErrors(prev => ({ ...prev, couponCode: '' }))
    } else {
      setErrors(prev => ({ ...prev, couponCode: 'Invalid coupon code' }))
      setAppliedCoupon(null)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setFormData(prev => ({ ...prev, couponCode: '' }))
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId)
      return
    }
    updateCartItem(productId, newQuantity)
    loadCartItems()
  }

  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
    loadCartItems()
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required'
    if (!formData.country.trim()) newErrors.country = 'Country is required'
    if (!formData.shippingOption || !selectedShipping) newErrors.shippingOption = 'Please select a shipping option'
    
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required'
      if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required'
      if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required'
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      alert('Please fill in all required fields correctly')
      return
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }

    const orderData = {
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
      items: cartItems.map(item => `${item.product.name} (x${item.quantity})`),
      totalAmount: total,
      subtotal: subtotal,
      discount: discount,
      shippingCost: shippingCost,
      shippingMethod: selectedShipping ? selectedShipping.name : null,
      status: 'pending',
      paymentMethod: formData.paymentMethod,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      notes: `Payment: ${formData.paymentMethod}${selectedShipping ? ` | Shipping: ${selectedShipping.name}` : ''}`
    }

    addOrder(orderData)
    clearCart()
    alert('Order placed successfully!')
    onClose()
    navigate('/products')
  }

  if (!isOpen) return null

  return (
    <>
      <div className={`cart-sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-sidebar-header">
          <h2>Your Cart</h2>
          <button className="cart-sidebar-close" onClick={onClose}>×</button>
        </div>

        <div className="cart-sidebar-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <button onClick={onClose} className="btn btn-primary">Continue Shopping</button>
            </div>
          ) : (
            <>
              {!showCheckout ? (
                <>
                  <div className="cart-items-list">
                    {cartItems.map(item => {
                      const firstImage = item.product.images && Array.isArray(item.product.images) && item.product.images.length > 0
                        ? item.product.images[0]
                        : (item.product.image || null)
                      return (
                        <div key={item.productId} className="cart-item">
                          <div className="cart-item-image">
                            {firstImage ? (
                              <img src={firstImage} alt={item.product.name} />
                            ) : (
                              <div className="cart-item-placeholder">🧸</div>
                            )}
                          </div>
                          <div className="cart-item-details">
                            <h4>{item.product.name}</h4>
                            <p className="cart-item-price">${(item.product.price || 0).toFixed(2)} each</p>
                            <div className="cart-item-controls">
                              <div className="quantity-controls">
                                <button
                                  type="button"
                                  className="quantity-btn"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                >
                                  −
                                </button>
                                <span className="quantity-display">{item.quantity}</span>
                                <button
                                  type="button"
                                  className="quantity-btn"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                type="button"
                                className="remove-item-btn"
                                onClick={() => handleRemoveItem(item.productId)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <div className="cart-item-total">
                            ${((item.product.price || 0) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="cart-summary">
                    <div className="cart-summary-row">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && discount > 0 && (
                      <div className="cart-summary-row discount">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedShipping && (
                      <div className="cart-summary-row">
                        <span>Shipping (Est.)</span>
                        <span>${shippingCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="cart-summary-row total">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {!showCheckout && (
                    <div className="cart-coupon-section">
                      <h4>Have a coupon?</h4>
                      <div className="coupon-input-group">
                        <input
                          type="text"
                          name="couponCode"
                          value={formData.couponCode}
                          onChange={handleInputChange}
                          placeholder="Enter coupon code"
                          className={errors.couponCode ? 'error' : ''}
                        />
                        {!appliedCoupon ? (
                          <button type="button" onClick={handleApplyCoupon} className="btn btn-secondary">
                            Apply
                          </button>
                        ) : (
                          <button type="button" onClick={handleRemoveCoupon} className="btn btn-secondary">
                            Remove
                          </button>
                        )}
                      </div>
                      {errors.couponCode && <span className="error-text">{errors.couponCode}</span>}
                      {appliedCoupon && discount > 0 && (
                        <div className="coupon-applied">
                          <span>✓ Coupon {appliedCoupon.code} applied! Save ${discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <button onClick={() => setShowCheckout(true)} className="btn btn-primary btn-checkout">
                    Proceed to Checkout
                  </button>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="cart-checkout-form">
                  <button 
                    type="button" 
                    onClick={() => setShowCheckout(false)} 
                    className="cart-back-button"
                    aria-label="Back to cart"
                  >
                    ← Back to Cart
                  </button>
                  <div className="form-section">
                    <h3>Shipping Information</h3>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                        className={errors.customerName ? 'error' : ''}
                      />
                      {errors.customerName && <span className="error-text">{errors.customerName}</span>}
                    </div>

                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={errors.phone ? 'error' : ''}
                      />
                      {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                      <label>Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className={errors.address ? 'error' : ''}
                      />
                      {errors.address && <span className="error-text">{errors.address}</span>}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className={errors.city ? 'error' : ''}
                        />
                        {errors.city && <span className="error-text">{errors.city}</span>}
                      </div>
                      <div className="form-group">
                        <label>State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className={errors.state ? 'error' : ''}
                        />
                        {errors.state && <span className="error-text">{errors.state}</span>}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Zip Code *</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className={errors.zipCode ? 'error' : ''}
                        />
                        {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                      </div>
                      <div className="form-group">
                        <label>Country *</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                          className={errors.country ? 'error' : ''}
                        />
                        {errors.country && <span className="error-text">{errors.country}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Shipping Method</h3>
                    {shippingOptions.length === 0 ? (
                      <p className="error-text">No shipping options available for this order total.</p>
                    ) : (
                      <div className="shipping-options">
                        {shippingOptions.map(option => (
                          <label key={option.id} className={`shipping-option ${selectedShipping?.id === option.id ? 'selected' : ''}`}>
                            <input
                              type="radio"
                              name="shippingOption"
                              value={option.id}
                              checked={selectedShipping?.id === option.id}
                              onChange={handleInputChange}
                              required
                            />
                            <div className="shipping-option-details">
                              <div className="shipping-option-name">{option.name}</div>
                              <div className="shipping-option-info">
                                <span>${option.cost.toFixed(2)}</span>
                                <span>•</span>
                                <span>{option.estimatedDays} days</span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                    {errors.shippingOption && <span className="error-text">{errors.shippingOption}</span>}
                  </div>

                  <div className="form-section">
                    <h3>Payment Method</h3>
                    <div className="form-group">
                      <label>Payment Method *</label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="card">Credit/Debit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="cod">Cash on Delivery</option>
                      </select>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <>
                        <div className="form-group">
                          <label>Card Number *</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className={errors.cardNumber ? 'error' : ''}
                          />
                          {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                        </div>
                        <div className="form-group">
                          <label>Cardholder Name *</label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            className={errors.cardName ? 'error' : ''}
                          />
                          {errors.cardName && <span className="error-text">{errors.cardName}</span>}
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Expiry Date *</label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              className={errors.expiryDate ? 'error' : ''}
                            />
                            {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                          </div>
                          <div className="form-group">
                            <label>CVV *</label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              className={errors.cvv ? 'error' : ''}
                            />
                            {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="form-section">
                    <h3>Coupon Code</h3>
                    <div className="coupon-input-group">
                      <input
                        type="text"
                        name="couponCode"
                        value={formData.couponCode}
                        onChange={handleInputChange}
                        placeholder="Enter coupon code"
                        className={errors.couponCode ? 'error' : ''}
                      />
                      {!appliedCoupon ? (
                        <button type="button" onClick={handleApplyCoupon} className="btn btn-secondary">
                          Apply
                        </button>
                      ) : (
                        <button type="button" onClick={handleRemoveCoupon} className="btn btn-secondary">
                          Remove
                        </button>
                      )}
                    </div>
                    {errors.couponCode && <span className="error-text">{errors.couponCode}</span>}
                    {appliedCoupon && discount > 0 && (
                      <div className="coupon-applied">
                        <span>✓ Coupon {appliedCoupon.code} applied! Save ${discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="cart-checkout-total">
                    <div className="cart-summary-row">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {appliedCoupon && discount > 0 && (
                      <div className="cart-summary-row discount">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedShipping && (
                      <div className="cart-summary-row">
                        <span>Shipping ({selectedShipping.name})</span>
                        <span>${shippingCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="cart-summary-row total">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="cart-checkout-actions">
                    <button type="submit" className="btn btn-primary">
                      Place Order
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default CartSidebar

