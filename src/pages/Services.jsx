import { Link } from 'react-router-dom'
import { categories } from '../data/storeData'
import { ScrollReveal } from '../components/Shared'
import About from './About'
import './Services.css'

function Services() {
  return (
    <>
      <ScrollReveal className="page-hero compact service-hero">
        <p className="eyebrow">Our Services & Products</p>
        <h1>We bring you the finest collection of farm-fresh dairy and traditional food products, processed with care and delivered with love.</h1>
      </ScrollReveal>
      <ScrollReveal className="service-grid" delay={0.1}>
        {categories.map((category) => (
          <article className="service-card" key={category.id}>
            <img src={category.image} alt={category.name} />
            <h3>{category.name}</h3>
            <p>Carefully sourced, quality checked, and delivered fresh for your home routine.</p>
            <Link className="primary small" to={`/products?category=${category.id}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>Show Products</Link>
          </article>
        ))}
      </ScrollReveal>
      <About />
    </>
  )
}

export default Services
