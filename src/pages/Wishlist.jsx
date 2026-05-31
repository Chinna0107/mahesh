import { Link } from 'react-router-dom'
import { FaHeart, FaArrowRight } from 'react-icons/fa6'
import { ProductCard, SectionTitle } from '../components/Shared'
import './Wishlist.css'

function Wishlist({ wishlist, toggleWishlist, addToCart, cartIds }) {
  return (
    <section className="wishlist-page">
      <div className="wishlist-header">
        <SectionTitle title="Your Wishlist" text="Products you've saved for later." />
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <FaHeart className="empty-icon" />
          <h2>Your wishlist is empty</h2>
          <p>Save items you love and buy them later when you're ready.</p>
          <Link to="/products" className="primary">Browse Products <FaArrowRight /></Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              inCart={cartIds.includes(product.id)}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              extraAction={
                <button 
                  className="ghost small unwish-btn" 
                  onClick={() => toggleWishlist(product)}
                  type="button"
                  style={{ border: '1.5px solid #e63946', color: '#e63946' }}
                >
                  Remove
                </button>
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Wishlist
