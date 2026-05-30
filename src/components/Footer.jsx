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
        <Link to="#">Privacy Policy</Link>
        <Link to="#">Refund Policy</Link>
        <Link to="#">Shipping Policy</Link>
        <Link to="#">Terms & Conditions</Link>
      </div>
      <div className="footer-links-col">
        <b>Contact</b>
        <p><FaEnvelope /> info@mahesh.in</p>
        <p><FaPhone /> +91 7416750834</p>
        <p><FaLocationDot /> Hyderabad, Telangana</p>
      </div>
      <div className="footer-bottom">Freshness delivered daily. Built for future backend integration.</div>
    </footer>
  )
}

export default Footer
