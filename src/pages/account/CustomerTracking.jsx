import { useState } from 'react'
import { api } from '../../api'
import '../Account.css'

function CustomerTracking() {
  const [refNum, setRefNum] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  const handleTrace = async (e) => {
    e.preventDefault()
    if (!refNum.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)
    setSearched(true)

    try {
      // Fetch all customer orders and find the matching reference ID
      const orders = await api.orders.getMyOrders()
      const found = orders.find(o => o.id.toLowerCase() === refNum.trim().toLowerCase())
      
      if (!found) {
        throw new Error(`Order reference ${refNum} not found in your account history.`)
      }
      
      setOrder(found)
    } catch (err) {
      setError(err.message || 'Error tracing order status.')
    } finally {
      setLoading(false)
    }
  }

  // Get timeline step status (completed, active, upcoming)
  const getStepClass = (stepName) => {
    if (!order) return 'upcoming'
    const status = order.status.toLowerCase()
    
    if (stepName === 'confirmed') {
      return ['confirmed', 'packing', 'out for delivery', 'delivered'].includes(status) ? 'completed' : 'active'
    }
    if (stepName === 'packing') {
      if (['packing', 'out for delivery', 'delivered'].includes(status)) return 'completed'
      if (status === 'confirmed') return 'active'
      return 'upcoming'
    }
    if (stepName === 'transit') {
      if (['out for delivery', 'delivered'].includes(status)) return 'completed'
      if (status === 'packing') return 'active'
      return 'upcoming'
    }
    if (stepName === 'delivered') {
      if (status === 'delivered') return 'completed'
      if (status === 'out for delivery') return 'active'
      return 'upcoming'
    }
    return 'upcoming'
  }

  return (
    <div className="admin-card" style={{ padding: '24px' }}>
      <h3 style={{ margin: '0 0 18px', color: '#17351f', fontSize: '1.4rem' }}>Live Delivery Status</h3>
      
      <form onSubmit={handleTrace} style={{ display: 'grid', gap: '16px', maxWidth: '540px' }}>
        <label style={{ display: 'grid', gap: '6px', fontWeight: '800', color: '#364a38' }}>
          Enter Order Reference Number
          <input 
            placeholder="e.g. ME17812937" 
            value={refNum}
            onChange={(e) => setRefNum(e.target.value)}
            required 
            style={{ padding: '12px', border: '1px solid #ccdcc2', borderRadius: '16px', fontSize: '1rem', background: '#fbfff8' }}
          />
        </label>
        
        <button className="primary" style={{ justifySelf: 'start' }} type="submit" disabled={loading}>
          {loading ? 'Tracing Order...' : 'Trace Order'}
        </button>
      </form>

      {searched && !loading && error && (
        <div style={{ marginTop: '20px', color: '#ea4335', fontWeight: 'bold' }}>
          {error}
        </div>
      )}

      {searched && !loading && order && (
        <div style={{ marginTop: '24px', display: 'grid', gap: '20px', maxWidth: '540px' }}>
          <div style={{ padding: '16px', background: '#fbfff8', border: '1px solid #ccdcc2', borderRadius: '16px' }}>
            <p style={{ margin: '0 0 6px', fontSize: '0.9rem', color: '#6d8471' }}>Order Reference: <strong>#{order.id}</strong></p>
            <p style={{ margin: '0 0 6px', fontSize: '0.9rem', color: '#6d8471' }}>Current Status: <span style={{ fontWeight: 'bold', color: '#17351f', textTransform: 'capitalize' }}>{order.status}</span></p>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#6d8471' }}>Total Amount: <strong>₹{order.total}</strong></p>
          </div>

          <div className="tracking-timeline">
            <div className={`timeline-step ${getStepClass('confirmed')}`}>
              <strong>Order Placed & Confirmed</strong>
              <span>Verified and registered at Mahesh Farm Hub</span>
            </div>
            
            <div className={`timeline-step ${getStepClass('packing')}`}>
              <strong>Packing at Farm Hub</strong>
              <span>Handpicked, quality-tested and packed hygienically</span>
            </div>
            
            <div className={`timeline-step ${getStepClass('transit')}`}>
              <strong>Out For Delivery (In Transit)</strong>
              <span>Chilled container vehicle headed to your neighborhood</span>
            </div>

            <div className={`timeline-step ${getStepClass('delivered')}`}>
              <strong>Delivered</strong>
              <span>Received fresh and cold at your doorstep</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerTracking
