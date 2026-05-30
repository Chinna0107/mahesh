import { Link, Navigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaEnvelope, FaLocationDot, FaPhone, FaShieldHalved } from 'react-icons/fa6'
import './PolicyPage.css'

const policies = {
  privacy: {
    label: 'Privacy Policy',
    eyebrow: 'Your Data',
    intro: 'This policy explains how Mahesh Ecommerce collects, uses, and protects customer information when you browse, order, or contact us.',
    updated: 'May 30, 2026',
    sections: [
      {
        title: 'Information We Collect',
        points: [
          'Name, mobile number, email address, delivery address, and order details shared during checkout or account creation.',
          'Payment status, delivery preferences, support requests, and communication history needed to complete your orders.',
          'Basic technical information such as browser type, device details, and site usage patterns to improve website reliability.'
        ]
      },
      {
        title: 'How We Use Information',
        points: [
          'To confirm orders, arrange doorstep delivery, send order updates, and provide customer support.',
          'To improve our products, delivery experience, website features, and customer service workflows.',
          'To send service-related messages. Promotional updates are shared only where permitted and can be opted out of.'
        ]
      },
      {
        title: 'Sharing and Protection',
        points: [
          'We do not sell customer personal information.',
          'Information may be shared with delivery partners, payment providers, or service vendors only when needed to complete a service.',
          'We use reasonable administrative and technical safeguards to protect customer data from unauthorized access.'
        ]
      },
      {
        title: 'Customer Choices',
        points: [
          'You may request correction or deletion of your account details, subject to order, legal, tax, and fraud-prevention records.',
          'You can contact us anytime for privacy questions or to update your communication preferences.'
        ]
      }
    ]
  },
  refund: {
    label: 'Refund Policy',
    eyebrow: 'Returns & Refunds',
    intro: 'Fresh groceries and dairy products need quick resolution. This policy explains when replacements, credits, or refunds may be provided.',
    updated: 'May 30, 2026',
    sections: [
      {
        title: 'Eligible Issues',
        points: [
          'Damaged, leaked, spoiled, expired, or clearly incorrect items reported soon after delivery.',
          'Missing items from a paid order, verified against packing and delivery records.',
          'Duplicate payments or payment debits for orders that were not accepted by Mahesh Ecommerce.'
        ]
      },
      {
        title: 'Reporting Window',
        points: [
          'For milk, vegetables, flowers, cooked food, and other perishable items, please report issues within 6 hours of delivery.',
          'For packaged groceries, oils, and non-perishable items, please report issues within 24 hours of delivery.',
          'Photos, order ID, and delivery details help us resolve the request faster.'
        ]
      },
      {
        title: 'Resolution Options',
        points: [
          'Depending on availability and issue type, we may offer replacement, store credit, or refund to the original payment method.',
          'Approved refunds are usually initiated within 3 to 7 working days. Bank or payment gateway timelines may vary.',
          'Items damaged after delivery, consumed substantially, or stored incorrectly may not qualify for refund.'
        ]
      }
    ]
  },
  shipping: {
    label: 'Shipping Policy',
    eyebrow: 'Delivery Care',
    intro: 'We deliver farm-fresh products with practical handling standards so daily essentials reach customers in good condition.',
    updated: 'May 30, 2026',
    sections: [
      {
        title: 'Delivery Areas',
        points: [
          'Mahesh Ecommerce currently focuses on local doorstep delivery in and around Hyderabad, Telangana.',
          'Delivery availability may vary by pincode, product type, route capacity, weather, and operational constraints.',
          'If your location is outside our active service area, our team may contact you before confirming the order.'
        ]
      },
      {
        title: 'Delivery Timelines',
        points: [
          'Regular grocery orders are typically delivered on the selected or next available delivery slot.',
          'Milk, flowers, vegetables, and homemade food products are prioritized for freshness and may follow morning delivery schedules.',
          'Unexpected traffic, weather, stock checks, or high order volume may affect estimated delivery timing.'
        ]
      },
      {
        title: 'Customer Responsibilities',
        points: [
          'Please provide accurate address, contact number, landmark, and delivery instructions during checkout.',
          'Keep your phone reachable during delivery hours so our team can complete the delivery smoothly.',
          'If delivery cannot be completed because the customer is unavailable, redelivery may be scheduled based on product condition and route availability.'
        ]
      }
    ]
  },
  terms: {
    label: 'Terms & Conditions',
    eyebrow: 'Website Terms',
    intro: 'These terms apply when you use the Mahesh Ecommerce website, place an order, or interact with our services.',
    updated: 'May 30, 2026',
    sections: [
      {
        title: 'Use of Website',
        points: [
          'By using this website, you agree to provide accurate information and use the service only for lawful personal or business purposes.',
          'You are responsible for maintaining the confidentiality of your account login details and order activity.',
          'We may update products, prices, availability, delivery slots, and website features without prior notice.'
        ]
      },
      {
        title: 'Orders and Pricing',
        points: [
          'Orders are subject to product availability, delivery area coverage, payment confirmation, and acceptance by Mahesh Ecommerce.',
          'Fresh produce weight, size, color, and appearance may vary naturally from images shown on the website.',
          'If an item is unavailable, we may contact you for a replacement, partial fulfillment, credit, or refund.'
        ]
      },
      {
        title: 'Service Limits',
        points: [
          'We try to keep website information accurate, but occasional errors in pricing, stock, descriptions, or images may occur.',
          'Mahesh Ecommerce is not liable for indirect losses caused by delays, product unavailability, technical issues, or events beyond reasonable control.',
          'Policies may be updated periodically. Continued use of the website means you accept the latest version.'
        ]
      }
    ]
  }
}

const policyLinks = Object.entries(policies).map(([slug, policy]) => ({
  slug,
  label: policy.label
}))

function PolicyPage() {
  const { policySlug } = useParams()
  const policy = policies[policySlug]

  if (!policy) {
    return <Navigate to="/policies/privacy" replace />
  }

  return (
    <section className="policy-page">
      <div className="policy-hero">
        <div>
          <Link className="policy-back-link" to="/">
            <FaArrowLeft />
            Home
          </Link>
          <p className="eyebrow">{policy.eyebrow}</p>
          <h1>{policy.label}</h1>
          <p className="policy-intro">{policy.intro}</p>
          <p className="policy-updated">Last updated: {policy.updated}</p>
        </div>
        <div className="policy-help-card">
          <FaShieldHalved />
          <h2>Need Help?</h2>
          <p>Questions about an order, delivery, refund, or your account details can be sent to our support team.</p>
          <div className="policy-contact-list">
            <a href="mailto:maheshbabun230@gmail.com"><FaEnvelope /> maheshbabun230@gmail.com</a>
            <a href="tel:+917406136807"><FaPhone /> +91 7406136807</a>
            <span><FaLocationDot /> Hyderabad, Telangana</span>
          </div>
        </div>
      </div>

      <div className="policy-layout">
        <nav className="policy-nav" aria-label="Policy pages">
          <b>Policies</b>
          {policyLinks.map((item) => (
            <Link
              className={item.slug === policySlug ? 'active' : ''}
              key={item.slug}
              to={`/policies/${item.slug}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="policy-content">
          {policy.sections.map((section) => (
            <article className="policy-section" key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
          <div className="policy-note">
            This page is intended as customer-facing business policy content for Mahesh Ecommerce. For formal legal compliance, review it with a qualified professional before launch.
          </div>
        </div>
      </div>
    </section>
  )
}

export default PolicyPage
