import { Link } from 'react-router-dom'
import { FaTrash, FaMinus, FaPlus, FaCartShopping, FaArrowRight } from 'react-icons/fa6'
import './Cart.css'

function Cart({ cart, setCart, cartTotal }) {
  const updateQty = (cartItemId, qty) => {
    if (qty < 1) return
    setCart(items => items.map(i => (i.cartItemId || i.id) === cartItemId ? { ...i, qty } : i))
  }

  const removeItem = (cartItemId) => {
    setCart(items => items.filter(i => (i.cartItemId || i.id) !== cartItemId))
  }

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon"><FaCartShopping /></div>
        <h2>Your cart is empty</h2>
        <p>Explore our farm fresh products and add them here!</p>
        <Link className="primary" to="/products" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          Start Shopping
        </Link>
      </div>
    )
  }

  const itemCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <section className="cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <button className="cart-clear-btn" onClick={() => setCart([])} type="button">Clear all</button>
      </div>

      <div className="cart-layout">
        {/* Items */}
        <div className="cart-items">
          {cart.map((item) => {
            const key = item.cartItemId || item.id;
            return (
              <article className="cart-item" key={key}>
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <b>{item.name}</b>
                  <span>₹{item.price} / {item.unit}</span>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => updateQty(key, item.qty - 1)} type="button" aria-label="Decrease"><FaMinus /></button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(key, item.qty + 1)} type="button" aria-label="Increase"><FaPlus /></button>
                </div>
                <strong className="cart-item-total">₹{item.price * item.qty}</strong>
                <button className="cart-remove-btn" onClick={() => removeItem(key)} type="button" aria-label="Remove item">
                  <FaTrash />
                </button>
              </article>
            )
          })}
        </div>

        {/* Summary */}
        <div className="cart-summary-panel">
          <h3>Order Summary</h3>
          <div className="cart-summary-rows">
            <div className="cart-summary-row">
              <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery</span>
              <span className="cart-free-tag">FREE</span>
            </div>
            <div className="cart-summary-total">
              <span>Total</span>
              <b>₹{cartTotal}</b>
            </div>
          </div>
          <Link className="cart-checkout-btn" to="/checkout" style={{ textDecoration: 'none' }}>
            Proceed to Checkout <FaArrowRight />
          </Link>
          <Link to="/products" className="cart-continue-link" style={{ textDecoration: 'none' }}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Cart
