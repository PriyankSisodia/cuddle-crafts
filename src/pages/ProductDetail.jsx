import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductById, getProducts, isAdminLoggedIn, addToCart, getReviews, addReview } from '../utils/storage'
import Breadcrumbs from '../components/Breadcrumbs'
import ImageLightbox from '../components/ImageLightbox'
import './ProductDetail.css'

function ProductDetail({ onAddToCart }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [reviews, setReviews] = useState([])
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [reviewForm, setReviewForm] = useState({
    customerName: '',
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    const loadProduct = () => {
      const foundProduct = getProductById(id)
      setProduct(foundProduct)
      // Load recommended products (exclude current product)
      if (foundProduct) {
        const allProducts = getProducts()
        const recommended = allProducts
          .filter(p => p.id !== id)
          .slice(0, 4) // Show 4 recommended products
        setRecommendedProducts(recommended)
      }
    }
    const loadReviews = () => {
      const productReviews = getReviews(id)
      setReviews(productReviews)
    }
    const checkAdmin = () => {
      setIsAdmin(isAdminLoggedIn())
    }
    loadProduct()
    loadReviews()
    checkAdmin()
    // Reload product every 2 seconds to catch updates
    const interval = setInterval(() => {
      loadProduct()
      loadReviews()
      checkAdmin()
    }, 2000)
    return () => clearInterval(interval)
  }, [id])

  const handleAddToCart = () => {
    addToCart(product.id, 1)
    if (onAddToCart) onAddToCart()
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!reviewForm.customerName.trim() || !reviewForm.comment.trim()) {
      alert('Please fill in all fields')
      return
    }
    addReview({
      productId: id,
      customerName: reviewForm.customerName,
      rating: reviewForm.rating,
      comment: reviewForm.comment
    })
    setReviewForm({ customerName: '', rating: 5, comment: '' })
    setShowReviewForm(false)
    const productReviews = getReviews(id)
    setReviews(productReviews)
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="not-found">
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail-page">
      <Breadcrumbs />
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>
      
      <ImageLightbox 
        image={lightboxImage} 
        isOpen={lightboxOpen} 
        onClose={() => {
          setLightboxOpen(false)
          setLightboxImage(null)
        }} 
      />
      
      <div className="product-detail-container">
        <div className="product-detail-image-section">
          {(() => {
            // Get images array or fallback to single image
            const images = product.images && Array.isArray(product.images) && product.images.length > 0
              ? product.images
              : (product.image ? [product.image] : []);
            
            if (images.length === 0) {
              return (
                <div className="product-detail-image">
                  <div className="product-detail-placeholder">
                    <span className="placeholder-icon">🧸</span>
                  </div>
                </div>
              );
            }
            
            return (
              <>
                <div 
                  className="product-detail-image"
                  onClick={() => {
                    setLightboxImage(images[selectedImageIndex])
                    setLightboxOpen(true)
                  }}
                  style={{ cursor: 'zoom-in' }}
                >
                  <img src={images[selectedImageIndex]} alt={`${product.name} - Image ${selectedImageIndex + 1}`} />
                </div>
                {images.length > 1 && (
                  <div className="product-image-gallery">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        className={`gallery-thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img src={img} alt={`${product.name} thumbnail ${index + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
        
        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          
          {product.price && (
            <div className="product-detail-price">
              ${product.price}
            </div>
          )}
          
          {product.description && (
            <div className="product-detail-section">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}
          
          {product.characterStory && (
            <div className="product-detail-section character-story-section">
              <h3>Character Story</h3>
              <p className="character-story-text">{product.characterStory}</p>
            </div>
          )}
          
          <div className="product-detail-meta-grid">
            {product.category && (
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{product.category}</span>
              </div>
            )}
            {product.ageGroup && (
              <div className="meta-item">
                <span className="meta-label">Age Group:</span>
                <span className="meta-value">{product.ageGroup}</span>
              </div>
            )}
            {product.material && (
              <div className="meta-item">
                <span className="meta-label">Material:</span>
                <span className="meta-value">{product.material}</span>
              </div>
            )}
            {product.size && (
              <div className="meta-item">
                <span className="meta-label">Size:</span>
                <span className="meta-value">{product.size}</span>
              </div>
            )}
          </div>
          
          {product.careInstructions && (
            <div className="product-detail-section">
              <h3>Care Instructions</h3>
              <p>{product.careInstructions}</p>
            </div>
          )}
          
          <div className="product-detail-actions">
            <button onClick={handleAddToCart} className="btn btn-primary">
              Add to Cart
            </button>
            <Link to="/products" className="btn btn-secondary">
              View All Products
            </Link>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h3>Customer Reviews ({reviews.length})</h3>
              <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-review-toggle">
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="form-group">
                  <label htmlFor="customerName">Your Name *</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={reviewForm.customerName}
                    onChange={(e) => setReviewForm({...reviewForm, customerName: e.target.value})}
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="rating">Rating *</label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${reviewForm.rating >= star ? 'active' : ''}`}
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="comment">Your Review *</label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    required
                    rows="4"
                    placeholder="Share your experience..."
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </form>
            )}

            {reviews.length === 0 ? (
              <div className="no-reviews">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div>
                        <h4>{review.customerName}</h4>
                        <div className="review-rating">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={review.rating >= star ? 'star-filled' : 'star-empty'}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Toys Section */}
      {recommendedProducts.length > 0 && (
        <div className="recommended-products-section">
          <h2 className="recommended-title">Recommended Toys</h2>
          <div className="recommended-products-grid">
            {recommendedProducts.map(recProduct => {
              const firstImage = recProduct.images && Array.isArray(recProduct.images) && recProduct.images.length > 0
                ? recProduct.images[0]
                : (recProduct.image || null)
              return (
                <Link key={recProduct.id} to={`/product/${recProduct.id}`} className="recommended-product-card">
                  <div className="recommended-product-image">
                    {firstImage ? (
                      <img src={firstImage} alt={recProduct.name} />
                    ) : (
                      <div className="recommended-placeholder">🧸</div>
                    )}
                  </div>
                  <div className="recommended-product-info">
                    <h3>{recProduct.name}</h3>
                    {recProduct.price && (
                      <p className="recommended-price">${recProduct.price.toFixed(2)}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail

