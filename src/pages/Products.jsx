import { useState, useMemo } from 'react'
import { categories } from '../data/storeData'
import { ProductCard, SectionTitle } from '../components/Shared'
import { FaXmark } from 'react-icons/fa6'
import './Products.css'

function Products({ products, selectedCategory, setSelectedCategory, addToCart, cartIds }) {
  const [activeTag, setActiveTag] = useState('all')
  const [sortBy, setSortBy] = useState('default')

  const processedProducts = useMemo(() => {
    let result = [...products]

    // Tag filtering
    if (activeTag === 'popular') {
      result = result.filter(p => p.badge?.toLowerCase().includes('best') || p.badge?.toLowerCase().includes('seller'))
    } else if (activeTag === 'under300') {
      result = result.filter(p => p.price <= 300)
    } else if (activeTag === 'daily') {
      result = result.filter(p => p.category === 'milk' || p.badge?.toLowerCase().includes('daily'))
    } else if (activeTag === 'organic') {
      result = result.filter(p => 
        p.description?.toLowerCase().includes('organic') || 
        p.description?.toLowerCase().includes('traditional') || 
        p.description?.toLowerCase().includes('pure') || 
        p.description?.toLowerCase().includes('natural')
      )
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'popularity') {
      result.sort((a, b) => {
        const scoreA = a.badge?.toLowerCase().includes('best') || a.badge?.toLowerCase().includes('seller') ? 2 : 1
        const scoreB = b.badge?.toLowerCase().includes('best') || b.badge?.toLowerCase().includes('seller') ? 2 : 1
        return scoreB - scoreA
      })
    }

    return result
  }, [products, activeTag, sortBy])

  return (
    <>
      <section className="page-layout">
        <aside className="filters">
          <h2>Categories</h2>
          <div className="category-filter-strip">
            <button className={selectedCategory === 'all' ? 'active' : ''} onClick={() => setSelectedCategory('all')} type="button">
              <img src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=120&q=80" alt="All" />
              <span>All Products</span>
            </button>
            {categories.map((category) => (
              <button className={selectedCategory === category.id ? 'active' : ''} key={category.id} onClick={() => setSelectedCategory(category.id)} type="button">
                <img src={category.image} alt={category.name} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
          
          <div className="filter-panel sort-panel desktop-only">
            <b>Sort By</b>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="default">Default Sort</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>

          <div className="filter-panel sort-panel mobile-only">
            <div className="sort-filter-strip">
              <button className={sortBy === 'default' ? 'active' : ''} onClick={() => setSortBy('default')} type="button">Default</button>
              <button className={sortBy === 'price-asc' ? 'active' : ''} onClick={() => setSortBy('price-asc')} type="button">Price: Low to High</button>
              <button className={sortBy === 'price-desc' ? 'active' : ''} onClick={() => setSortBy('price-desc')} type="button">Price: High to Low</button>
              <button className={sortBy === 'popularity' ? 'active' : ''} onClick={() => setSortBy('popularity')} type="button">Popularity</button>
            </div>
          </div>

          <div className="filter-panel tags-panel">
            <b>Filters</b>
            <div className="tags-filter-strip">
              <button className={activeTag === 'all' ? 'active' : ''} onClick={() => setActiveTag('all')} type="button">All</button>
              <button className={activeTag === 'popular' ? 'active' : ''} onClick={() => setActiveTag('popular')} type="button">Popular</button>
              <button className={activeTag === 'under300' ? 'active' : ''} onClick={() => setActiveTag('under300')} type="button">Under ₹300</button>
              <button className={activeTag === 'daily' ? 'active' : ''} onClick={() => setActiveTag('daily')} type="button">Daily Delivery</button>
              <button className={activeTag === 'organic' ? 'active' : ''} onClick={() => setActiveTag('organic')} type="button">Organic / Traditional</button>
            </div>
          </div>
        </aside>

        <div className="products-area">
          <SectionTitle title="Farm Fresh Products" text="Browse milk, flowers, oils, vegetables, and natural home staples." />
          
          <div className="product-grid">
            {processedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                inCart={cartIds.includes(product.id)}
              />
            ))}
          </div>
          
          {processedProducts.length === 0 && (
            <div className="no-products-message">
              <h3>No products found matching filters.</h3>
              <button className="primary small" onClick={() => { setActiveTag('all'); setSortBy('default'); setSelectedCategory('all'); }}>Clear Filters</button>
            </div>
          )}
        </div>
      </section>



      {/* ProductDetailsModal removed in favor of separate details page */}
    </>
  )
}

export default Products
