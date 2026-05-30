import { useState, useEffect } from 'react'
import { 
  FaMagnifyingGlass, 
  FaUser, 
  FaCalendarDays, 
  FaEnvelope, 
  FaPhone, 
  FaLocationDot,
  FaBagShopping,
  FaTriangleExclamation
} from 'react-icons/fa6'
import { api } from '../../api'
import '../../pages/Admin.css'

function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.auth.getCustomers()
      .then((res) => {
        setCustomers(res)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch database customers.')
        setLoading(false)
      })
  }, [])

  const filteredCustomers = customers.filter(c => {
    const term = search.toLowerCase()
    return (
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.phone && c.phone.includes(term)) ||
      (c.address && c.address.toLowerCase().includes(term))
    )
  })

  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="admin-layout-card" style={{ padding: '32px', color: '#17351f', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '20px auto', border: '4px solid #ccdcc2', borderTop: '4px solid #364a38', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite' }}></div>
        <p>Loading customer summaries...</p>
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
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ borderBottom: 'none', paddingBottom: 0, margin: 0 }}>
          <span>Registered Customers</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '8px' }}>({customers.length} total)</span>
        </h2>
      </div>

      {/* Filter Row */}
      <div className="product-filters-row">
        <div className="search-input-wrapper">
          <FaMagnifyingGlass />
          <input 
            type="text" 
            placeholder="Search customers by name, email, phone or address..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {/* Card Grid Layout */}
      {filteredCustomers.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>No registered customers found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '16px' }}>
          {filteredCustomers.map((customer) => {
            const joinedDate = new Date(customer.created_at || Date.now()).toLocaleDateString('en-IN')
            
            return (
              <div 
                className="admin-stat-card" 
                key={customer.id} 
                style={{ flexDirection: 'column', gap: '14px', alignItems: 'stretch' }}
              >
                {/* Profile Circle Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px', 
                    height: '42px', 
                    borderRadius: '50%', 
                    background: 'var(--bg-green-soft)', 
                    color: 'var(--primary-green)',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-focus)',
                    fontSize: '14px'
                  }}>
                    {getInitials(customer.name)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15.5px', color: 'var(--primary-green-dark)', fontFamily: 'var(--font-sans)', fontWeight: '700' }}>
                      {customer.name || 'Anonymous User'}
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <FaCalendarDays style={{ fontSize: '10px' }} /> Joined: {joinedDate}
                    </span>
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px', color: 'var(--text-dark)', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <FaEnvelope style={{ color: 'var(--text-muted)' }} /> {customer.email || 'No email registered'}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <FaPhone style={{ color: 'var(--text-muted)' }} /> {customer.phone || 'No phone registered'}
                  </span>
                  {customer.address && (
                    <span style={{ display: 'inline-flex', alignItems: 'start', gap: '8px' }}>
                      <FaLocationDot style={{ color: 'var(--text-muted)', marginTop: '3px', flexShrink: 0 }} /> 
                      <span style={{ lineHeight: '1.3' }}>{customer.address}</span>
                    </span>
                  )}
                </div>

                {/* Total Stats indicators */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '8px', 
                  background: 'var(--bg-cream-dark)', 
                  padding: '10px', 
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  marginTop: 'auto'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Spent Total</span>
                    <span style={{ fontWeight: '800', color: 'var(--accent-gold-dark)', fontSize: '14.5px', fontFamily: 'var(--font-serif)', marginTop: '2px' }}>
                      ₹{customer.spent ? customer.spent.toLocaleString('en-IN') : 0}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>Orders Count</span>
                    <span style={{ fontWeight: '800', color: 'var(--primary-green)', fontSize: '14.5px', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaBagShopping style={{ fontSize: '11px' }} /> {customer.orders || 0}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AdminCustomers
