import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaMapLocationDot, FaCreditCard, FaBoxOpen, FaChevronRight, FaCircleCheck } from 'react-icons/fa6'
import { api } from '../api'
import './Checkout.css'

const STEPS = [
  { id: 1, label: 'Review', icon: <FaBoxOpen /> },
  { id: 2, label: 'Address', icon: <FaMapLocationDot /> },
  { id: 3, label: 'Payment', icon: <FaCreditCard /> },
]

const STATES = ['Telangana', 'Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Kerala', 'Other']

const COUPONS = [
  { code: 'FRESH10', type: 'percent', value: 10, description: '10% off on all fresh farm produce' },
  { code: 'MAHESH20', type: 'percent', value: 20, description: '20% off on order value' },
  { code: 'WELCOME50', type: 'flat', value: 50, description: '₹50 flat discount on your order' },
]

function Checkout({ cart, setCart, cartTotal, user }) {
  const [step, setStep] = useState(1)
  const [successDetails, setSuccessDetails] = useState(null)
  const navigate = useNavigate()
  const [checkingOut, setCheckingOut] = useState(false)
  const [address, setAddress] = useState({
    name: '', email: '', phone: '', line1: '', line2: '',
    city: 'Hyderabad', pincode: '500001', state: 'Telangana', customState: '',
  })

  // Coupon state variables
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')

  // Prefill address if customer is logged in
  useEffect(() => {
    if (user) {
      setAddress(p => ({
        ...p,
        name: p.name || user.name || '',
        email: p.email || user.email || '',
        phone: p.phone || user.phone || '',
        line1: p.line1 || user.address || '',
      }))
    }
  }, [user])

  const set = (key) => (e) => setAddress(p => ({ ...p, [key]: e.target.value }))

  const isAddressValid = address.name && address.email && address.phone &&
    address.line1 && address.city && address.pincode &&
    (address.state !== 'Other' || address.customState)

  // Calculations for Discount and Grand Total
  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0
    if (appliedCoupon.type === 'percent') {
      return Math.round((cartTotal * appliedCoupon.value) / 100)
    }
    if (appliedCoupon.type === 'flat') {
      return appliedCoupon.value
    }
    return 0
  }

  const discountAmount = getDiscountAmount()
  const grandTotal = Math.max(0, cartTotal - discountAmount)

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    setCouponError('')
    setCouponSuccess('')
    
    const code = couponCode.trim().toUpperCase()
    if (!code) return

    const coupon = COUPONS.find(c => c.code === code)
    if (coupon) {
      setAppliedCoupon(coupon)
      setCouponSuccess(`Applied coupon "${coupon.code}" successfully! ${coupon.description}.`)
    } else {
      setCouponError('Invalid coupon code. Try FRESH10, MAHESH20, or WELCOME50.')
      setAppliedCoupon(null)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponSuccess('')
    setCouponError('')
  }

  const handleCheckoutPayment = async () => {
    setCheckingOut(true)
    try {
      // 1. Create order in the database and create Razorpay order in backend (using grandTotal)
      const res = await api.payment.createOrder(cart, address, grandTotal)

      const options = {
        key: res.key,
        amount: res.amount,
        currency: 'INR',
        name: 'Mahesh Farm Fresh',
        description: 'Premium Farm Staples Checkout',
        order_id: res.order_id,
        handler: async (paymentRes) => {
          try {
            await api.payment.verifyPayment({
              razorpay_order_id: paymentRes.razorpay_order_id,
              razorpay_payment_id: paymentRes.razorpay_payment_id,
              razorpay_signature: paymentRes.razorpay_signature,
              receipt: res.receipt
            })
            setSuccessDetails({
              orderId: res.receipt || res.order_id || 'ME1029',
              amount: grandTotal,
              address: address,
              items: [...cart],
              isMock: false
            })
            setCart([]) // Clear the cart
          } catch (err) {
            alert(`Payment verification failed: ${err.message}`)
          }
        },
        prefill: {
          name: address.name,
          email: address.email,
          contact: address.phone
        },
        theme: {
          color: '#364a38'
        }
      }

      // 2. Open Razorpay if script is loaded and it's not a mock order
      const isMockOrder = res.order_id && res.order_id.startsWith('rzp_mock');
      if (window.Razorpay && !isMockOrder) {
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // Fallback for development: automatically verify order with mock signature
        console.warn('Bypassing Razorpay modal. Using automatic mock verify bypass.')
        await api.payment.verifyPayment({
          razorpay_order_id: res.order_id,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: 'mock_bypass',
          receipt: res.receipt
        })
        setSuccessDetails({
          orderId: res.receipt || res.order_id || 'ME1029',
          amount: grandTotal,
          address: address,
          items: [...cart],
          isMock: true
        })
        setCart([]) // Clear the cart
      }
    } catch (err) {
      alert(`Checkout failed: ${err.message}`)
    } finally {
      setCheckingOut(false)
    }
  }

  if (cart.length === 0 && !successDetails) {
    return (
      <div className="checkout-empty">
        <p>Your cart is empty. You cannot proceed to checkout.</p>
        <Link className="primary" to="/products" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          Explore Products
        </Link>
      </div>
    )
  }

  if (successDetails) {
    return (
      <div className="checkout-page">
        <div className="checkout-card success-card">
          <svg className="ft-green-tick" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="ft-green-tick-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="ft-green-tick-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
          
          <h1 className="success-title">Order Placed Successfully!</h1>
          
          <p className="success-message">
            Your order has been placed successfully! Thank you for shopping with <strong>Mahesh Farm Fresh</strong>. 
            Your order details have been dispatched to your email.
          </p>

          <div className="success-receipt-box">
            <div className="receipt-row">
              <span>Receipt ID:</span>
              <strong>#{successDetails.orderId}</strong>
            </div>
            <div className="receipt-row">
              <span>Amount Paid:</span>
              <strong className="success-amount">₹{successDetails.amount}</strong>
            </div>
            {successDetails.isMock && (
              <div className="receipt-row mock-tag-row">
                <span>Payment Mode:</span>
                <span className="success-mock-badge">Dev Demo (Mock Paid)</span>
              </div>
            )}
          </div>

          <div className="success-details-section">
            <h3>Delivery Details</h3>
            <p className="success-customer-name">{successDetails.address.name}</p>
            <p className="success-customer-contact">{successDetails.address.phone} · {successDetails.address.email}</p>
            <p className="success-customer-addr">
              {successDetails.address.line1}
              {successDetails.address.line2 ? `, ${successDetails.address.line2}` : ''}, {successDetails.address.city}, {successDetails.address.state} — {successDetails.address.pincode}
            </p>
          </div>

          <div className="success-items-section">
            <h3>Items Ordered</h3>
            <div className="success-items-list">
              {successDetails.items?.map((item) => (
                <div key={item.cartItemId || item.id} className="success-item-row">
                  <div className="success-item-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="success-item-desc">
                    <strong>{item.name}</strong>
                    <span>{item.unit} · Qty: {item.qty}</span>
                  </div>
                  <span className="success-item-price">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="success-actions">
            <Link to="/account/my-orders" className="primary success-btn">
              View My Orders
            </Link>
            <Link to="/products" className="ghost success-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="checkout-page">
      <h1>Checkout</h1>

      {/* Step indicator */}
      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <div key={s.id} className="checkout-step-wrapper">
            <div className={`checkout-step${step === s.id ? ' active' : ''}${step > s.id ? ' done' : ''}`}>
              <span className="step-icon">
                {step > s.id ? <FaCircleCheck /> : s.icon}
              </span>
              <span className="step-label">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <FaChevronRight className={`step-arrow${step > s.id ? ' done' : ''}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 — Review */}
      {step === 1 && (
        <div className="checkout-card">
          <h2>Review Your Order</h2>
          <div className="checkout-items">
            {cart.map((item) => (
              <div className="checkout-item" key={item.id}>
                <div className="checkout-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="checkout-item-info">
                  <b>{item.name}</b>
                  <span>{item.unit} · Qty: {item.qty}</span>
                </div>
                <strong>₹{item.price * item.qty}</strong>
              </div>
            ))}
          </div>
          <div className="checkout-subtotal">
            <span>Subtotal</span>
            <b>₹{cartTotal}</b>
          </div>
          <button className="primary checkout-cta" onClick={() => setStep(2)} type="button">
            Continue to Address →
          </button>
        </div>
      )}

      {/* Step 2 — Delivery Address */}
      {step === 2 && (
        <form className="checkout-card" onSubmit={(e) => { e.preventDefault(); setStep(3) }}>
          <h2><FaMapLocationDot /> Delivery Address</h2>

          {user && (
            <p style={{ margin: '-10px 0 20px', fontSize: '0.85rem', color: '#137333', background: '#e6f4ea', padding: '8px 12px', borderRadius: '12px', display: 'inline-block' }}>
              ✓ Auto-filled your saved account address details.
            </p>
          )}

          <div className="address-grid">
            <div className="field">
              <label>Full Name</label>
              <input value={address.name} onChange={set('name')} placeholder="Your full name" required />
            </div>
            <div className="field">
              <label>Email Address</label>
              <input type="email" value={address.email} onChange={set('email')} placeholder="you@example.com" required />
            </div>
            <div className="field">
              <label>Phone Number</label>
              <input value={address.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX" required />
            </div>
            <div className="field field-full">
              <label>Address Line 1</label>
              <input value={address.line1} onChange={set('line1')} placeholder="House/Flat No, Street" required />
            </div>
            <div className="field field-full">
              <label>Address Line 2 <span className="optional">(optional)</span></label>
              <input value={address.line2} onChange={set('line2')} placeholder="Landmark, Area" />
            </div>
            <div className="field">
              <label>City</label>
              <input value={address.city} onChange={set('city')} placeholder="Hyderabad" required />
            </div>
            <div className="field">
              <label>Pincode</label>
              <input value={address.pincode} onChange={set('pincode')} placeholder="500001" maxLength={6} required />
            </div>
            <div className="field">
              <label>State</label>
              <select value={address.state} onChange={set('state')}>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {address.state === 'Other' && (
              <div className="field">
                <label>Enter Your State</label>
                <input value={address.customState} onChange={set('customState')} placeholder="Your state" required />
              </div>
            )}
          </div>

          {/* Coupon Code Section */}
          <div className="coupon-section" style={{ borderTop: '1px solid #ccdcc2', paddingTop: '20px', marginTop: '20px', display: 'grid', gap: '10px' }}>
            <h3 style={{ margin: 0, color: '#17351f', fontSize: '1.1rem' }}>Promo Code / Coupon</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#6d8471' }}>Enter a coupon code to get a discount on your order.</p>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                value={couponCode} 
                onChange={(e) => setCouponCode(e.target.value)} 
                placeholder="e.g. FRESH10, MAHESH20, WELCOME50"
                style={{ maxWidth: '280px', textTransform: 'uppercase' }}
                disabled={!!appliedCoupon}
              />
              {appliedCoupon ? (
                <button 
                  type="button" 
                  className="ghost small" 
                  onClick={handleRemoveCoupon}
                  style={{ color: '#c5221f', borderColor: '#ea4335', minHeight: '40px' }}
                >
                  Remove Coupon
                </button>
              ) : (
                <button 
                  type="button" 
                  className="primary small" 
                  onClick={handleApplyCoupon}
                  style={{ minHeight: '40px' }}
                >
                  Apply
                </button>
              )}
            </div>

            {couponError && (
              <small style={{ color: '#c5221f', fontWeight: 'bold' }}>{couponError}</small>
            )}
            {couponSuccess && (
              <small style={{ color: '#137333', fontWeight: 'bold' }}>{couponSuccess}</small>
            )}
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              <span style={{ fontSize: '0.75rem', background: '#f0f5ec', color: '#364a38', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer', border: '1px dashed #ccdcc2' }} onClick={() => { if (!appliedCoupon) setCouponCode('FRESH10'); }}>
                FRESH10 (10% Off)
              </span>
              <span style={{ fontSize: '0.75rem', background: '#f0f5ec', color: '#364a38', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer', border: '1px dashed #ccdcc2' }} onClick={() => { if (!appliedCoupon) setCouponCode('MAHESH20'); }}>
                MAHESH20 (20% Off)
              </span>
              <span style={{ fontSize: '0.75rem', background: '#f0f5ec', color: '#364a38', padding: '4px 8px', borderRadius: '8px', cursor: 'pointer', border: '1px dashed #ccdcc2' }} onClick={() => { if (!appliedCoupon) setCouponCode('WELCOME50'); }}>
                WELCOME50 (₹50 Off)
              </span>
            </div>
          </div>

          <div className="checkout-nav">
            <button className="ghost checkout-back" onClick={() => setStep(1)} type="button">← Back</button>
            <button className="primary checkout-cta" type="submit" disabled={!isAddressValid}>
              Continue to Payment →
            </button>
          </div>
        </form>
      )}

      {/* Step 3 — Payment */}
      {step === 3 && (
        <div className="checkout-card">
          <h2>Order Summary</h2>
          <div className="checkout-summary-rows">
            <div className="checkout-summary-row"><span>Subtotal</span><span>₹{cartTotal}</span></div>
            {appliedCoupon && (
              <div className="checkout-summary-row" style={{ color: '#137333', fontWeight: 'bold' }}>
                <span>Coupon ({appliedCoupon.code})</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="checkout-summary-row"><span>Delivery</span><span className="free-tag">FREE</span></div>
            <div className="checkout-summary-row total"><span>Grand Total</span><b>₹{grandTotal}</b></div>
          </div>

          <div className="checkout-address-summary">
            <h3><FaMapLocationDot /> Delivering to</h3>
            <p><strong>{address.name}</strong> · {address.phone}</p>
            <p className="addr-email">{address.email}</p>
            <p>{address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state === 'Other' ? address.customState : address.state} — {address.pincode}</p>
          </div>

          <div className="checkout-nav">
            <button className="ghost checkout-back" onClick={() => setStep(2)} type="button" disabled={checkingOut}>← Back</button>
            <button 
              className="primary checkout-cta" 
              type="button"
              disabled={checkingOut}
              onClick={handleCheckoutPayment}
            >
              <FaCreditCard /> {checkingOut ? 'Creating Order...' : `Pay ₹${grandTotal} Securely`}
            </button>
          </div>
          <p className="checkout-secure-note">Secured payment · UPI · Cards · NetBanking</p>
        </div>
      )}
    </section>
  )
}

export default Checkout
