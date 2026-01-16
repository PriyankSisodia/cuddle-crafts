import React, { useState, useEffect } from 'react'
import { getCoupons } from '../utils/storage'
import './CouponBanner.css'

function CouponBanner() {
  const [coupons, setCoupons] = useState([])

  useEffect(() => {
    const loadCoupons = () => {
      const allCoupons = getCoupons()
      const activeCoupons = allCoupons.filter(coupon => {
        if (!coupon.isActive) return false
        const now = new Date()
        if (coupon.validFrom && new Date(coupon.validFrom) > now) return false
        if (coupon.validUntil && new Date(coupon.validUntil) < now) return false
        return true
      })
      setCoupons(activeCoupons)
    }
    loadCoupons()
    const interval = setInterval(loadCoupons, 2000)
    return () => clearInterval(interval)
  }, [])

  if (coupons.length === 0) return null

  // Duplicate coupons for seamless infinite scroll
  const duplicatedCoupons = [...coupons, ...coupons, ...coupons]

  return (
    <div className="coupon-banner">
      <div className="coupon-banner-content">
        <div className="coupon-banner-text">
          <span className="coupon-icon">🎫</span>
          <span>Special Offers:</span>
        </div>
        <div className="coupon-slider-wrapper">
          <div className="coupon-slider">
            {duplicatedCoupons.map((coupon, index) => (
              <div key={`${coupon.id}-${index}`} className="coupon-item">
                <span className="coupon-code">{coupon.code}</span>
                <span className="coupon-discount">
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}% OFF` 
                    : `$${coupon.discountValue} OFF`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CouponBanner

