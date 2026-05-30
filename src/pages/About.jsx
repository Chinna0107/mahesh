import { FaSeedling, FaBoxesPacking, FaTruck } from 'react-icons/fa6'
import './About.css'

function About() {
  return (
    <>
      <section className="about-hero-section">
        <div className="about-hero-copy">
          <p className="eyebrow">Bringing the Farm</p>
          <h1>Closer to You.</h1>
          <p className="lead">Mahesh is a local farm-fresh grocery and dairy brand focused on delivering pure, natural, and high-quality products directly to customers' homes.</p>
          <p>Our mission is to provide fresh milk, vegetables, groceries, traditional sweets, and homemade food products with trusted quality and affordable prices. We bridge the gap between dedicated local producers and health-conscious urban families who value clean nutrition.</p>
          
          <div className="about-hero-features">
            <div className="feature-item">
              <div className="feature-icon"><FaSeedling /></div>
              <div>
                <h4>100% Raw & Natural</h4>
                <p>No artificial chemicals, preservatives, or hormones are ever added.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><FaBoxesPacking /></div>
              <div>
                <h4>Hygienically Sourced</h4>
                <p>Processed and packaged using advanced clean standards.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon"><FaTruck /></div>
              <div>
                <h4>Doorstep Delivery</h4>
                <p>Reliable next-morning deliveries tailored to your plan.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="about-hero-image-wrapper">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80" alt="Farmland" />
        </div>
      </section>

      <section className="mission-vision-container">
        <div className="mission-vision-header">
          <p className="eyebrow">Purity & Values</p>
          <h2>Purity, Freshness, and Healthy Living</h2>
          <p>We emphasize traditional care and clean processes to revive authentic food habits for your family's health.</p>
        </div>
        
        <div className="mission-vision-grid">
          <div className="value-card mission-card">
            <div className="value-icon"><FaSeedling /></div>
            <h3>Our Mission</h3>
            <p>To provide families with high-quality, pure, and farm-fresh dairy and grocery staples directly to their doorsteps. We aim to replace chemically processed alternatives with fresh, natural choices that contribute directly to your family's health and happiness.</p>
          </div>
          
          <div className="value-card vision-card">
            <div className="value-icon"><FaTruck /></div>
            <h3>Our Vision</h3>
            <p>To revive and sustain traditional methods of food production that our ancestors followed. We strive to build a healthy, sustainable ecosystem where rural farmers are fairly supported and urban consumers enjoy pure nutrition without compromises.</p>
          </div>
        </div>
      </section>

      <section className="about-highlights-section">
        <div className="highlights-copy">
          <p className="eyebrow">Our Philosophy</p>
          <h2>We Believe Food Should Be Natural</h2>
          <p>Every product under our brand goes through strict checking. We ensure that our milk has no adulterants, our flowers are fresh-cut, and our oils are pressed without heat or chemical solvents.</p>
          
          <div className="highlights-stats">
            <div className="stat-card">
              <h3>100%</h3>
              <p>Pure Organic</p>
            </div>
            <div className="stat-card">
              <h3>Daily</h3>
              <p>Fast Delivery</p>
            </div>
          </div>
        </div>
        
        <div className="founder-card">
          <h3>MAHESH</h3>
          <p className="founder-title">Founder & CEO of MAHESH ECOMMERCE</p>
          <p>An entrepreneur focused on building local businesses and providing fresh, high-quality food products to communities. Her vision for Mahesh is to bridge the gap between rural pure produce and urban healthy living.</p>
          <button className="primary small" type="button">Connect with Founder</button>
        </div>
      </section>
    </>
  )
}

export default About
