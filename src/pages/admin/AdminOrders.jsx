import { useState, useEffect } from 'react'
import { 
  FaChevronDown, 
  FaPrint, 
  FaWhatsapp, 
  FaTriangleExclamation,
  FaReceipt
} from 'react-icons/fa6'
import { api } from '../../api'
import '../../pages/Admin.css'

const STATUSES = ['pending', 'confirmed', 'packing', 'out for delivery', 'delivered', 'cancelled']

function AdminOrders({ redirectInquiry }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedOrderId, setExpandedOrderId] = useState(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    api.orders.getAllOrders()
      .then((res) => {
        setOrders(res)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch database orders.')
        setLoading(false)
      })
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await api.orders.updateStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updated.status } : o))
    } catch (err) {
      alert(`Failed to update status: ${err.message}`)
    }
  }

  const getParsedItems = (items) => {
    try {
      return typeof items === 'string' ? JSON.parse(items) : items
    } catch {
      return []
    }
  }

  const getParsedAddress = (address) => {
    try {
      return typeof address === 'string' ? JSON.parse(address) : address
    } catch {
      return address || {}
    }
  }

  const formatItemsList = (items) => {
    const parsed = getParsedItems(items)
    if (Array.isArray(parsed)) {
      return parsed.map(item => `${item.name} (x${item.qty})`).join(', ')
    }
    return 'No items'
  }

  const toggleAccordion = (orderId) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId)
  }

  const notify = (order) => {
    const addr = getParsedAddress(order.address)
    const itemsText = formatItemsList(order.items)
    redirectInquiry(`Hi ${addr.name || order.customer_name || 'Customer'}, your Mahesh order #${order.id} status is now *${order.status.toUpperCase()}*. Items: ${itemsText}. Total: ₹${order.total}. Thank you! 🌱`)
  }

  const printLabel = (order) => {
    const addr = getParsedAddress(order.address)
    const items = getParsedItems(order.items)
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-family: sans-serif;">${item.name} (${item.unit})</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center; font-family: sans-serif;">${item.qty}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; font-family: sans-serif;">₹${item.price}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; font-family: sans-serif; font-weight: bold;">₹${item.price * item.qty}</td>
      </tr>
    `).join('')

    const printWindow = window.open('', '_blank', 'width=700,height=750')
    printWindow.document.write(`
      <html>
        <head>
          <title>Shipping Label & Invoice - Order #${order.id}</title>
          <style>
            body { font-family: 'Outfit', sans-serif; padding: 30px; color: #222; }
            .label-card { border: 2px dashed #1c4e25; padding: 25px; max-width: 600px; margin: 0 auto; border-radius: 12px; }
            .header { text-align: center; border-bottom: 2px solid #1c4e25; padding-bottom: 15px; margin-bottom: 20px; }
            .header h2 { margin: 0; color: #1c4e25; font-family: Georgia, serif; font-size: 24px; }
            .header p { margin: 4px 0 0; color: #5e6f60; font-size: 12px; font-weight: bold; letter-spacing: 1px; }
            .header h3 { margin: 12px 0 0; font-size: 18px; color: #c38426; }
            .address-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; font-size: 13.5px; line-height: 1.5; }
            .address-title { font-weight: bold; color: #1c4e25; margin-bottom: 6px; display: block; border-bottom: 1px solid #e1e9dc; padding-bottom: 2px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
            .total-row { display: flex; justify-content: flex-end; gap: 10px; font-size: 16px; font-weight: bold; color: #1c4e25; border-top: 2px solid #1c4e25; padding-top: 12px; }
            .secure-footer { text-align: center; margin-top: 25px; font-size: 11px; color: #5e6f60; border-top: 1px solid #e1e9dc; padding-top: 10px; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="label-card">
            <div class="header">
              <h2>Mahesh Farm Fresh</h2>
              <p>PREMIUM STAPLES DIRECT TO HOME</p>
              <h3>SHIPPING LABEL & INVOICE #${order.id}</h3>
            </div>
            <div class="address-section">
              <div>
                <span class="address-title">FROM (SELLER)</span>
                <strong>Mahesh Farm Fresh</strong><br/>
                Road No 4, Jubilee Hills<br/>
                Hyderabad, Telangana - 500033<br/>
                Phone: +91 98765 43210
              </div>
              <div>
                <span class="address-title">TO (CUSTOMER)</span>
                <strong>${addr.name || order.customer_name || 'Customer'}</strong><br/>
                ${addr.line1 || ''}<br/>
                ${addr.line2 ? addr.line2 + '<br/>' : ''}
                ${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}<br/>
                Phone: ${addr.phone || order.customer_phone || 'N/A'}<br/>
                Email: ${addr.email || order.customer_email || 'N/A'}
              </div>
            </div>
            <table class="table">
              <thead>
                <tr style="background: #f0f5eb; color: #1c4e25;">
                  <th style="padding: 10px; text-align: left; font-family: sans-serif;">Item</th>
                  <th style="padding: 10px; text-align: center; font-family: sans-serif; width: 60px;">Qty</th>
                  <th style="padding: 10px; text-align: right; font-family: sans-serif; width: 100px;">Price</th>
                  <th style="padding: 10px; text-align: right; font-family: sans-serif; width: 120px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div class="total-row">
              <span>Grand Total:</span>
              <span style="color: #c38426; font-size: 18px;">₹${order.total}</span>
            </div>
            <div class="secure-footer">
              Thank you for supporting organic local agriculture! Team Mahesh.
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  if (loading) {
    return (
      <div className="admin-layout-card" style={{ padding: '32px', color: '#17351f', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '20px auto', border: '4px solid #ccdcc2', borderTop: '4px solid #364a38', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></div>
        <p>Loading database orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-layout-card" style={{ padding: '24px', color: '#ea4335', textAlign: 'center' }}>
        <FaTriangleExclamation style={{ fontSize: '32px', marginBottom: '12px' }} />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="admin-layout-card">
      <div className="admin-page-header" style={{ marginBottom: '16px' }}>
        <h2 style={{ borderBottom: 'none', paddingBottom: 0, margin: 0 }}>
          <span>Manage Orders</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>({orders.length} total orders)</span>
        </h2>
      </div>
      
      {orders.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>No customer orders found in the database.</p>
      ) : (
        <div style={{ display: 'grid', gap: '8px' }}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id
            const addr = getParsedAddress(order.address)
            const items = getParsedItems(order.items)
            
            return (
              <div 
                className={`order-accordion-item${isExpanded ? ' expanded' : ''}`} 
                key={order.id}
              >
                {/* Header Row */}
                <div 
                  className="order-accordion-header" 
                  onClick={() => toggleAccordion(order.id)}
                >
                  <div className="order-header-main">
                    <span className="order-header-title">#{order.id}</span>
                    <span className="order-header-meta">
                      {new Date(order.created_at || Date.now()).toLocaleDateString('en-IN')}
                    </span>
                    <span style={{ fontWeight: '600', fontSize: '13.5px', color: 'var(--text-dark)' }}>
                      {addr.name || order.customer_name}
                    </span>
                    <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-header-right">
                    <span className="order-header-total">₹{order.total}</span>
                    <FaChevronDown className="order-chevron" />
                  </div>
                </div>

                {/* Expanded Body Details */}
                {isExpanded && (
                  <div className="order-accordion-body">
                    {/* From & To Addresses */}
                    <div className="address-panels-grid">
                      <div className="address-panel">
                        <div className="address-panel-title">From (Seller)</div>
                        <p className="name">Mahesh Farm Fresh</p>
                        <p>Road No 4, Jubilee Hills</p>
                        <p>Hyderabad, Telangana - 500033</p>
                        <p>Phone: +91 98765 43210</p>
                      </div>
                      
                      <div className="address-panel">
                        <div className="address-panel-title">To (Customer Delivery)</div>
                        <p className="name">{addr.name || order.customer_name || 'Customer'}</p>
                        <p>{addr.line1 || ''}</p>
                        {addr.line2 && <p>{addr.line2}</p>}
                        <p>{addr.city || ''}, {addr.state || ''} — {addr.pincode || ''}</p>
                        <p>Phone: {addr.phone || order.customer_phone || 'N/A'}</p>
                        {addr.email && <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Email: {addr.email}</p>}
                      </div>
                    </div>

                    {/* Order Items Breakdown */}
                    <div className="order-items-summary">
                      <div className="address-panel-title">Order Items Details</div>
                      {items.map((item, idx) => (
                        <div className="order-item-row" key={idx}>
                          <span>{item.name} ({item.unit}) × {item.qty}</span>
                          <span style={{ fontWeight: '600' }}>₹{item.price * item.qty}</span>
                        </div>
                      ))}
                      
                      <div className="order-summary-total">
                        <span>Grand Total</span>
                        <b>₹{order.total}</b>
                      </div>
                    </div>

                    {/* Status Update & Actions */}
                    <div className="order-status-update-row">
                      <div className="order-select-wrapper">
                        <label>Update Order Status</label>
                        <select 
                          value={order.status} 
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="order-status-select"
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Info for tracking id if present */}
                      {order.razorpay_payment_id && (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 'bold' }}>Razorpay Info:</span>
                          <span>Order: {order.razorpay_order_id || 'N/A'}</span>
                          <span>Payment: {order.razorpay_payment_id || 'N/A'}</span>
                        </div>
                      )}
                    </div>

                    <div className="order-actions-container">
                      <button 
                        className="admin-btn secondary" 
                        onClick={() => printLabel(order)}
                        type="button"
                      >
                        <FaPrint /> Print Invoice & Label
                      </button>
                      <button 
                        className="admin-btn whatsapp" 
                        onClick={() => notify(order)}
                        type="button"
                      >
                        <FaWhatsapp /> WhatsApp Status Update
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminOrders
