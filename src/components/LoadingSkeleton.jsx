import React from 'react'
import './LoadingSkeleton.css'

function LoadingSkeleton({ type = 'product', count = 1 }) {
  const skeletons = Array.from({ length: count }, (_, i) => i)

  if (type === 'product') {
    return (
      <>
        {skeletons.map(i => (
          <div key={i} className="skeleton-product-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-text"></div>
              <div className="skeleton-line skeleton-text short"></div>
            </div>
          </div>
        ))}
      </>
    )
  }

  if (type === 'text') {
    return (
      <>
        {skeletons.map(i => (
          <div key={i} className="skeleton-line"></div>
        ))}
      </>
    )
  }

  return null
}

export default LoadingSkeleton

