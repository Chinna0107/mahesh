import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiHome, 
  HiOutlineHome,
  HiShoppingBag, 
  HiOutlineShoppingBag,
  HiHeart, 
  HiOutlineHeart,
  HiShoppingCart, 
  HiOutlineShoppingCart,
  HiUser, 
  HiOutlineUser,
  HiXMark,
  HiChevronRight
} from 'react-icons/hi2'
import { 
  RiListSettingsLine, 
  RiInformationLine, 
  RiCustomerService2Line, 
  RiQuestionnaireLine,
  RiFileList3Line,
  RiMapPinRangeLine,
  RiUserSettingsLine,
  RiLogoutBoxRLine
} from 'react-icons/ri'
import './MobileBottomNav.css'

function MobileBottomNav({ cartCount, wishlistCount, signedIn, setSignedIn, user }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleSignOut = () => {
    localStorage.removeItem('mahesh_token')
    if (setSignedIn) setSignedIn(false)
    setMenuOpen(false)
    navigate('/')
  }

  const navItems = [
    { path: '/', label: 'Home', icon: HiOutlineHome, activeIcon: HiHome },
    { path: '/products', label: 'Shop', icon: HiOutlineShoppingBag, activeIcon: HiShoppingBag },
    { path: '/wishlist', label: 'Wishlist', icon: HiOutlineHeart, activeIcon: HiHeart, badge: wishlistCount },
    { path: '/cart', label: 'Cart', icon: HiOutlineShoppingCart, activeIcon: HiShoppingCart, badge: cartCount, badgeColor: 'gold' },
  ]

  return (
    <>
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')} 
            end={item.path === '/'}
          >
            {({ isActive }) => (
              <>
                <div className="icon-wrapper">
                  {isActive ? <item.activeIcon /> : <item.icon />}
                  {item.badge > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`nav-badge ${item.badgeColor || ''}`}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                  {isActive && <motion.div layoutId="nav-indicator" className="nav-indicator" />}
                </div>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
        
        <button 
          className={`nav-item ${menuOpen ? 'active' : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)} 
          type="button"
        >
          <div className="icon-wrapper">
            {menuOpen ? <HiUser /> : <HiOutlineUser />}
            {menuOpen && <motion.div layoutId="nav-indicator" className="nav-indicator" />}
          </div>
          <span>Account</span>
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div 
              className="menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div 
              className="mobile-bottom-menu"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="menu-handle" />
              <div className="mobile-menu-header">
                <h3>My Account</h3>
                <button className="close-menu-btn" onClick={() => setMenuOpen(false)} type="button">
                  <HiXMark />
                </button>
              </div>
              
              {signedIn && user && (
                <div className="mobile-menu-user">
                  <div className="avatar">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
                  <div className="user-text">
                    <p className="welcome">Welcome back,</p>
                    <p className="name">{user.name}</p>
                  </div>
                </div>
              )}

              <div className="mobile-menu-links-list">
                {!signedIn && (
                  <Link to="/signin" className="menu-link highlight">
                    <HiUser /> 
                    <span>Sign In / Register</span>
                    <HiChevronRight className="arrow" />
                  </Link>
                )}

                <Link to="/services" className="menu-link"><RiListSettingsLine /> <span>Categories</span> <HiChevronRight className="arrow" /></Link>
                <Link to="/about" className="menu-link"><RiInformationLine /> <span>About Us</span> <HiChevronRight className="arrow" /></Link>
                <Link to="/contact" className="menu-link"><RiCustomerService2Line /> <span>Contact Support</span> <HiChevronRight className="arrow" /></Link>
                <Link to="/faq" className="menu-link"><RiQuestionnaireLine /> <span>FAQs</span> <HiChevronRight className="arrow" /></Link>
                
                {signedIn && (
                  <>
                    <div className="menu-divider"><span>Orders & Activity</span></div>
                    <Link to="/account/my-orders" className="menu-link"><RiFileList3Line /> <span>My Orders</span> <HiChevronRight className="arrow" /></Link>
                    <Link to="/account/tracking" className="menu-link"><RiMapPinRangeLine /> <span>Order Tracking</span> <HiChevronRight className="arrow" /></Link>
                    <Link to="/account/profile" className="menu-link"><RiUserSettingsLine /> <span>Profile Settings</span> <HiChevronRight className="arrow" /></Link>
                    
                    <button onClick={handleSignOut} className="menu-link signout-btn" type="button">
                      <RiLogoutBoxRLine /> <span>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileBottomNav
