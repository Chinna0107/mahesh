import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaTrash, 
  FaPen, 
  FaPlus, 
  FaMagnifyingGlass,
  FaBoxesStacked
} from 'react-icons/fa6'
import '../../pages/Admin.css'

const CATEGORIES = [
  { id: 'milk', name: 'Milk & Dairy' },
  { id: 'flowers', name: 'Flowers' },
  { id: 'oils', name: 'Wood Pressed Oils' },
  { id: 'vegetables', name: 'Vegetables' }
]

function AdminProducts({ products = [], deleteProduct }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')

  // Filter products based on search and category
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCat === 'all' || p.category === selectedCat
    const matchSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.name_english && p.name_english.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <div className="admin-layout-card">
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ borderBottom: 'none', paddingBottom: 0, margin: 0 }}>
          <span>Products Catalog</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '8px' }}>({products.length} total)</span>
        </h2>
        <button className="admin-btn primary" onClick={() => navigate('/admin/products/new')} type="button">
          <FaPlus /> Add New Product
        </button>
      </div>

      {/* Filters row */}
      <div className="product-filters-row">
        <div className="search-input-wrapper">
          <FaMagnifyingGlass />
          <input 
            type="text" 
            placeholder="Search catalog by name..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <select 
          value={selectedCat} 
          onChange={(e) => setSelectedCat(e.target.value)}
          className="product-category-select"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Cards Grid */}
      {filteredProducts.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px 0' }}>No products found matching the criteria.</p>
      ) : (
        <div className="products-cards-grid">
          {filteredProducts.map((product) => (
            <div className="product-admin-card" key={product.id}>
              <div className="product-card-image-wrapper">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
                    <FaBoxesStacked style={{ fontSize: '32px', opacity: 0.3 }} />
                  </div>
                )}
                {product.badge && (
                  <span className="product-card-badge">{product.badge}</span>
                )}
                <div className="product-card-actions-overlay">
                  <button 
                    onClick={() => navigate(`/admin/products/edit/${product.id}`)} 
                    className="product-card-action-btn"
                    title="Edit Product"
                    type="button"
                  >
                    <FaPen style={{ fontSize: '11px' }} />
                  </button>
                  <button 
                    onClick={() => deleteProduct(product.id)} 
                    className="product-card-action-btn delete"
                    title="Delete Product"
                    type="button"
                  >
                    <FaTrash style={{ fontSize: '11px' }} />
                  </button>
                </div>
              </div>
              
              <div className="product-card-info">
                <div className="product-card-title-row">
                  <h3 style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '170px' }}>{product.name}</h3>
                  <span className="product-card-price">₹{product.price}</span>
                </div>
                <div className="product-card-meta">
                  {product.category} · {product.unit}
                </div>
                {product.quantity_prices && product.quantity_prices.length > 0 && (
                  <div style={{ fontSize: '11px', color: 'var(--accent-gold-dark)', fontWeight: 'bold', margin: '4px 0' }}>
                    Has {product.quantity_prices.length} Quantity Variants
                  </div>
                )}
                <div className="product-card-stock" style={{ color: product.stock > 0 ? 'var(--primary-green)' : '#c5221f' }}>
                  {product.stock > 0 ? `Stock: ${product.stock} units` : 'Out of Stock'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminProducts
