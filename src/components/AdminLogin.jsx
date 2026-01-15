import React, { useState } from 'react'
import { loginAdmin } from '../utils/storage'
import './AdminLogin.css'

function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Small delay for better UX
    setTimeout(() => {
      const success = loginAdmin(password)
      if (success) {
        onLoginSuccess()
      } else {
        setError('Incorrect password. Please try again.')
        setPassword('')
      }
      setIsLoading(false)
    }, 300)
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h2>Admin Login</h2>
          <p>Enter your admin password to access product management</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              autoFocus
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-hint">
          <p className="hint-small">Authorized access only</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin

