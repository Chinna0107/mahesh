import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { categories } from '../data/storeData'
import { ProductCard, SectionTitle } from '../components/Shared'
import { FaBagShopping, FaBookOpen, FaSeedling, FaBoxesPacking, FaTruck, FaPhone, FaEnvelope, FaLocationDot } from 'react-icons/fa6'
import './Home.css'

const customerReviews = [
  ['Fresh milk every morning without fail.', 'Kavya Reddy'],
  ['The oils taste traditional and clean.', 'Srinivas Varma'],
  ['Vegetable basket quality is consistently excellent.', 'Deepa Nair'],
  ['Flowers arrive fresh enough for morning puja.', 'Anjali Rao'],
  ['Their ghee has that homemade aroma.', 'Ramesh K'],
  ['Delivery is polite, quick, and on time.', 'Bhavana P'],
  ['My parents loved the subscription plan.', 'Madhavi S'],
  ['The produce feels carefully selected.', 'Vikram D'],
  ['Simple ordering and reliable quality.', 'Neeraja M'],
  ['Groundnut oil is now a monthly staple.', 'Prakash N'],
  ['Clean packing and no damaged vegetables.', 'Harini T'],
  ['Best local farm delivery experience.', 'Sandeep G'],
  ['The milk is rich and fresh every day.', 'Priya L'],
  ['Customer support is very responsive.', 'Mahesh B'],
  ['Premium quality at a fair price.', 'Lakshmi K'],
]

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=90",
    title: "Premium Farm Fresh Staples",
    subtitle: "Naturally grown vegetables, pure milk & cold pressed oils direct to your kitchen."
  },
  {
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=90",
    title: "Direct Sourced, Clean Practice",
    subtitle: "Harvested at dawn and delivered chilled before your morning routine starts."
  },
  {
    image: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=1800&q=90",
    title: "Pure Desi Cow Milk & Ghee",
    subtitle: "Organic dairy, slow-cooked ghee, and morning puja flowers delivered fresh."
  }
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
}

const MotionLink = motion.create(Link)

function Home({ products, addToCart, redirectInquiry, cartIds }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const activeSlides = isMobile 
    ? HERO_SLIDES.filter(slide => !slide.title.includes("Pure Desi Cow Milk"))
    : HERO_SLIDES
  const normalizedSlide = currentSlide % activeSlides.length

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeSlides.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [activeSlides.length])

  return (
    <>
      <section className="home-hero-slider" aria-label="Mahesh farm fresh hero slider">
        {activeSlides.map((slide, idx) => (
          <div 
            className={`hero-slide${idx === normalizedSlide ? ' active' : ''}`} 
            key={idx}
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(15, 45, 21, 0.45), rgba(15, 45, 21, 0.75)), url(${slide.image})`,
              display: idx === normalizedSlide ? 'flex' : 'none'
            }}
          >
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="hero-slide-content"
              initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <div className="hero-slide-actions">
                <Link to="/products" className="primary hero-action-link"><FaBagShopping /> Shop Now</Link>
                <Link to="/about" className="ghost hero-action-link hero-story-link"><FaBookOpen /> Our Story</Link>
              </div>
            </motion.div>
          </div>
        ))}
        <div className="hero-slider-dots">
          {activeSlides.map((_, idx) => (
            <button 
              key={idx}
              className={`hero-slider-dot${idx === normalizedSlide ? ' active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              type="button"
            />
          ))}
        </div>
      </section>

      <motion.section
        className="banner-strip"
        initial="hidden"
        transition={{ duration: 0.45, ease: 'easeOut' }}
        variants={fadeUp}
        viewport={{ once: true, amount: 0.5 }}
        whileInView="visible"
      >
        <div>
          <span>Daily milk delivery</span>
          <span>Wood pressed oils</span>
          <span>Fresh vegetables</span>
          <span>Puja flowers</span>
          <span>Healthy family staples</span>
        </div>
      </motion.section>

      <SectionTitle title="Popular Products" text="Freshly picked customer favorites from Mahesh." />
      <motion.div
        className="product-grid home-scroll-row"
        initial="hidden"
        transition={{ staggerChildren: 0.06 }}
        variants={fadeUp}
        viewport={{ once: true, amount: 0.15 }}
        whileInView="visible"
      >
        <div className="home-scroll-row-inner">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              inCart={cartIds.includes(product.id)}
            />
          ))}
        </div>
      </motion.div>

      <SectionTitle title="Shop by Category" text="Choose the everyday staples your family needs." />
      <div className="category-grid">
        {categories.map((category, index) => (
          <MotionLink
            className="category-card"
            initial={{ opacity: 0, y: 18 }}
            key={category.id}
            to={`/products?category=${category.id}`}
            transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.35 }}
            whileHover={{ y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <img src={category.image} alt={category.name} />
            <small>0{index + 1}</small>
            <span>{category.name}</span>
          </MotionLink>
        ))}
      </div>

      <motion.section
        className="journey-showcase"
        initial="hidden"
        transition={{ duration: 0.5, ease: 'easeOut' }}
        variants={fadeUp}
        viewport={{ once: true, amount: 0.2 }}
        whileInView="visible"
      >
        <div className="journey-copy">
          <p className="eyebrow">The Journey Of</p>
          <h2>From local farms to your family table.</h2>
          <p>We work with nearby producers who value clean practices, seasonal freshness, and honest food. Every order is packed with care so the food feels closer to the farm than a shelf.</p>
          
          <div className="journey-steps">
            <div className="journey-step-card">
              <div className="journey-step-icon"><FaSeedling /></div>
              <h3>Direct Sourcing</h3>
              <p>Sourced directly from local farmers who follow clean and chemical-free agricultural practices.</p>
            </div>
            <div className="journey-step-card">
              <div className="journey-step-icon"><FaBoxesPacking /></div>
              <h3>Careful Packing</h3>
              <p>Every product is handpicked, quality-graded, and packed hygienically at our center.</p>
            </div>
            <div className="journey-step-card">
              <div className="journey-step-icon"><FaTruck /></div>
              <h3>Morning Delivery</h3>
              <p>Delivered fresh to your doorstep before the morning routine begins.</p>
            </div>
          </div>
        </div>
        <div className="journey-image-stack">
          <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=80" alt="Farm journey" />
          <img src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=700&q=80" alt="Fresh farm produce" />
        </div>
      </motion.section>

      <motion.section
        className="subscription"
        initial="hidden"
        transition={{ duration: 0.5, ease: 'easeOut' }}
        variants={fadeUp}
        viewport={{ once: true, amount: 0.2 }}
        whileInView="visible"
      >
        <div className="subscription-copy">
          <p className="eyebrow">Join Our Subscription Plans</p>
          <h2>Daily Milk Delivery to Your Home</h2>
          <p>Choose your plan and let our team handle your morning delivery routine.</p>
          <div className="plan-row">
            <span>500 ml daily</span>
            <span>1 litre daily</span>
            <span>Family plan</span>
          </div>
          <button className="primary" onClick={() => redirectInquiry('Hi Mahesh, I want to subscribe for daily milk delivery.')} type="button">Subscribe Now</button>
        </div>
        <div className="subscription-image-wrapper">
          <img className="subscription-below-image" src="https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=1100&q=85" alt="Milk bottle delivery" />
        </div>
      </motion.section>

      <motion.div
        className="home-divider-banner"
        initial="hidden"
        transition={{ duration: 0.5, ease: 'easeOut' }}
        variants={fadeUp}
        viewport={{ once: true, amount: 0.35 }}
        whileInView="visible"
      >
        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80" alt="Pure natural farmland" />
        <div className="divider-overlay">
          <h3>Purity, Freshness & Traditional Nutrition</h3>
          <p>Harvested at dawn, delivered to your door.</p>
        </div>
      </motion.div>

      <motion.section
        className="contact-band"
        initial="hidden"
        transition={{ duration: 0.5, ease: 'easeOut' }}
        variants={fadeUp}
        viewport={{ once: true, amount: 0.2 }}
        whileInView="visible"
      >
        <div className="contact-band-copy">
          <p className="eyebrow">Purely Natural.</p>
          <h2>Part of Your Healthy Life.</h2>
          <p className="contact-band-caption">Have questions about our products or delivery?</p>
          <p>At Mahesh, we believe in the power of pure, natural nutrition. We're here to help you live a healthier, purer life.</p>
          
          <div className="contact-quick-details">
            <div className="contact-detail-item">
              <div className="contact-icon-box"><FaPhone /></div>
              <div>
                <b>Call Us</b>
                <span>+91 7416750834</span>
              </div>
            </div>
            <div className="contact-detail-item">
              <div className="contact-icon-box"><FaEnvelope /></div>
              <div>
                <b>Email Us</b>
                <span>info@mahesh.in</span>
              </div>
            </div>
            <div className="contact-detail-item">
              <div className="contact-icon-box"><FaLocationDot /></div>
              <div>
                <b>Visit Us</b>
                <span>Hyderabad, Telangana</span>
              </div>
            </div>
          </div>
          
          <Link className="ghost" to="/contact" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', marginTop: '16px' }}>View Contact Details</Link>
        </div>
        <div className="contact-band-image-wrapper">
          <img src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=900&q=85" alt="Pure natural healthy produce" />
        </div>
      </motion.section>

      <SectionTitle title="Customer Reviews" text="Real notes from families who trust our daily essentials." />
      <div className="reviews-marquee-container">
        <div className="reviews-marquee-track">
          {customerReviews.map(([review, name], index) => (
            <article key={`${name}-${index}`}>
              <span>{'★★★★★'.slice(0, index % 5 === 0 ? 4 : 5)}</span>
              <p>{review}</p>
              <b>{name}</b>
            </article>
          ))}
          {customerReviews.map(([review, name], index) => (
            <article key={`${name}-dup-${index}`} aria-hidden="true">
              <span>{'★★★★★'.slice(0, index % 5 === 0 ? 4 : 5)}</span>
              <p>{review}</p>
              <b>{name}</b>
            </article>
          ))}
        </div>
      </div>

      {/* Details modal removed in favor of separate page details */}
    </>
  )
}

export default Home
