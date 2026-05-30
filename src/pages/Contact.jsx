import { FaEnvelope, FaLocationDot, FaPhone, FaWhatsapp } from 'react-icons/fa6'
import { InquiryForm } from '../components/Shared'
import './Contact.css'

function Contact({ redirectInquiry }) {
  return (
    <section className="contact-page premium-contact">
      <div className="contact-details">
        <p className="eyebrow">Get In Touch</p>
        <h1>Have questions about our products or delivery?</h1>
        <p>We're here to help you live a healthier, purer life.</p>
        <div className="contact-info-card">
          <h2>Contact Information</h2>
          <p><FaLocationDot /><b>Our Location</b><span>Plot No. 42, Farm House Colony, Hyderabad, Telangana</span></p>
          <p><FaPhone /><b>Phone Number</b><span>+91 7416750834</span></p>
          <p><FaEnvelope /><b>Email Address</b><span>info@mahesh.in</span></p>
        </div>
        <button className="whatsapp-large" onClick={() => redirectInquiry('Hi Mahesh, I want to chat about your products and delivery.')} type="button">
          <FaWhatsapp /> Chat on WhatsApp
        </button>
      </div>
      <div>
        <p className="eyebrow">Quick Connect</p>
        <InquiryForm redirectInquiry={redirectInquiry} title="Send us a Message" showEmail />
      </div>
    </section>
  )
}

export default Contact
