import { useState } from 'react'
import { 
  FaTrash, 
  FaPen, 
  FaPlus, 
  FaXmark,
  FaMagnifyingGlass,
  FaCloudArrowUp,
  FaLink,
  FaBoxesStacked,
  FaImage,
  FaCheck
} from 'react-icons/fa6'
import { api } from '../../api'
import '../../pages/Admin.css'

const CATEGORIES = [
  { id: 'milk', name: 'Milk & Dairy', defaultUnit: 'litres' },
  { id: 'flowers', name: 'Flowers', defaultUnit: 'kg' },
  { id: 'oils', name: 'Wood Pressed Oils', defaultUnit: 'litres' },
  { id: 'vegetables', name: 'Vegetables', defaultUnit: 'kgs' }
]

const emptyFormState = {
  name: '',
  name_english: '',
  category: 'milk',
  price: '',
  unit: 'litres',
  badge: '',
  stock: '50',
  image: '',
  description: '',
  mrp: '',
  price_unit: 'litres',
  quantity_prices: [],
  images: [],
  popular: false,
  spice_level: 0,
  shelf_life: '',
  serves: '',
  ingredients: [],
  nutrition: { calories: '', protein: '', carbs: '', fat: '', fiber: '' },
  tags: [],
  reviews: []
}

