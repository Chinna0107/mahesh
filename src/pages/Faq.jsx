import { useState } from 'react'
import { FaChevronDown, FaTruck, FaLeaf, FaCreditCard, FaRotateLeft } from 'react-icons/fa6'
import { ScrollReveal, SectionTitle, InquiryForm } from '../components/Shared'
import './Faq.css'

const faqCategories = [
  {
    title: 'Delivery & Shipping',
    icon: <FaTruck />,
    questions: [
      {
        q: 'Do you deliver daily milk and groceries?',
        a: 'Yes. Daily milk deliveries and fresh grocery orders are available based on your delivery area and selected slot.'
      },
      {
        q: 'What time do deliveries usually happen?',
        a: 'Morning delivery is prioritized for milk, flowers, vegetables, and other fresh items (usually between 6:00 AM - 8:30 AM). Exact timing may vary by route.'
      },
      {
        q: 'Is there a minimum order value for free delivery?',
        a: 'Yes, orders above ₹500 qualify for free home delivery. A nominal delivery fee of ₹40 applies to orders below this amount.'
      }
    ]
  },
  {
    title: 'Product Quality & Sourcing',
    icon: <FaLeaf />,
    questions: [
      {
        q: 'Are your vegetables and dairy products organic?',
        a: 'We strictly follow natural and traditional farming practices. Our products are 100% free from chemical pesticides, artificial preservatives, and hormones.'
      },
      {
        q: 'Where do you source your products from?',
        a: 'We work directly with local farmers and rural producers around Telangana to ensure freshness and fair trade.'
      }
    ]
  },
  {
    title: 'Payments & Billing',
    icon: <FaCreditCard />,
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major Credit/Debit cards, UPI (Google Pay, PhonePe, Paytm), and Net Banking.'
      },
      {
        q: 'How does the monthly subscription billing work?',
        a: 'For daily milk and grocery subscriptions, we operate on a prepaid wallet system. You recharge your wallet, and the daily amount is deducted automatically upon delivery.'
      }
    ]
  },
  {
    title: 'Returns & Refunds',
    icon: <FaRotateLeft />,
    questions: [
      {
        q: 'Can I return an item if I am not satisfied?',
        a: 'Yes, if you receive a damaged or unsatisfactory product, please inform us within 2 hours of delivery. We will issue a replacement or a full refund.'
      },
      {
        q: 'How long does a refund take?',
        a: 'Refunds to your original payment method typically take 3-5 business days to process depending on your bank.'
      }
    ]
  }
]

function Faq() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="faq-page">
      <ScrollReveal className="faq-header-hero">
        <SectionTitle title="Frequently Asked Questions" text="Everything you need to know about our products, delivery, and services." />
      </ScrollReveal>

      <div className="faq-content-layout">
        <div className="faq-main-column">
          {faqCategories.map((category, catIdx) => (
            <ScrollReveal key={catIdx} className="faq-category-block" delay={catIdx * 0.1}>
              <div className="faq-category-title">
                {category.icon}
                <h2>{category.title}</h2>
              </div>
              <div className="faq-accordion">
                {category.questions.map((faq, qIdx) => {
                  const globalIdx = `${catIdx}-${qIdx}`
                  const isOpen = openIndex === globalIdx
                  return (
                    <div className={`faq-accordion-item ${isOpen ? 'open' : ''}`} key={qIdx}>
                      <button className="faq-accordion-header" onClick={() => toggleFaq(globalIdx)} type="button">
                        <h3>{faq.q}</h3>
                        <FaChevronDown className="faq-chevron" />
                      </button>
                      <div className="faq-accordion-body" style={{ height: isOpen ? 'auto' : 0, overflow: 'hidden' }}>
                        <p>{faq.a}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="faq-sidebar" delay={0.3}>
          <div className="faq-support-card">
            <h3>Still have questions?</h3>
            <p>If you cannot find the answer you are looking for, please feel free to contact our customer support team.</p>
            <InquiryForm redirectInquiry={(msg) => window.open(`https://wa.me/917406136807?text=${encodeURIComponent(msg)}`, '_blank')} title="Ask a Question" showEmail={false} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default Faq
