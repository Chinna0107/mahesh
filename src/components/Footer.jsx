import { Link } from 'react-router-dom'
import { FaEnvelope, FaInstagram, FaLocationDot, FaPhone, FaWhatsapp } from 'react-icons/fa6'
import logo from '../assets/logo.png'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src={logo} alt="Mahesh" />
        <h2>Mahesh</h2>
        <p className="footer-desc-brighter">Pure milk, fresh vegetables, flowers, oils, groceries, and traditional food products delivered with premium care.</p>
        <div className="footer-socials">
          <button type="button" aria-label="WhatsApp"><FaWhatsapp /></button>
          <button type="button" aria-label="Instagram"><FaInstagram /></button>
          <button type="button" aria-label="Email"><FaEnvelope /></button>
        </div>
      </div>
      <div className="footer-links-col">
        <b>Quick Links</b>
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
      <div className="footer-links-col">
        <b>Shop</b>
        <Link to="/products">Products</Link>
        <Link to="/services">Services</Link>
        <Link to="/cart">Cart</Link>
      </div>
      <div className="footer-links-col">
        <b>Policies</b>
        <Link to="/policies/privacy">Privacy Policy</Link>
        <Link to="/policies/refund">Refund Policy</Link>
        <Link to="/policies/shipping">Shipping Policy</Link>
        <Link to="/policies/terms">Terms & Conditions</Link>
      </div>
      <div className="footer-links-col">
        <b>Contact</b>
        <p><FaEnvelope /> maheshbabun230@gmail.com</p>
        <p><FaPhone /> +91 7406136807</p>
        <p><FaLocationDot /> Hyderabad, Telangana</p>
      </div>
      <div className="footer-bottom">Freshness delivered daily. Built for future backend integration.</div>
    </footer>
  )
}

export default Footer