function AdminProducts({ products = [], addProduct, updateProduct, deleteProduct }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
  // Search and Category Filter states
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')

  // Modal active tab: 'basic' | 'pricing' | 'media' | 'nutrition' | 'reviews'
  const [activeTab, setActiveTab] = useState('basic')

  const [form, setForm] = useState(emptyFormState)
  
  const resetForm = () => {
    setForm(emptyFormState)
    setEditingProduct(null)
    setActiveTab('basic')
  }

  const handleCategoryChange = (e) => {
    const catVal = e.target.value
    const matched = CATEGORIES.find(c => c.id === catVal)
    const defUnit = matched ? matched.defaultUnit : 'litres'
    setForm(prev => ({
      ...prev,
      category: catVal,
      unit: defUnit,
      price_unit: defUnit
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const res = await api.upload.uploadImage(file)
      setForm(prev => ({ ...prev, image: res.url }))
    } catch (err) {
      alert(`Image upload failed: ${err.message}`)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleOpenAdd = () => {
    resetForm()
    setModalOpen(true)
  }

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod)
    setForm({
      name: prod.name || '',
      name_english: prod.name_english || '',
      category: prod.category || 'milk',
      price: prod.price || '',
      unit: prod.unit || '',
      badge: prod.badge || '',
      stock: prod.stock || 0,
      image: prod.image || '',
      description: prod.description || '',
      mrp: prod.mrp || '',
      price_unit: prod.price_unit || prod.unit || '',
      quantity_prices: Array.isArray(prod.quantity_prices) ? prod.quantity_prices : [],
      images: Array.isArray(prod.images) ? prod.images : [],
      popular: !!prod.popular,
      spice_level: prod.spice_level || 0,
      shelf_life: prod.shelf_life || '',
      serves: prod.serves || '',
      ingredients: Array.isArray(prod.ingredients) ? prod.ingredients : [],
      nutrition: prod.nutrition && typeof prod.nutrition === 'object' ? {
        calories: prod.nutrition.calories || '',
        protein: prod.nutrition.protein || '',
        carbs: prod.nutrition.carbs || '',
        fat: prod.nutrition.fat || '',
        fiber: prod.nutrition.fiber || ''
      } : { calories: '', protein: '', carbs: '', fat: '', fiber: '' },
      tags: Array.isArray(prod.tags) ? prod.tags : [],
      reviews: Array.isArray(prod.reviews) ? prod.reviews : []
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) {
      alert('Product Name and Price are required!')
      return
    }

    const productPayload = {
      ...form,
      price: Number(form.price),
      mrp: form.mrp ? Number(form.mrp) : null,
      stock: Number(form.stock || 0)
    }

    let success = false
    if (editingProduct) {
      success = await updateProduct(editingProduct.id, productPayload)
    } else {
      success = await addProduct(productPayload)
    }

    if (success) {
      setModalOpen(false)
      resetForm()
    }
  }

  // Filter products based on search and category
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCat === 'all' || p.category === selectedCat
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.name_english && p.name_english.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  // Quantity variants helper
  const addQuantityPrice = () => {
    setForm(prev => ({
      ...prev,
      quantity_prices: [...prev.quantity_prices, { quantity: '', price: '', mrp: '' }]
    }))
  }

  const updateQuantityPrice = (idx, field, val) => {
    const updated = [...form.quantity_prices]
    updated[idx] = { ...updated[idx], [field]: val }
    setForm(prev => ({ ...prev, quantity_prices: updated }))
  }

  const removeQuantityPrice = (idx) => {
    setForm(prev => ({
      ...prev,
      quantity_prices: prev.quantity_prices.filter((_, i) => i !== idx)
    }))
  }

  // Ingredients helpers
  const addIngredient = () => {
    setForm(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }))
  }

  const updateIngredient = (idx, val) => {
    const updated = [...form.ingredients]
    updated[idx] = val
    setForm(prev => ({ ...prev, ingredients: updated }))
  }

  const removeIngredient = (idx) => {
    setForm(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== idx) }))
  }

  // Gallery images helpers
  const addGalleryImage = () => {
    setForm(prev => ({ ...prev, images: [...prev.images, ''] }))
  }

  const updateGalleryImage = (idx, val) => {
    const updated = [...form.images]
    updated[idx] = val
    setForm(prev => ({ ...prev, images: updated }))
  }

  const removeGalleryImage = (idx) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
  }

  // Fake Reviews helpers
  const addReview = () => {
    setForm(prev => ({
      ...prev,
      reviews: [...prev.reviews, { name: '', rating: 5, comment: '', date: new Date().toISOString().split('T')[0] }]
    }))
  }

  const updateReview = (idx, field, val) => {
    const updated = [...form.reviews]
    updated[idx] = { ...updated[idx], [field]: val }
    setForm(prev => ({ ...prev, reviews: updated }))
  }

  const removeReview = (idx) => {
    setForm(prev => ({ ...prev, reviews: prev.reviews.filter((_, i) => i !== idx) }))
  }

  return (
    <div className="admin-layout-card">
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ borderBottom: 'none', paddingBottom: 0, margin: 0 }}>
          <span>Products Catalog</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '8px' }}>({products.length} total)</span>
        </h2>
        <button className="admin-btn primary" onClick={handleOpenAdd} type="button">
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
                    onClick={() => handleOpenEdit(product)} 
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

      {/* Edit/Add Modal Overlay */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', width: '100%' }}>
            
            <div className="modal-header">
              <h3>{editingProduct ? `Edit: ${form.name}` : 'Add New Farm Staple'}</h3>
              <button onClick={() => setModalOpen(false)} className="modal-close-btn" type="button" aria-label="Close modal">
                <FaXmark />
              </button>
            </div>

            {/* Custom Tab selectors inside modal */}
            <div style={{ display: 'flex', background: 'var(--bg-cream-dark)', borderBottom: '1px solid var(--border-light)' }}>
              {[
                { id: 'basic', label: 'Basic Info' },
                { id: 'pricing', label: 'Pricing & Variants' },
                { id: 'media', label: 'Media & Details' },
                { id: 'nutrition', label: 'Nutrition & Ingredients' },
                { id: 'reviews', label: 'Reviews' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '12px 10px',
                    border: 'none',
                    background: activeTab === tab.id ? '#fff' : 'transparent',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    fontWeight: activeTab === tab.id ? '800' : '600',
                    color: activeTab === tab.id ? 'var(--primary-green)' : 'var(--text-muted)',
                    borderBottom: activeTab === tab.id ? '2px solid var(--primary-green)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body-scrollable" style={{ minHeight: '360px' }}>
                
                {/* 1. BASIC INFO TAB */}
                {activeTab === 'basic' && (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div className="modal-grid-cols-2">
                      <label className="form-label">
                        Product Name (Local) *
                        <input 
                          value={form.name} 
                          onChange={(e) => setForm({ ...form, name: e.target.value })} 
                          placeholder="e.g. A2 Cow Ghee (నేతి)" 
                          required 
                        />
                      </label>
                      
                      <label className="form-label">
                        Product Name (English)
                        <input 
                          value={form.name_english} 
                          onChange={(e) => setForm({ ...form, name_english: e.target.value })} 
                          placeholder="e.g. Desi Cow Ghee" 
                        />
                      </label>
                    </div>

                    <div className="modal-grid-cols-2">
                      <label className="form-label">
                        Category *
                        <select value={form.category} onChange={handleCategoryChange}>
                          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </label>
                      
                      <label className="form-label">
                        Badge Tag
                        <input 
                          value={form.badge} 
                          onChange={(e) => setForm({ ...form, badge: e.target.value })} 
                          placeholder="e.g. Best seller, Cold pressed" 
                        />
                      </label>
                    </div>

                    <div className="modal-grid-cols-2">
                      <label className="form-label" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                        <input 
                          type="checkbox" 
                          checked={form.popular} 
                          onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                          style={{ width: '18px', height: '18px' }}
                        />
                        Popular Product / Favorite
                      </label>

                      <label className="form-label">
                        Spice Level (For Staples/Pickles)
                        <select 
                          value={form.spice_level} 
                          onChange={(e) => setForm({ ...form, spice_level: Number(e.target.value) })}
                        >
                          <option value={0}>😊 No Spice</option>
                          <option value={1}>🌶️ Mild</option>
                          <option value={2}>🌶️🌶️ Medium</option>
                          <option value={3}>🌶️🌶️🌶️ Hot</option>
                        </select>
                      </label>
                    </div>

                    <label className="form-label">
                      Product Description
                      <textarea 
                        value={form.description} 
                        onChange={(e) => setForm({ ...form, description: e.target.value })} 
                        placeholder="Tell customers about this fresh farm staple..." 
                        style={{ minHeight: '80px' }}
                      />
                    </label>
                  </div>
                )}

                {/* 2. PRICING & VARIANTS TAB */}
                {activeTab === 'pricing' && (
                  <div style={{ display: 'grid', gap: '20px' }}>
                    <div className="modal-section-title">Base Price & Stock</div>
                    <div className="modal-grid-cols-3">
                      <label className="form-label">
                        Base Price (₹) *
                        <input 
                          type="number"
                          value={form.price} 
                          onChange={(e) => setForm({ ...form, price: e.target.value })} 
                          placeholder="e.g. 690" 
                          required 
                        />
                      </label>

                      <label className="form-label">
                        Base MRP (₹)
                        <input 
                          type="number"
                          value={form.mrp} 
                          onChange={(e) => setForm({ ...form, mrp: e.target.value })} 
                          placeholder="e.g. 750" 
                        />
                      </label>

                      <label className="form-label">
                        Stock Count (units)
                        <input 
                          type="number"
                          value={form.stock} 
                          onChange={(e) => setForm({ ...form, stock: e.target.value })} 
                          placeholder="e.g. 50" 
                        />
                      </label>
                    </div>

                    <div className="modal-grid-cols-2">
                      <label className="form-label">
                        Base Unit Size *
                        <input 
                          value={form.unit} 
                          onChange={(e) => setForm({ ...form, unit: e.target.value })} 
                          placeholder="e.g. 1 litre, 1 kg, bundle" 
                          required
                        />
                      </label>

                      <label className="form-label">
                        Price Unit Title
                        <input 
                          value={form.price_unit} 
                          onChange={(e) => setForm({ ...form, price_unit: e.target.value })} 
                          placeholder="e.g. litres, kgs, kg" 
                        />
                      </label>
                    </div>

                    {/* Quantity variants section */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary-green-dark)' }}>Multiple Quantity variants (for dropdown list)</span>
                        <button type="button" onClick={addQuantityPrice} className="admin-btn secondary small">
                          <FaPlus /> Add Variant
                        </button>
                      </div>
                      
                      {form.quantity_prices.length === 0 ? (
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                          No variants defined. The product will only use the base unit size and price.
                        </p>
                      ) : (
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {form.quantity_prices.map((qp, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <input 
                                value={qp.quantity} 
                                onChange={(e) => updateQuantityPrice(idx, 'quantity', e.target.value)} 
                                placeholder="Quantity (e.g. 500 ml, 2 kgs)"
                                style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '13px' }} 
                              />
                              <input 
                                type="number" 
                                value={qp.price} 
                                onChange={(e) => updateQuantityPrice(idx, 'price', Number(e.target.value))} 
                                placeholder="Price (₹)" 
                                style={{ width: '100px', padding: '8px 10px', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '13px' }} 
                              />
                              <input 
                                type="number" 
                                value={qp.mrp || ''} 
                                onChange={(e) => updateQuantityPrice(idx, 'mrp', e.target.value ? Number(e.target.value) : undefined)} 
                                placeholder="MRP (₹)" 
                                style={{ width: '100px', padding: '8px 10px', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '13px' }} 
                              />
                              <button 
                                type="button" 
                                onClick={() => removeQuantityPrice(idx)}
                                style={{ border: 'none', background: 'transparent', color: '#c5221f', cursor: 'pointer', padding: '8px' }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. MEDIA & DETAILS TAB */}
                {activeTab === 'media' && (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div className="modal-section-title">Primary Display Image</div>
                    <div className="modal-grid-cols-2">
                      <div className="form-label">
                        Upload Image file
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            id="product-image-file-tab"
                          />
                          <label 
                            htmlFor="product-image-file-tab" 
                            className="admin-btn secondary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0, cursor: 'pointer' }}
                          >
                            <FaCloudArrowUp /> {uploadingImage ? 'Uploading...' : 'Upload File'}
                          </label>
                          {form.image && (
                            <img 
                              src={form.image} 
                              alt="Preview" 
                              style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-light)' }} 
                            />
                          )}
                        </div>
                      </div>
                      
                      <label className="form-label">
                        Image URL Link
                        <input 
                          type="text" 
                          value={form.image} 
                          onChange={(e) => setForm({ ...form, image: e.target.value })}
                          placeholder="Or paste direct unsplash image link" 
                        />
                      </label>
                    </div>

                    <div className="modal-section-title">Image Gallery Slider</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 'bold' }}>Gallery Images URLs (shown on detail slider)</span>
                      <button type="button" onClick={addGalleryImage} className="admin-btn secondary small">
                        <FaPlus /> Add Image URL
                      </button>
                    </div>
                    {form.images.length > 0 && (
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {form.images.map((img, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input 
                              value={img} 
                              onChange={(e) => updateGalleryImage(idx, e.target.value)} 
                              placeholder="https://images.unsplash.com/..." 
                              style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '13px' }} 
                            />
                            {img && (
                              <img src={img} alt="" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }} />
                            )}
                            <button 
                              type="button" 
                              onClick={() => removeGalleryImage(idx)}
                              style={{ border: 'none', background: 'transparent', color: '#c5221f', cursor: 'pointer', padding: '8px' }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="modal-section-title">Other details</div>
                    <div className="modal-grid-cols-2">
                      <label className="form-label">
                        Shelf Life (e.g. 5 days, 6 months)
                        <input 
                          value={form.shelf_life} 
                          onChange={(e) => setForm({ ...form, shelf_life: e.target.value })} 
                          placeholder="e.g. 7 days fresh, 30 days" 
                        />
                      </label>

                      <label className="form-label">
                        Serves (e.g. 2-3 people)
                        <input 
                          value={form.serves} 
                          onChange={(e) => setForm({ ...form, serves: e.target.value })} 
                          placeholder="e.g. 3-4 persons, family pack" 
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* 4. NUTRITION & INGREDIENTS TAB */}
                {activeTab === 'nutrition' && (
                  <div style={{ display: 'grid', gap: '20px' }}>
                    <div className="modal-section-title">Nutrition stats (per 100g)</div>
                    <div className="modal-grid-cols-5">
                      <label className="form-label">
                        Calories
                        <input 
                          value={form.nutrition.calories} 
                          onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, calories: e.target.value } })} 
                          placeholder="e.g. 150 kcal" 
                        />
                      </label>

                      <label className="form-label">
                        Protein
                        <input 
                          value={form.nutrition.protein} 
                          onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, protein: e.target.value } })} 
                          placeholder="e.g. 3.2 g" 
                        />
                      </label>

                      <label className="form-label">
                        Carbs
                        <input 
                          value={form.nutrition.carbs} 
                          onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, carbs: e.target.value } })} 
                          placeholder="e.g. 4.8 g" 
                        />
                      </label>

                      <label className="form-label">
                        Fats
                        <input 
                          value={form.nutrition.fat} 
                          onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, fat: e.target.value } })} 
                          placeholder="e.g. 8.5 g" 
                        />
                      </label>

                      <label className="form-label">
                        Fiber
                        <input 
                          value={form.nutrition.fiber} 
                          onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, fiber: e.target.value } })} 
                          placeholder="e.g. 0.5 g" 
                        />
                      </label>
                    </div>

                    <div className="modal-section-title">Ingredients List</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: 'bold' }}>Manage Ingredients</span>
                      <button type="button" onClick={addIngredient} className="admin-btn secondary small">
                        <FaPlus /> Add Ingredient
                      </button>
                    </div>
                    {form.ingredients.length === 0 ? (
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                        No ingredients added.
                      </p>
                    ) : (
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {form.ingredients.map((ing, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input 
                              value={ing} 
                              onChange={(e) => updateIngredient(idx, e.target.value)} 
                              placeholder="Ingredient Name (e.g. Pure cow milk fats, Organic groundnuts)" 
                              style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '13px' }} 
                            />
                            <button 
                              type="button" 
                              onClick={() => removeIngredient(idx)}
                              style={{ border: 'none', background: 'transparent', color: '#c5221f', cursor: 'pointer', padding: '8px' }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 5. REVIEWS TAB */}
                {activeTab === 'reviews' && (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--primary-green-dark)' }}>Customer Reviews</span>
                      <button type="button" onClick={addReview} className="admin-btn secondary small">
                        <FaPlus /> Add Review
                      </button>
                    </div>

                    {form.reviews.length === 0 ? (
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                        No reviews yet. Add some fake reviews to showcase on the product details page.
                      </p>
                    ) : (
                      <div style={{ display: 'grid', gap: '12px' }}>
                        {form.reviews.map((rev, idx) => (
                          <div key={idx} style={{ background: 'var(--bg-cream-dark)', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              <input 
                                value={rev.name} 
                                onChange={(e) => updateReview(idx, 'name', e.target.value)} 
                                placeholder="Reviewer Name" 
                                style={{ flex: 1, minWidth: '130px', padding: '6px 10px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '12px' }} 
                              />
                              <select 
                                value={rev.rating} 
                                onChange={(e) => updateReview(idx, 'rating', Number(e.target.value))}
                                style={{ padding: '6px 10px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '12px' }}
                              >
                                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                              </select>
                              <input 
                                type="date" 
                                value={rev.date} 
                                onChange={(e) => updateReview(idx, 'date', e.target.value)} 
                                style={{ padding: '6px 10px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '12px' }} 
                              />
                              <button 
                                type="button" 
                                onClick={() => removeReview(idx)}
                                style={{ border: 'none', background: 'transparent', color: '#c5221f', cursor: 'pointer', marginLeft: 'auto' }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                            <textarea 
                              value={rev.comment} 
                              onChange={(e) => updateReview(idx, 'comment', e.target.value)} 
                              placeholder="Review contents..."
                              style={{ width: '100%', minHeight: '50px', padding: '6px 10px', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '12px', fontFamily: 'inherit' }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>

              <div className="modal-footer">
                <button className="admin-btn primary" type="submit">
                  <FaCheck /> {editingProduct ? 'Save Product Details' : 'Create Product'}
                </button>
                <button className="admin-btn secondary" onClick={() => setModalOpen(false)} type="button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
