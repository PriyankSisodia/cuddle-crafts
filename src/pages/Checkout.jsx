import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCartItems, clearCart, getCoupons, getCouponByCode, addOrder } from '../utils/storage'
import './Checkout.css'

function Checkout() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [coupons, setCoupons] = useState([])
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
    couponCode: ''
  })
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const items = getCartItems()
    setCartItems(items)
    const activeCoupons = getCoupons().filter(c => c.isActive)
    setCoupons(activeCoupons)
  }, [])

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0)
  const discount = appliedCoupon ? calculateDiscount(subtotal, appliedCoupon) : 0
  const total = subtotal - discount

  function calculateDiscount(amount, coupon) {
    if (coupon.minPurchase && amount < coupon.minPurchase) return 0
    
    let discount = 0
    if (coupon.discountType === 'percentage') {
      discount = (amount * coupon.discountValue) / 100
    } else {
      discount = coupon.discountValue
    }
    
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount
    }
    
    return discount
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleApplyCoupon = () => {
    if (!formData.couponCode) return
    
    const coupon = getCouponByCode(formData.couponCode)
    if (coupon) {
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
      status: 'pending',
      paymentMethod: formData.paymentMethod,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      discount: discount,
      notes: `Payment: ${formData.paymentMethod}`
    }

    addOrder(orderData)
    clearCart()
    alert('Order placed successfully! Order number: ' + orderData.orderNumber)
    navigate('/products')
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart first!</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your order below</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h2>Shipping Information</h2>
                <div className="form-group">
                  <label htmlFor="customerName">Full Name *</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                    className={errors.customerName ? 'error' : ''}
                  />
                  {errors.customerName && <span className="error-text">{errors.customerName}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    type="text"
                    id="address"
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
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
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
                    <label htmlFor="zipCode">Zip Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className={errors.zipCode ? 'error' : ''}
                    />
                    {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <input
                      type="text"
                      id="country"
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
                <h2>Payment Method</h2>
                <div className="form-group">
                  <label htmlFor="paymentMethod">Select Payment Method *</label>
                  <select
                    id="paymentMethod"
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
                      <label htmlFor="cardNumber">Card Number *</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className={errors.cardNumber ? 'error' : ''}
                      />
                      {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="cardName">Cardholder Name *</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className={errors.cardName ? 'error' : ''}
                      />
                      {errors.cardName && <span className="error-text">{errors.cardName}</span>}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date *</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          className={errors.expiryDate ? 'error' : ''}
                        />
                        {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="cvv">CVV *</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength="4"
                          className={errors.cvv ? 'error' : ''}
                        />
                        {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                      </div>
                    </div>
                  </>
                )}

                {formData.paymentMethod === 'paypal' && (
                  <div className="payment-info">
                    <p>You will be redirected to PayPal to complete your payment.</p>
                  </div>
                )}

                {formData.paymentMethod === 'cod' && (
                  <div className="payment-info">
                    <p>Pay with cash when your order is delivered.</p>
                  </div>
                )}
              </div>

              <div className="form-section">
                <h2>Coupon Code</h2>
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
                {appliedCoupon && (
                  <div className="coupon-applied">
                    <span>✓ Coupon {appliedCoupon.code} applied!</span>
                    <span>Save ${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-submit">
                Place Order
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.productId} className="summary-item">
                  <div className="summary-item-info">
                    <h4>{item.product.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <div className="summary-item-price">
                    ${((item.product.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="summary-row discount">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

