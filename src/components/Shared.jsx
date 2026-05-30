import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowRight, FaPaperPlane, FaXmark, FaCheck } from 'react-icons/fa6'
import { slugify } from '../utils/slugify'

export function SectionTitle({ title, text }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  )
}

export function SplitSection({ eyebrow, title, text, image }) {
  return (
    <section className="split-section">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <img src={image} alt={title} />
    </section>
  )
}

export function ProductCard({ product, addToCart, inCart = false }) {
  const navigate = useNavigate()

  const handleCardClick = (e) => {
    e.preventDefault()
    navigate(`/product/${slugify(product.name_english || product.name)}`)
  }

  return (
    <article className="product-card reveal-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="product-image-link" onClick={handleCardClick}>
        <img src={product.image} alt={product.name} />
      </div>
      <span className="product-badge">{product.badge}</span>
      <h3 className="product-title" onClick={handleCardClick}>{product.name}</h3>
      <p>{product.description}</p>
      <div className="product-meta">
        <b>₹{product.price}</b>
        <small>/{product.unit}</small>
      </div>
      <div className="product-card-actions" onClick={(e) => e.stopPropagation()}>
        <button 
          className="primary small" 
          disabled={inCart} 
          onClick={() => addToCart(product)} 
          type="button"
        >
          {inCart ? 'Added' : 'Add'} {!inCart && <FaArrowRight />}
        </button>
        <button 
          className="ghost small details-btn" 
          onClick={() => navigate(`/product/${slugify(product.name_english || product.name)}`)} 
          type="button"
        >
          Details
        </button>
      </div>
    </article>
  )
}

export function ProductDetailsModal({ product, onClose, addToCart, inCart = false }) {
  const navigate = useNavigate()
  
  // Safe parsing of quantity variants
  const variants = Array.isArray(product.quantity_prices) ? product.quantity_prices : []
  const [selectedVariant, setSelectedVariant] = useState(variants.length > 0 ? variants[0] : null)
  
  if (!product) return null

  const handleBuyNow = () => {
    addToCart(product, selectedVariant)
    navigate('/checkout')
    onClose()
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price
  const currentUnit = selectedVariant ? selectedVariant.quantity : product.unit
  const currentMrp = selectedVariant ? selectedVariant.mrp : product.mrp

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <button className="modal-close-btn" onClick={onClose} type="button" aria-label="Close details">
          <FaXmark />
        </button>
        
        <div className="modal-content-grid" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
          <div className="modal-image-wrapper" style={{ overflow: 'hidden', borderRadius: '12px' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
          </div>
          
          <div className="modal-info-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span className="modal-badge">{product.badge || 'Fresh Choice'}</span>
            <h2 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--primary-green-dark)' }}>{product.name}</h2>
            {product.name_english && (
              <p style={{ margin: '-8px 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{product.name_english}</p>
            )}
            <p className="modal-desc" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{product.description}</p>
            
            {/* Quantity Variant Selector */}
            {variants.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Select Quantity Variant:</span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {variants.map((v, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedVariant(v)}
                      className={`admin-btn secondary small${selectedVariant === v ? ' active' : ''}`}
                      type="button"
                      style={{ 
                        borderRadius: '20px', 
                        padding: '6px 12px',
                        background: selectedVariant === v ? 'var(--primary-green)' : '#fff',
                        color: selectedVariant === v ? '#fff' : 'var(--text-dark)',
                        borderColor: selectedVariant === v ? 'var(--primary-green)' : 'var(--border-light)'
                      }}
                    >
                      {v.quantity} (₹{v.price})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-price-line" style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '10px' }}>
              <b style={{ fontSize: '1.6rem', color: 'var(--accent-gold-dark)' }}>₹{currentPrice}</b>
              <small style={{ color: 'var(--text-muted)' }}>/{currentUnit}</small>
              {currentMrp && Number(currentMrp) > Number(currentPrice) && (
                <span style={{ textDecoration: 'line-through', fontSize: '0.85rem', color: '#c5221f', marginLeft: '8px' }}>
                  MRP ₹{currentMrp}
                </span>
              )}
            </div>
            
            <ul className="modal-features" style={{ margin: '10px 0', paddingLeft: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'grid', gap: '4px' }}>
              <li><FaCheck style={{ color: 'var(--primary-green)', marginRight: '6px' }} /> Guaranteed farm-fresh quality</li>
              <li><FaCheck style={{ color: 'var(--primary-green)', marginRight: '6px' }} /> 100% natural, no chemicals or preservatives</li>
              <li><FaCheck style={{ color: 'var(--primary-green)', marginRight: '6px' }} /> Sourced directly from local farmers</li>
            </ul>
            
            <div className="modal-actions" style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
              <button 
                className="primary" 
                onClick={() => { addToCart(product, selectedVariant); onClose(); }}
                type="button"
                style={{ flex: 1, padding: '10px' }}
              >
                Add to Cart
              </button>
              <button 
                className="ghost" 
                onClick={handleBuyNow}
                type="button"
                style={{ flex: 1, padding: '10px' }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InquiryForm({ redirectInquiry, title = 'Send an Inquiry', showEmail = false }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })

  const submit = () => {
    redirectInquiry(`Hi Mahesh, my name is ${form.name}. Phone: ${form.phone}. Email: ${form.email || 'Not provided'}. Message: ${form.message}`)
  }

  return (
    <form className="inquiry-form" onSubmit={(event) => { event.preventDefault(); submit() }}>
      <h3>{title}</h3>
      <label>
        Full Name
        <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Enter your name" required />
      </label>
      <label>
        Phone Number
        <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Enter phone number" required />
      </label>
      {showEmail && (
        <label>
          Email Address
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Enter email address" type="email" />
        </label>
      )}
      <label>
        Your Message
        <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="How can we help you?" required />
      </label>
      <button className="primary" type="submit">Submit Inquiry <FaPaperPlane /></button>
    </form>
  )
}
