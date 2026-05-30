import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { FaUser, FaBoxOpen, FaLocationArrow, FaHeadset } from 'react-icons/fa6'
import '../Account.css'

function AccountLayout() {
  const location = useLocation()
  const pathParts = location.pathname.split('/')
  const page = pathParts[pathParts.length - 1] === 'account' ? 'profile' : pathParts[pathParts.length - 1]
  const title = page.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ')

  return (
    <section className="account-page-layout">
      <aside className="account-sidebar">
        <h2>Dashboard</h2>
        {[
          { key: 'profile', label: 'Profile', to: '/account/profile', icon: <FaUser /> },
          { key: 'my-orders', label: 'My Orders', to: '/account/my-orders', icon: <FaBoxOpen /> },
          { key: 'tracking', label: 'Tracking', to: '/account/tracking', icon: <FaLocationArrow /> },
          { key: 'support', label: 'Support', to: '/account/support', icon: <FaHeadset /> },
        ].map((item) => (
          <NavLink
            className={({ isActive }) => isActive ? 'active' : ''}
            to={item.to}
            key={item.key}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </aside>

      <div className="account-content">
        <div className="page-hero compact" style={{ padding: '0 0 20px', marginBottom: '10px', borderBottom: '1px solid #dce8d1' }}>
          <p className="eyebrow">Customer Area</p>
          <h1 style={{ margin: '8px 0 12px' }}>{title}</h1>
          <p>Manage your account settings, monitor subscriptions, trace orders, or connect with our support team.</p>
        </div>
        <Outlet />
      </div>
    </section>
  )
}

export default AccountLayout
