import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaBars, FaXmark, FaBoxOpen, FaCartShopping, FaHeadset, FaHouse, FaLocationArrow, FaRightFromBracket, FaUser, FaPhone, FaEnvelope, FaWhatsapp, FaInstagram, FaBagShopping, FaLeaf, FaTruck } from 'react-icons/fa6'
import logo from '../assets/logo.png'
import { navItems, whatsAppNumber } from '../data/storeData'
import './Header.css'

function Header({ signedIn, user, cartCount, setSignedIn }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleSignOut = () => {
    localStorage.removeItem('mahesh_token')
    setSignedIn(false)
    navigate('/')
  }

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} type="button" aria-label="Toggle menu">
          {menuOpen ? <FaXmark /> : <FaBars />}
        </button>

        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Mahesh" />
          <strong>Mahesh</strong>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-navigation" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) => isActive ? 'active' : ''}
              key={item}
              to={item === 'home' ? '/' : `/${item}`}
            >
              <span>{item === 'home' ? 'Home' : item.charAt(0).toUpperCase() + item.slice(1)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="icon-btn cart-action" to="/cart" onClick={() => setMenuOpen(false)} aria-label="Cart">
            <FaCartShopping />
            <span>Cart</span>
            {cartCount > 0 && <b>{cartCount}</b>}
          </Link>
          {signedIn ? (
            <div className="profile-menu">
              <button className="avatar" type="button">{user?.name?.charAt(0).toUpperCase() || 'U'}</button>
              <div className="profile-dropdown">
                <div className="profile-dropdown-header" style={{ padding: '8px 16px', borderBottom: '1px solid #ccdcc2', marginBottom: '8px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', color: '#17351f' }}>{user?.name || 'User'}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#6d8471' }}>{user?.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                </div>
                <Link to="/account/my-orders" onClick={() => setMenuOpen(false)}><FaBoxOpen /> My Orders</Link>
                <Link to="/account/tracking" onClick={() => setMenuOpen(false)}><FaLocationArrow /> Order Tracking</Link>
                <Link to="/account/profile" onClick={() => setMenuOpen(false)}><FaUser /> Profile</Link>
                <Link to="/account/support" onClick={() => setMenuOpen(false)}><FaHeadset /> Support</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}><FaHouse /> Admin Panel</Link>
                )}
                <button onClick={handleSignOut} type="button" style={{ borderTop: '1px solid #ccdcc2', width: '100%', borderRadius: 0, textAlign: 'left', marginTop: '8px' }}><FaRightFromBracket /> Sign Out</button>
              </div>
            </div>
          ) : (
            <Link className="signin-action" to="/signin" onClick={() => setMenuOpen(false)}>
              <FaUser />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Accordion Dropdown — slides down from header */}
      {menuOpen && (
        <div className="mobile-menu-dropdown">
          {signedIn && (
            <div className="menu-drawer-user-card">
              <div className="menu-drawer-user-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="menu-drawer-user-info">
                <span className="welcome-text">Welcome back,</span>
                <h4 className="user-name">{user?.name || 'Customer'}</h4>
                <div className="user-actions">
                  <Link to="/account/my-orders" onClick={() => setMenuOpen(false)}>My Orders</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="admin-badge">Admin Panel</Link>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mobile-menu-links">
            {navItems.map((item) => {
              const itemIcons = {
                home: <FaHouse style={{ marginRight: '12px' }} />,
                products: <FaBagShopping style={{ marginRight: '12px' }} />,
                services: <FaTruck style={{ marginRight: '12px' }} />,
                about: <FaLeaf style={{ marginRight: '12px' }} />,
                contact: <FaEnvelope style={{ marginRight: '12px' }} />
              }
              return (
                <NavLink
                  className={({ isActive }) => isActive ? 'active' : ''}
                  key={item}
                  to={item === 'home' ? '/' : `/${item}`}
                  onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {itemIcons[item]}
                  <span>{item === 'home' ? 'Home' : item.charAt(0).toUpperCase() + item.slice(1)}</span>
                </NavLink>
              )
            })}
          </div>

          <div className="mobile-menu-footer">
            <div className="menu-drawer-status-chip">
              <span className="pulse-dot"></span>
              <span>Open for deliveries: 6 AM - 9 PM</span>
            </div>
            <div className="menu-drawer-contact">
              <p><FaPhone /> <span>+91 7416750834</span></p>
              <p><FaEnvelope /> <span>info@mahesh.in</span></p>
            </div>
            <div className="menu-drawer-socials">
              <a href={`https://wa.me/${whatsAppNumber}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
