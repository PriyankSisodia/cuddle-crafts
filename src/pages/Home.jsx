import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCoupons, addToCart } from '../utils/storage'
import CouponBanner from '../components/CouponBanner'
import './Home.css'

function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const loadProducts = () => {
      const allProducts = getProducts()
      setProducts(allProducts)
    }
    loadProducts()
    const interval = setInterval(loadProducts, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleBuyNow = (e, productId) => {
    e.preventDefault()
    addToCart(productId, 1)
    window.location.href = '/checkout'
  }

  return (
    <div className="home">
      <CouponBanner />
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">Welcome to</span>
            <span className="title-main">Cuddle Crafts</span>
          </h1>
          <p className="hero-subtitle">
            Handcrafted exclusive soft toys that bring joy, comfort, and endless cuddles! 
            Each character has a unique story waiting to be discovered.
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">
              Explore Our Collection
            </Link>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="floating-toy toy-1">🐻</div>
          <div className="floating-toy toy-2">🐰</div>
          <div className="floating-toy toy-3">🦊</div>
          <div className="floating-toy toy-4">🐼</div>
        </div>
      </section>

      <section className="exclusive-products">
        <div className="container">
          <div className="exclusive-header">
            <h2 className="exclusive-title">Our Exclusive Collection</h2>
            <p className="exclusive-subtitle">Each toy comes with a unique character story, bringing imagination and wonder to life</p>
          </div>
          {products.length === 0 ? (
            <div className="exclusive-empty">
              <p>Loading our collection...</p>
            </div>
          ) : (
            <div className="exclusive-products-grid">
              {products.map(product => {
                const firstImage = product.images && Array.isArray(product.images) && product.images.length > 0
                  ? product.images[0]
                  : (product.image || null);
                return (
                  <div key={product.id} className="exclusive-product-card">
                    <div className="exclusive-product-image-wrapper">
                      {firstImage ? (
                        <img src={firstImage} alt={product.name} className="exclusive-product-image" />
                      ) : (
                        <div className="exclusive-product-placeholder">
                          <span className="exclusive-placeholder-icon">🧸</span>
                        </div>
                      )}
                      {product.price && (
                        <div className="exclusive-price-badge">
                          ${product.price}
                        </div>
                      )}
                    </div>
                    <div className="exclusive-product-content">
                      <h3 className="exclusive-product-name">{product.name}</h3>
                      {product.characterStory && (
                        <div className="exclusive-character-story">
                          <p className="story-text">{product.characterStory}</p>
                        </div>
                      )}
                      <div className="exclusive-product-actions">
                        <button onClick={(e) => handleBuyNow(e, product.id)} className="btn-exclusive btn-buy">
                          Buy Now
                        </button>
                        <Link to={`/product/${product.id}`} className="btn-exclusive btn-details">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Cuddle Crafts?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎁</div>
              <h3>Exclusive Quality</h3>
              <p>Each toy is carefully crafted with finest materials and attention to detail</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">❤️</div>
              <h3>Made with Love</h3>
              <p>Handcrafted with dedication and lots of care for lasting memories</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Child-Safe</h3>
              <p>All materials are safe, soft, and perfect for children of all ages</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Unique Stories</h3>
              <p>Every character has a unique story that sparks imagination and wonder</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

