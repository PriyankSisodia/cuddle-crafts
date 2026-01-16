import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Cuddle Crafts</h3>
          <p>Handcrafted exclusive soft toys that bring joy, comfort, and endless cuddles!</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul>
            <li>
              <a href="mailto:contact@cuddlecrafts.com">contact@cuddlecrafts.com</a>
            </li>
            <li>
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="https://instagram.com/cuddlecrafts" target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="social-icon">📷</span>
              Instagram
            </a>
            <a href="https://facebook.com/cuddlecrafts" target="_blank" rel="noopener noreferrer" className="social-link">
              <span className="social-icon">👥</span>
              Facebook
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Cuddle Crafts. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

