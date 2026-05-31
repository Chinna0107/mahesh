import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { categories } from '../data/storeData'
import { FaArrowLeft, FaClock, FaUsers, FaCheck, FaStar, FaFire, FaCartShopping, FaHeart, FaRegHeart } from 'react-icons/fa6'
import { slugify } from '../utils/slugify'
import { ScrollReveal } from '../components/Shared'
import './ProductDetail.css'

const SPICE_LABELS = [
  { label: 'No Spice', emoji: '😊', color: 'spice-none' },
  { label: 'Mild Spice', emoji: '🌶️', color: 'spice-mild' },
  { label: 'Medium Spice', emoji: '🌶️🌶️', color: 'spice-medium' },
  { label: 'Hot & Spicy', emoji: '🌶️🌶️🌶️', color: 'spice-hot' },
]

function ProductDetail({ products, addToCart, cartIds, cart = [], wishlist = [], toggleWishlist }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)

  const product = products.find((item) => slugify(item.name_english || item.name) === slug || String(item.id) === slug)

  // Quantity selection logic
  const variants = useMemo(() => {
    return product && Array.isArray(product.quantity_prices) ? product.quantity_prices : []
  }, [product])

  const [selectedVariant, setSelectedVariant] = useState(null)

  // Initialize selected variant when product changes
  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants[0])
    } else {
      setSelectedVariant(null)
    }
    setSelectedImage(0)
  }, [product, variants])

  // Compute pricing and in-cart logic
  const currentPrice = selectedVariant ? Number(selectedVariant.price) : (product ? Number(product.price) : 0)
  const currentUnit = selectedVariant ? selectedVariant.quantity : (product ? product.unit : '')
  const currentMrp = selectedVariant ? (selectedVariant.mrp ? Number(selectedVariant.mrp) : null) : (product && product.mrp ? Number(product.mrp) : null)
  const discount = currentMrp && currentMrp > currentPrice ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100) : 0

  const cartItemId = selectedVariant 
    ? `${product?.id}-${selectedVariant.quantity.replace(/\s+/g, '')}` 
    : `${product?.id}`

  const isItemInCart = useMemo(() => {
    return cart && cart.some(item => (item.cartItemId || item.id) === cartItemId)
  }, [cart, cartItemId])

  const similarProducts = useMemo(() => {
    if (!products || !product) return []
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
  }, [products, product])

  if (!product) {
    return (
      <section className="page-hero compact text-center" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p className="eyebrow">404 Error</p>
        <h1>Product Not Found</h1>
        <p>The product you are looking for does not exist or has been removed.</p>
        <button className="primary" onClick={() => navigate('/products')} type="button">
          Back to Shop
        </button>
      </section>
    )
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean)

  const handleBuyNow = () => {
    addToCart(product, selectedVariant)
    navigate('/checkout')
  }

  // Calculate average rating
  const avgRating = useMemo(() => {
    const reviews = product.reviews || []
    if (reviews.length === 0) return 4.8 // Default fallback average
    const total = reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0)
    return Number((total / reviews.length).toFixed(1))
  }, [product.reviews])

  return (
    <div className="product-detail-wrapper">
      {/* Sticky/Header Bar */}
      <div className="detail-top-nav">
        <button onClick={() => navigate(-1)} className="back-link-btn" type="button">
          <FaArrowLeft /> Back to products
        </button>
      </div>

      <section className="detail-page-new">
        {/* Left Column: Image Gallery */}
        <div className="gallery-section">
          <div className="main-image-container">
            {product.badge && <span className="detail-badge-overlay">{product.badge}</span>}
            {discount > 0 && <span className="detail-discount-overlay">{discount}% OFF</span>}
            <img src={allImages[selectedImage]} alt={product.name} className="main-display-image" />
          </div>

          {/* Gallery Thumbnails */}
          {allImages.length > 1 && (
            <div className="gallery-thumbnails">
              {allImages.map((img, index) => (
                <button 
                  key={index} 
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail-btn${index === selectedImage ? ' active' : ''}`}
                  type="button"
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info Panel */}
        <ScrollReveal className="info-section">
          <div className="info-header">
            <span className="category-tag">
              {categories.find((c) => c.id === product.category)?.name || product.category}
            </span>
            <h1 className="product-title-text">{product.name}</h1>
            {product.name_english && <p className="english-title-text">{product.name_english}</p>}

            {/* Price Line */}
            <div className="price-display-row">
              <span className="price-value">₹{currentPrice}</span>
              {currentMrp && currentMrp > currentPrice && (
                <>
                  <span className="mrp-value">₹{currentMrp}</span>
                  <span className="savings-value">{discount}% OFF</span>
                </>
              )}
              <span className="unit-value">/ {currentUnit}</span>
            </div>
            <p className="tax-notice">Inclusive of all taxes</p>
          </div>

          {/* Description */}
          {product.description && (
            <div className="product-description-block">
              <h3>About this product</h3>
              <p>{product.description}</p>
            </div>
          )}

          {/* Quantity Variants Selection */}
          {variants.length > 0 && (
            <div className="variant-selection-block">
              <h3>Select Quantity</h3>
              <select 
                className="variant-dropdown"
                value={selectedVariant?.quantity}
                onChange={(e) => setSelectedVariant(variants.find(v => v.quantity === e.target.value))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-focus)',
                  fontSize: '15px',
                  fontWeight: '600',
                  background: 'var(--bg-cream)',
                  marginTop: '8px',
                  cursor: 'pointer',
                  color: 'var(--text-dark)'
                }}
              >
                {variants.map((v, i) => (
                  <option key={i} value={v.quantity}>
                    {v.quantity} — ₹{v.price} {v.mrp > v.price ? `(Save ₹${v.mrp - v.price})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="detail-page-actions">
            <button 
              className="primary action-btn-main" 
              onClick={() => addToCart(product, selectedVariant)} 
              type="button"
            >
              <FaCartShopping /> {isItemInCart ? 'Add More to Cart' : 'Add to Cart'}
            </button>
            
            <div className="buy-wishlist-row">
              <button 
                className="wishlist-action-btn"
                onClick={() => toggleWishlist && toggleWishlist(product)}
                type="button"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  background: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: wishlist.some(item => item.id === product.id) ? '#e63946' : 'var(--text-muted)'
                }}
              >
                {wishlist.some(item => item.id === product.id) ? <FaHeart /> : <FaRegHeart />}
              </button>
              <button 
                className="ghost action-btn-buy" 
                onClick={handleBuyNow} 
                type="button"
                style={{ flex: 1 }}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="specs-features-grid">
            {product.shelf_life && (
              <div className="spec-card">
                <FaClock className="spec-icon" />
                <div className="spec-info">
                  <span className="spec-label">Shelf Life</span>
                  <span className="spec-val">{product.shelf_life}</span>
                </div>
              </div>
            )}
            {product.serves && (
              <div className="spec-card">
                <FaUsers className="spec-icon" />
                <div className="spec-info">
                  <span className="spec-label">Pack size</span>
                  <span className="spec-val">{product.serves}</span>
                </div>
              </div>
            )}
          </div>

          {/* Spice Level */}
          {product.spice_level !== undefined && product.spice_level > 0 && (
            <div className="spice-level-card">
              <div className="spice-header">
                <FaFire className="spice-icon-fire" />
                <span>Spice Intensity</span>
              </div>
              <span className={`spice-label-badge ${SPICE_LABELS[product.spice_level]?.color}`}>
                {SPICE_LABELS[product.spice_level]?.emoji} {SPICE_LABELS[product.spice_level]?.label}
              </span>
            </div>
          )}

          {/* Ingredients list */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="ingredients-block">
              <h3>Ingredients</h3>
              <div className="ingredients-pills">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="ingredient-pill">{ing}</span>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition Info */}
          {product.nutrition && typeof product.nutrition === 'object' && Object.values(product.nutrition).some(Boolean) && (
            <div className="nutrition-block">
              <h3>Nutrition Facts (per 100g)</h3>
              <div className="nutrition-grid">
                {product.nutrition.calories && (
                  <div className="nutrition-item">
                    <span className="nutrition-val">{product.nutrition.calories}</span>
                    <span className="nutrition-lbl">Calories</span>
                  </div>
                )}
                {product.nutrition.protein && (
                  <div className="nutrition-item">
                    <span className="nutrition-val">{product.nutrition.protein}</span>
                    <span className="nutrition-lbl">Protein</span>
                  </div>
                )}
                {product.nutrition.carbs && (
                  <div className="nutrition-item">
                    <span className="nutrition-val">{product.nutrition.carbs}</span>
                    <span className="nutrition-lbl">Carbs</span>
                  </div>
                )}
                {product.nutrition.fat && (
                  <div className="nutrition-item">
                    <span className="nutrition-val">{product.nutrition.fat}</span>
                    <span className="nutrition-lbl">Fat</span>
                  </div>
                )}
                {product.nutrition.fiber && (
                  <div className="nutrition-item">
                    <span className="nutrition-val">{product.nutrition.fiber}</span>
                    <span className="nutrition-lbl">Fiber</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quality checks */}
          <ul className="guarantee-points">
            <li><FaCheck className="check-bullet" /> Farm fresh, slow cooked & handpicked</li>
            <li><FaCheck className="check-bullet" /> 100% natural, chemical free & pure quality</li>
            <li><FaCheck className="check-bullet" /> Sourced responsibly from local farms</li>
          </ul>
        </ScrollReveal>
      </section>

      {/* Ratings & Reviews */}
      <ScrollReveal className="reviews-section-detail">
        <h2 className="reviews-section-title">
          Customer Ratings & Reviews
          <span className="reviews-count-badge">({product.reviews?.length || 0})</span>
        </h2>

        <div className="reviews-layout-grid">
          {/* Average block */}
          <div className="rating-average-card">
            <span className="rating-number">{avgRating}</span>
            <div className="stars-row">
              {[1, 2, 3, 4, 5].map((s) => (
                <FaStar key={s} className={s <= Math.round(avgRating) ? 'star-gold' : 'star-grey'} />
              ))}
            </div>
            <p className="rating-caption">Average customer rating</p>
          </div>

          {/* List of reviews */}
          <div className="reviews-list-container">
            {product.reviews && product.reviews.length > 0 ? (
              <div className="reviews-scroll-list">
                {product.reviews.map((review, i) => (
                  <div key={i} className="review-comment-card">
                    <div className="review-card-header">
                      <span className="reviewer-name">{review.name}</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FaStar key={s} className={s <= review.rating ? 'star-gold' : 'star-grey'} />
                      ))}
                    </div>
                    <p className="review-comment-text">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-reviews-card">
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <ScrollReveal className="similar-products-section" delay={0.1}>
          <h2>People Also Buy</h2>
          <div className="similar-products-grid">
            {similarProducts.map((p) => {
              const discPercent = p.mrp && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0
              return (
                <Link key={p.id} to={`/product/${slugify(p.name_english || p.name)}`} className="similar-product-card">
                  <div className="similar-card-image">
                    {p.badge && <span className="similar-badge">{p.badge}</span>}
                    {discPercent > 0 && <span className="similar-discount">{discPercent}% OFF</span>}
                    <img src={p.image} alt={p.name} />
                  </div>
                  <div className="similar-card-content">
                    <h4>{p.name}</h4>
                    {p.name_english && <small className="similar-english-title">{p.name_english}</small>}
                    <div className="similar-price-row">
                      <span className="sim-price">₹{p.price}</span>
                      {p.mrp && p.mrp > p.price && <span className="sim-mrp">₹{p.mrp}</span>}
                      <span className="sim-unit">/{p.unit}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </ScrollReveal>
      )}
    </div>
  )
}

export default ProductDetail
