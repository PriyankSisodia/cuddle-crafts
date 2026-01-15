import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../utils/storage'
import './Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadProducts = () => {
      const allProducts = getProducts()
      setProducts(allProducts)
    }
    loadProducts()
    // Reload products every 2 seconds to catch updates
    const interval = setInterval(loadProducts, 2000)
    return () => clearInterval(interval)
  }, [])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Soft Toys Collection 🧸</h1>
        <p>Discover our adorable collection of handcrafted soft toys</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search toys..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧸</div>
          <h2>No toys found</h2>
          <p>
            {searchTerm 
              ? "Try a different search term" 
              : "Start adding products to see them here!"}
          </p>
          <Link to="/admin" className="btn btn-primary">
            Add Your First Product ➕
          </Link>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <Link 
              key={product.id} 
              to={`/product/${product.id}`}
              className="product-card"
            >
              <div className="product-image-container">
                {(() => {
                  const firstImage = product.images && Array.isArray(product.images) && product.images.length > 0 
                    ? product.images[0] 
                    : (product.image || null);
                  return firstImage ? (
                    <img src={firstImage} alt={product.name} className="product-image" />
                  ) : (
                    <div className="product-image-placeholder">
                      <span className="placeholder-icon">🧸</span>
                    </div>
                  );
                })()}
                {product.price && (
                  <div className="product-price-badge">
                    ${product.price}
                  </div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  {product.category && (
                    <span className="product-category">{product.category}</span>
                  )}
                  {product.ageGroup && (
                    <span className="product-age">{product.ageGroup}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products

