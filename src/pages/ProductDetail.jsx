import { useParams, useNavigate } from 'react-router-dom'
import { categories } from '../data/storeData'
import './ProductDetail.css'

function ProductDetail({ products, addToCart, cartIds }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const product = products.find((item) => item.id === Number(id))

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

  const inCart = cartIds.includes(product.id)

  const handleBuyNow = () => {
    if (!inCart) {
      addToCart(product)
    }
    navigate('/checkout')
  }

  return (
    <section className="detail-page">
      <img src={product.image} alt={product.name} />
      <div>
        <p className="eyebrow">{product.badge || 'Fresh Choice'}</p>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <div className="price-line">₹{product.price} <span>/ {product.unit}</span></div>
        <ul>
          <li>Delivered fresh with careful packing</li>
          <li>Category: {categories.find((item) => item.id === product.category)?.name || product.category}</li>
          <li>Current stock: {product.stock} units</li>
        </ul>
        <div className="detail-actions" style={{ marginTop: '20px' }}>
          <button className="primary" disabled={inCart} onClick={() => addToCart(product)} type="button">
            {inCart ? 'Already in Cart' : 'Add to Cart'}
          </button>
          <button className="ghost" onClick={handleBuyNow} type="button">Buy Now</button>
        </div>
      </div>
    </section>
  )
}

export default ProductDetail
