import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCartItems } from '../utils/storage'
import './Navbar.css'

function Navbar({ onCartClick }) {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      const items = getCartItems()
      const count = items.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(count)
    }
    updateCartCount()
    const interval = setInterval(updateCartCount, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🧸</span>
          <span className="logo-text">Cuddle Crafts</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <button onClick={onCartClick} className="nav-link cart-link">
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

