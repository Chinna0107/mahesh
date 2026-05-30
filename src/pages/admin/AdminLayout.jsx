import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { 
  FaGauge, 
  FaBoxOpen, 
  FaReceipt, 
  FaUsers, 
  FaChartPie, 
  FaShieldHalved, 
  FaArrowRightFromBracket, 
  FaBars, 
  FaXmark,
  FaLeaf
} from 'react-icons/fa6'
import '../Admin.css'

function AdminLayout({ user }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('mahesh_token')
    navigate('/signin')
    window.location.reload()
  }

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', to: '/admin', icon: <FaGauge /> },
    { key: 'orders', label: 'Orders', to: '/admin/orders', icon: <FaReceipt /> },
    { key: 'customers', label: 'Customers', to: '/admin/customers', icon: <FaUsers /> },
    { key: 'products', label: 'Products', to: '/admin/products', icon: <FaBoxOpen /> },
    { key: 'reports', label: 'Reports', to: '/admin/reports', icon: <FaChartPie /> },
  ]

  const adminName = user?.name || 'Store Administrator'
  const adminEmail = user?.email || 'admin@mahesh.in'

  return (
    <>
      {/* Mobile Sticky Header */}
      <div className="admin-mobile-header">
        <div className="admin-mobile-logo">
          <span className="admin-logo-circle" style={{ width: '32px', height: '32px', fontSize: '1.1rem' }}><FaLeaf style={{ color: 'var(--primary-green)' }} /></span>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 'bold', color: 'var(--primary-green-dark)', fontSize: '16px' }}>Mahesh Admin</span>
        </div>
        <button className="admin-mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation menu">
          {mobileOpen ? <FaXmark /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`admin-mobile-overlay${mobileOpen ? ' mobile-open' : ''}`} 
        onClick={() => setMobileOpen(false)}
      />

      <section className="admin-shell">
        {/* Sidebar Navigation */}
        <aside className={`admin-sidebar${mobileOpen ? ' mobile-open' : ''}`}>
          <div className="admin-logo-section">
            <span className="admin-logo-circle"><FaLeaf style={{ color: 'var(--primary-green)' }} /></span>
            <div>
              <h2>Mahesh Admin</h2>
              <div className="admin-badge-container">
                <FaShieldHalved />
                <span>Administrator</span>
              </div>
            </div>
          </div>

          <div className="admin-profile-section">
            <span className="admin-profile-name">{adminName}</span>
            <span className="admin-profile-email">{adminEmail}</span>
          </div>

          <nav>
            {navItems.map((item) => (
              <NavLink
                className={({ isActive }) => isActive ? 'active' : ''}
                to={item.to}
                key={item.key}
                end={item.key === 'dashboard'}
                onClick={() => setMobileOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <button className="admin-logout-btn" onClick={handleLogout} type="button">
              <FaArrowRightFromBracket />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Nested Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </section>
    </>
  )
}

export default AdminLayout
