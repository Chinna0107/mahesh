import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaBars, FaHouse, FaRightFromBracket, FaUser, FaFolderOpen, FaArrowLeft } from 'react-icons/fa6'
import logo from '../assets/logo.png'
import './AdminHeader.css'

function AdminHeader({ user, setSignedIn }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleSignOut = () => {
    localStorage.removeItem('mahesh_token')
    setSignedIn(false)
    navigate('/')
  }

  const adminNavItems = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Products', to: '/admin/products' },
    { label: 'Orders', to: '/admin/orders' },
    { label: 'Customers', to: '/admin/customers' },
    { label: 'Reports', to: '/admin/reports' }
  ]

  return (
    <>
      <header className={`admin-site-header${scrolled ? ' scrolled' : ''}`}>
        <button className="menu-btn" onClick={() => setMenuOpen(true)} type="button" aria-label="Open menu">
          <FaBars />
        </button>

        <Link className="brand" to="/admin">
          <img src={logo} alt="Mahesh" />
          <strong>Mahesh Admin</strong>
        </Link>

        {/* Admin Navigation */}
        <nav className={menuOpen ? 'open' : ''} aria-label="Admin navigation">
          <div className="drawer-header">
            <h3>Admin Portal</h3>
          </div>

          <div className="drawer-links">
            {adminNavItems.map((item) => (
              <NavLink
                className={({ isActive }) => isActive ? 'active' : ''}
                key={item.label}
                to={item.to}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="drawer-footer">
            <Link to="/" className="view-shop-btn" onClick={() => setMenuOpen(false)}>
              <FaArrowLeft /> View Storefront
            </Link>
          </div>
        </nav>

        {menuOpen && <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />}

        <div className="header-actions">
          <Link to="/" className="icon-btn store-view-action" aria-label="View Storefront">
            <FaArrowLeft />
            <span>Storefront</span>
          </Link>
          
          <div className="profile-menu">
            <button className="avatar admin-avatar" type="button">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </button>
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <p className="user-name">{user?.name || 'Administrator'}</p>
                <p className="user-role">Store Admin</p>
              </div>
              <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}><FaHouse /> Dashboard</Link>
              <Link to="/admin/products" onClick={() => setMenuOpen(false)}><FaFolderOpen /> Products</Link>
              <Link to="/" onClick={() => setMenuOpen(false)}><FaArrowLeft /> View Storefront</Link>
              <button onClick={handleSignOut} type="button" className="signout-btn"><FaRightFromBracket /> Sign Out</button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default AdminHeader
