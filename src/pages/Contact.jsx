import { FaClock, FaEnvelope, FaLocationDot, FaMapLocationDot, FaPhone, FaRegCircleQuestion, FaTruck, FaWhatsapp } from 'react-icons/fa6'
import { InquiryForm } from '../components/Shared'
import './Contact.css'

const faqs = [
  {
    icon: <FaTruck />,
    question: 'Do you deliver daily milk and groceries?',
    answer: 'Yes. Daily milk deliveries and fresh grocery orders are available based on your delivery area and selected slot.'
  },
  {
    icon: <FaClock />,
    question: 'What time do deliveries usually happen?',
    answer: 'Morning delivery is prioritized for milk, flowers, vegetables, and other fresh items. Exact timing may vary by route.'
  },
  {
    icon: <FaRegCircleQuestion />,
    question: 'Can I ask about product availability before ordering?',
    answer: 'Absolutely. Send us a message through the form or WhatsApp and our team will confirm availability quickly.'
  }
]

function Contact({ redirectInquiry }) {
  return (
    <>
      <section className="contact-page premium-contact">
        <div className="contact-details">
          <p className="eyebrow">Get In Touch</p>
          <h1>Have questions about our products or delivery?</h1>
          <p>We're here to help you live a healthier, purer life.</p>
          <div className="contact-info-card">
            <h2>Contact Information</h2>
            <p><FaLocationDot /><b>Our Location</b><span>Plot No. 42, Farm House Colony, Hyderabad, Telangana</span></p>
            <p><FaPhone  /><b>Phone Number</b><span>+91 7406136807</span></p>
            <p><FaEnvelope /><b>Email Address</b><span>maheshbabun230@gmail.com</span></p>
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

      <section className="contact-map-section">
        <div className="contact-map-header">
          <div>
            <p className="eyebrow">Find Us</p>
            <h2>Visit or reach our Hyderabad delivery team.</h2>
          </div>
          <a href="https://www.google.com/maps/search/?api=1&query=Hyderabad%2C%20Telangana" target="_blank" rel="noreferrer">
            <FaMapLocationDot /> Open Map
          </a>
        </div>
        <iframe
          title="Mahesh Ecommerce location map"
          src="https://www.google.com/maps?q=Hyderabad%2C%20Telangana&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <section className="contact-faq-section">
        <div className="contact-faq-heading">
          <p className="eyebrow">FAQs</p>
          <h2>Common questions before you order.</h2>
        </div>
        <div className="contact-faq-grid">
          {faqs.map((faq) => (
            <article className="contact-faq-card" key={faq.question}>
              <div className="contact-faq-icon">{faq.icon}</div>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default Contact
