import { useState, useEffect } from 'react'
import { 
  FaBagShopping, 
  FaArrowTrendUp, 
  FaBoxOpen, 
  FaClock, 
  FaTriangleExclamation,
  FaCalendarDays
} from 'react-icons/fa6'
import { api } from '../../api'
import '../../pages/Admin.css'

function isWithinPeriod(dateStr, period) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  if (period === 'daily') {
    return date.toDateString() === now.toDateString()
  } else if (period === 'weekly') {
    return diffDays <= 7
  } else {
    // Monthly (last 30 days)
    return diffDays <= 30
  }
}

function AdminReports() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState('weekly') // 'daily' | 'weekly' | 'monthly'

  useEffect(() => {
    api.orders.getAllOrders()
      .then((res) => {
        setOrders(res)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch database orders.')
        setLoading(false)
      })
  }, [])

  const getParsedItems = (items) => {
    try {
      return typeof items === 'string' ? JSON.parse(items) : items
    } catch {
      return []
    }
  }

  // Filter orders by period
  const filteredOrders = orders.filter(o => isWithinPeriod(o.created_at, period))

  // Calculations
  const revenue = filteredOrders
    .filter(o => o.status !== 'cancelled' && o.status !== 'failed')
    .reduce((sum, o) => sum + Number(o.total), 0)

  const deliveredCount = filteredOrders.filter(o => o.status === 'delivered').length
  const cancelledCount = filteredOrders.filter(o => o.status === 'cancelled').length
  const averageOrderVal = filteredOrders.length > 0 ? Math.round(revenue / filteredOrders.length) : 0

  // Top products compilation
  const productMap = {}
  filteredOrders
    .filter(o => o.status !== 'cancelled' && o.status !== 'failed')
    .forEach((o) => {
      const items = getParsedItems(o.items)
      items.forEach((item) => {
        if (!productMap[item.name]) {
          productMap[item.name] = { name: item.name, qty: 0, revenue: 0 }
        }
        productMap[item.name].qty += Number(item.qty || 1)
        productMap[item.name].revenue += Number(item.price || 0) * Number(item.qty || 1)
      })
    })

  const topProducts = Object.values(productMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Chart daily breakdown (last 7 or 30 days)
  const daysCount = period === 'daily' ? 1 : period === 'weekly' ? 7 : 30
  const dailyBreakdown = Array.from({ length: daysCount }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (daysCount - 1 - i))
    
    const dayOrders = orders.filter((o) => {
      const od = new Date(o.created_at)
      return od.toDateString() === d.toDateString() && o.status !== 'cancelled' && o.status !== 'failed'
    })
    
    const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    const dayRevenue = dayOrders.reduce((sum, o) => sum + Number(o.total), 0)
    
    return { label, revenue: dayRevenue }
  })

  const maxRevenue = Math.max(...dailyBreakdown.map(d => d.revenue), 1)

  const stats = [
    { label: 'Orders placed', value: filteredOrders.length, icon: <FaBagShopping />, class: 'green' },
    { label: 'Revenue Sum', value: `₹${revenue.toLocaleString('en-IN')}`, icon: <FaArrowTrendUp />, class: 'blue' },
    { label: 'Delivered', value: deliveredCount, icon: <FaBoxOpen />, class: 'purple' },
    { label: 'Avg Order Value', value: `₹${averageOrderVal}`, icon: <FaCalendarDays />, class: 'yellow' },
    { label: 'Cancelled', value: cancelledCount, icon: <FaClock />, class: 'orange' }
  ]

  if (loading) {
    return (
      <div className="admin-layout-card" style={{ padding: '32px', color: '#17351f', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '20px auto', border: '4px solid #ccdcc2', borderTop: '4px solid #364a38', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></div>
        <p>Loading database reports...</p>
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
    <>
      {/* Title & Period Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div className="admin-page-header">
          <h1>Reports & Analytics</h1>
          <p>Analyze sales metrics, top selling staples, and revenues.</p>
        </div>
        <div className="reports-period-selector">
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button 
              key={p} 
              onClick={() => setPeriod(p)}
              className={`reports-period-btn${period === p ? ' active' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="admin-stats-grid">
        {stats.map((s, i) => (
          <div className="admin-stat-card" key={i}>
            <div className={`admin-stat-icon-wrapper ${s.class}`}>
              {s.icon}
            </div>
            <div>
              <div className="admin-stat-value" style={{ fontSize: '20px' }}>{s.value}</div>
              <div className="admin-stat-label" style={{ fontSize: '10px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Split Graph / Top selling */}
      <div className="reports-grid">
        
        {/* CSS Chart Card */}
        <div className="admin-layout-card">
          <h2>Revenue Graph (₹)</h2>
          <div className="css-bar-chart">
            {dailyBreakdown.map((day, idx) => {
              const fillPct = (day.revenue / maxRevenue) * 100
              
              // Only render label details on hover/bar if dailyBreakdown has space
              const shouldShowVal = period !== 'monthly' || day.revenue > 0
              
              return (
                <div className="css-chart-bar-col" key={idx}>
                  <span className="css-chart-bar-value">
                    {shouldShowVal && day.revenue > 0 ? `₹${Math.round(day.revenue)}` : ''}
                  </span>
                  <div 
                    className="css-chart-bar-fill"
                    style={{ height: `${Math.max(fillPct * 1.5, 4)}px` }}
                    title={`${day.label}: ₹${day.revenue}`}
                  />
                  <span className="css-chart-bar-label">
                    {period === 'monthly' ? (day.revenue > 0 ? day.label : '') : day.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Staples List */}
        <div className="admin-layout-card">
          <h2>Top Selling Staples</h2>
          {topProducts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>No product sales recorded in this period.</p>
          ) : (
            <div className="progress-list">
              {topProducts.map((p, idx) => {
                const maxProdRev = topProducts[0]?.revenue || 1
                const fillWidth = (p.revenue / maxProdRev) * 100
                
                return (
                  <div className="progress-list-item" key={idx}>
                    <div className="progress-item-index">{idx + 1}</div>
                    <div className="progress-item-content">
                      <div className="progress-item-title">{p.name}</div>
                      <div className="progress-bar-track">
                        <div 
                          className="progress-bar-fill"
                          style={{ width: `${fillWidth}%` }}
                        />
                      </div>
                    </div>
                    <div className="progress-item-value">
                      <div className="progress-value-main">₹{p.revenue}</div>
                      <div className="progress-value-sub">{p.qty} sold</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Orders during this period */}
      <div className="admin-layout-card">
        <h2>Orders in Selected Period ({filteredOrders.length})</h2>
        {filteredOrders.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No transactions recorded for this period.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 'bold', color: 'var(--primary-green-dark)' }}>#{o.id}</td>
                    <td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                    <td>{o.customer_name}</td>
                    <td style={{ fontWeight: 'bold', color: 'var(--accent-gold-dark)', fontFamily: 'var(--font-serif)' }}>
                      ₹{o.total}
                    </td>
                    <td>
                      <span className={`status-badge ${o.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {o.status}
                      </span>
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

export default AdminReports
