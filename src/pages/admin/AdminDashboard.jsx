import { useState, useEffect } from 'react'
import { 
  FaBagShopping, 
  FaChartLine, 
  FaClock, 
  FaUsers, 
  FaBoxOpen,
  FaWhatsapp,
  FaArrowRight
} from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import '../../pages/Admin.css'

function AdminDashboard({ products = [], redirectInquiry }) {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, customers: 0, products: products.length })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const statsData = await api.auth.getStats()
        setStats(statsData)
        
        const ordersData = await api.orders.getAllOrders()
        setOrders(ordersData)
      } catch (err) {
        console.error('❌ Failed to load admin dashboard data:', err.message)
      } finally {
        setLoading(false)
      }
    }
    
    loadDashboardData()
  }, [products.length])

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

  const notify = (order) => {
    const itemsText = formatItemsList(order.items)
    redirectInquiry(`Hi ${order.customer_name}, your Mahesh order #${order.id} is currently *${order.status}*. Items: ${itemsText}. Total: ₹${order.total}`)
  }

  if (loading) {
    return (
      <div className="admin-layout-card" style={{ padding: '32px', color: '#17351f', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '20px auto', border: '4px solid #ccdcc2', borderTop: '4px solid #364a38', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></div>
        <p>Loading Admin Dashboard metrics...</p>
      </div>
    )
  }

  // Calculate pending orders (not delivered and not cancelled)
  const pendingOrdersCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length
  const recentOrders = orders.slice(0, 5)

  const cards = [
    { label: 'Total Orders', value: stats.orders, icon: <FaBagShopping />, class: 'green' },
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: <FaChartLine />, class: 'blue' },
    { label: 'Pending Orders', value: pendingOrdersCount, icon: <FaClock />, class: 'orange' },
    { label: 'Registered Customers', value: stats.customers, icon: <FaUsers />, class: 'purple' },
    { label: 'Active Products', value: stats.products, icon: <FaBoxOpen />, class: 'yellow' }
  ]

  return (
    <>
      <div className="admin-page-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back! Here is a summary of your farm fresh store activities.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="admin-stats-grid">
        {cards.map((card, i) => (
          <div className="admin-stat-card" key={i}>
            <div className={`admin-stat-icon-wrapper ${card.class}`}>
              {card.icon}
            </div>
            <div>
              <div className="admin-stat-value">{card.value}</div>
              <div className="admin-stat-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Log Card */}
      <div className="admin-layout-card">
        <h2>
          <span>Recent Orders</span>
          <Link to="/admin/orders" className="admin-btn secondary small" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            View All <FaArrowRight style={{ fontSize: '11px' }} />
          </Link>
        </h2>

        {recentOrders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>No recent orders found.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items Details</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 'bold', color: 'var(--primary-green-dark)' }}>#{order.id}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{order.customer_name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.customer_email || 'Guest User'}</div>
                    </td>
                    <td style={{ maxWidth: '220px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {formatItemsList(order.items)}
                    </td>
                    <td style={{ fontWeight: 'bold', color: 'var(--accent-gold-dark)', fontFamily: 'var(--font-serif)' }}>
                      ₹{order.total}
                    </td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="admin-btn whatsapp small" 
                        onClick={() => notify(order)}
                        type="button"
                      >
                        <FaWhatsapp /> Notify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminDashboard
