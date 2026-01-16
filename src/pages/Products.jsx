import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, addToCart } from '../utils/storage'
import LoadingSkeleton from '../components/LoadingSkeleton'
import './Products.css'

function Products({ onAddToCart }) {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = () => {
      const allProducts = getProducts()
      setProducts(allProducts)
      setLoading(false)
    }
    // Simulate loading for better UX
    setTimeout(loadProducts, 500)
    // Reload products every 2 seconds to catch updates
    const interval = setInterval(() => {
      const allProducts = getProducts()
      setProducts(allProducts)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleAddToCartClick = (e, productId) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(productId, 1)
    if (onAddToCart) onAddToCart()
  }

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]

  // Filter products
  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0)
      case 'price-high':
        return (b.price || 0) - (a.price || 0)
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Soft Toys Collection 🧸</h1>
        <p>Discover our adorable collection of handcrafted soft toys</p>
        <div className="products-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search toys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="category-filter">Category:</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="sort-filter">Sort by:</label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="products-grid">
          <LoadingSkeleton type="product" count={6} />
        </div>
      ) : filteredProducts.length === 0 ? (
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
          {filteredProducts.map(product => {
            const firstImage = product.images && Array.isArray(product.images) && product.images.length > 0 
              ? product.images[0] 
              : (product.image || null);
            return (
              <div key={product.id} className="product-card-wrapper">
                <Link 
                  to={`/product/${product.id}`}
                  className="product-card"
                >
                  <div className="product-image-container">
                    {firstImage ? (
                      <img src={firstImage} alt={product.name} className="product-image" />
                    ) : (
                      <div className="product-image-placeholder">
                        <span className="placeholder-icon">🧸</span>
                      </div>
                    )}
                    {product.badge && (
                      <div className={`product-badge product-badge-${product.badge}`}>
                        {product.badge === 'best-seller' ? 'Best Seller' : 
                         product.badge === 'new' ? 'New' : 
                         product.badge === 'sale' ? 'Sale' : product.badge}
                      </div>
                    )}
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
                <button
                  onClick={(e) => handleAddToCartClick(e, product.id)}
                  className="product-add-to-cart-btn"
                  aria-label={`Add ${product.name} to cart`}
                >
                  Add to Cart
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Products

