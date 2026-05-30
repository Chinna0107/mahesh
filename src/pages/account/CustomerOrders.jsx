import { useState, useEffect } from 'react'
import { api } from '../../api'
import '../Account.css'

function CustomerOrders() {
  const [ordersList, setOrdersList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('mahesh_token')
    if (!token) {
      setError('Please sign in to view your order history.')
      setLoading(false)
      return
    }

    api.orders.getMyOrders()
      .then((res) => {
        setOrdersList(res)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch order history.')
        setLoading(false)
      })
  }, [])

  const formatItemsList = (items) => {
    try {
      const parsed = typeof items === 'string' ? JSON.parse(items) : items
      if (Array.isArray(parsed)) {
        return parsed.map(item => `${item.name} (x${item.qty})`).join(', ')
      }
      return 'No items'
    } catch {
      return String(items)
    }
  }

  const formatOrderDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  if (loading) {
    return (
      <div className="admin-card" style={{ padding: '24px', color: '#17351f' }}>
        <p>Loading order history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-card" style={{ padding: '24px', color: '#ea4335' }}>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="admin-card" style={{ padding: '24px' }}>
      <h3 style={{ margin: '0 0 18px', color: '#17351f', fontSize: '1.4rem' }}>Order History</h3>
      
      {ordersList.length === 0 ? (
        <p style={{ color: '#6d8471' }}>You have not placed any orders yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '14px' }}>
          {ordersList.map((order) => (
            <div className="order-item" key={order.id}>
              <div className="order-item-info">
                <strong>Order #{order.id}</strong>
                <span style={{ fontSize: '0.85rem', color: '#6d8471', marginTop: '2px' }}>
                  Ordered on: {formatOrderDate(order.created_at)}
                </span>
                <span style={{ marginTop: '6px' }}>Items: {formatItemsList(order.items)}</span>
              </div>
              <b className="order-total-price">₹{order.total}</b>
              <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {order.status}
              </span>
              <button 
                className="ghost small" 
                onClick={() => alert(`Invoice receipt for order #${order.id} sent to email.`)} 
                type="button"
              >
                Invoice
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomerOrders
