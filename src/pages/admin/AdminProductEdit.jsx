import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FaArrowLeft,
  FaCheck, 
  FaXmark,
  FaPlus,
  FaTrash,
  FaCloudArrowUp,
  FaImage,
  FaCircleInfo,
  FaCoins,
  FaLeaf,
  FaStar,
  FaComments,
  FaImages,
  FaArrowsRotate,
  FaTag
} from 'react-icons/fa6'
import { api } from '../../api'
import './AdminProductEdit.css'

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

// ── Toast Component ──────────────────────────────────────
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`editor-toast ${type}`}>
      {type === 'success' ? <FaCheck /> : type === 'error' ? <FaXmark /> : <FaCircleInfo />}
      <span>{message}</span>
      <button className="editor-toast-close" onClick={onClose}><FaXmark /></button>
    </div>
  )
}

function AdminProductEdit({ products = [], addProduct, updateProduct }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id

  const [activeTab, setActiveTab] = useState('basic')
  const [form, setForm] = useState(emptyFormState)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [errors, setErrors] = useState({})
  const [tagInput, setTagInput] = useState('')

  // Refs for hidden file inputs
  const mainImageInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const replaceMainImageRef = useRef(null)

  // Find product if editing
  useEffect(() => {
    if (!isNew && products.length > 0) {
      const prod = products.find(p => p.id === Number(id))
      if (prod) {
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
      }
    }
  }, [id, isNew, products])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
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

  // ── Image Upload Handlers ──────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const res = await api.upload.uploadImage(file)
      setForm(prev => ({ ...prev, image: res.url }))
      showToast('Main image uploaded successfully!')
    } catch (err) {
      showToast(`Image upload failed: ${err.message}`, 'error')
    } finally {
      setUploadingImage(false)
      // Reset file input so the same file can be selected again
      e.target.value = ''
    }
  }

  const handleReplaceMainImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const res = await api.upload.uploadImage(file)
      setForm(prev => ({ ...prev, image: res.url }))
      showToast('Main image replaced!')
    } catch (err) {
      showToast(`Replace failed: ${err.message}`, 'error')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleGalleryUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadingImage(true)
    try {
      const uploads = await Promise.all(
        Array.from(files).map(file => api.upload.uploadImage(file))
      )
      const urls = uploads.map(res => res.url)
      setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }))
      showToast(`${urls.length} gallery image${urls.length > 1 ? 's' : ''} uploaded!`)
    } catch (err) {
      showToast(`Gallery upload failed: ${err.message}`, 'error')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const removeGalleryImage = (idx) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
  }

  // ── Validation ──────────────────────────────────────────
  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Product name is required'
    if (!form.price && form.price !== 0) newErrors.price = 'Price is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── Form Submit ─────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      showToast('Please fix the highlighted errors', 'error')
      // Switch to the tab with the error
      if (errors.name) setActiveTab('basic')
      else if (errors.price) setActiveTab('pricing')
      return
    }

    setSaving(true)
    const productPayload = {
      ...form,
      price: Number(form.price),
      mrp: form.mrp ? Number(form.mrp) : null,
      stock: Number(form.stock || 0)
    }

    let success = false
    if (!isNew) {
      success = await updateProduct(Number(id), productPayload)
    } else {
      success = await addProduct(productPayload)
    }

    setSaving(false)
    if (success) {
      showToast(isNew ? 'Product created successfully!' : 'Product saved successfully!')
      setTimeout(() => navigate('/admin/products'), 1200)
    } else {
      showToast('Failed to save product. Please try again.', 'error')
    }
  }

  // ── Quantity Variants ───────────────────────────────────
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

  // ── Ingredients ─────────────────────────────────────────
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

  // ── Tags ────────────────────────────────────────────────
  const addTag = (tag) => {
    const trimmed = tag.trim().toLowerCase()
    if (trimmed && !form.tags.includes(trimmed)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, trimmed] }))
    }
  }

  const removeTag = (idx) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }))
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (tagInput.trim()) {
        addTag(tagInput)
        setTagInput('')
      }
    } else if (e.key === 'Backspace' && !tagInput && form.tags.length > 0) {
      removeTag(form.tags.length - 1)
    }
  }

  // ── Reviews ─────────────────────────────────────────────
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
    <div className="admin-product-edit-page">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Hidden file inputs */}
      <input ref={mainImageInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
      <input ref={replaceMainImageRef} type="file" accept="image/*" onChange={handleReplaceMainImage} style={{ display: 'none' }} />
      <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: 'none' }} />

      {/* Top Header */}
      <div className="editor-header-bar">
        <button onClick={() => navigate('/admin/products')} className="editor-back-btn" type="button">
          <FaArrowLeft /> Back to catalog
        </button>
        <h2>{isNew ? 'Create New Farm Staple' : `Editing: ${form.name || 'Product'}`}</h2>
      </div>

      <form onSubmit={handleSubmit} className="editor-main-form">
        {/* Sidebar Tabs */}
        <div className="editor-layout-grid">
          <div className="editor-sidebar-tabs">
            {[
              { id: 'basic', label: 'Basic Info', icon: <FaCircleInfo /> },
              { id: 'pricing', label: 'Pricing & Variants', icon: <FaCoins /> },
              { id: 'media', label: 'Media & Images', icon: <FaImages /> },
              { id: 'nutrition', label: 'Nutrition & Ingredients', icon: <FaLeaf /> },
              { id: 'tags', label: 'Tags & Labels', icon: <FaTag /> },
              { id: 'reviews', label: 'Customer Reviews', icon: <FaComments /> }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`editor-tab-btn${activeTab === tab.id ? ' active' : ''}`}
              >
                {tab.icon} <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form Scrollable Body */}
          <div className="editor-content-area">
            
            {/* ═══════════════════════════════════════════
                1. BASIC INFO TAB
                ═══════════════════════════════════════════ */}
            {activeTab === 'basic' && (
              <div className="admin-form-section">
                <div className="modal-section-title">General Specifications</div>
                <div className="modal-grid-cols-2">
                  <label className={`form-label${errors.name ? ' has-error' : ''}`}>
                    Product Name (Local Language) *
                    <input 
                      value={form.name} 
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value })
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }))
                      }} 
                      placeholder="e.g. A2 Cow Ghee (నేతి)" 
                    />
                    {errors.name && <span className="form-field-error"><FaXmark /> {errors.name}</span>}
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
                    Badge Tag (e.g. Bestseller)
                    <input 
                      value={form.badge} 
                      onChange={(e) => setForm({ ...form, badge: e.target.value })} 
                      placeholder="e.g. Best seller, Cold pressed" 
                    />
                  </label>
                </div>

                <div className="modal-grid-cols-2">
                  <label className="form-label" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '12px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={form.popular} 
                      onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                      style={{ width: '18px', height: '18px' }}
                    />
                    Popular Product / Favorite
                  </label>

                  <label className="form-label">
                    Spice Level (For Pickles/Staples)
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
                    style={{ minHeight: '120px' }}
                  />
                </label>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                2. PRICING & VARIANTS TAB
                ═══════════════════════════════════════════ */}
            {activeTab === 'pricing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="admin-form-section">
                  <div className="modal-section-title">Base Price & Stock</div>
                  <div className="modal-grid-cols-3">
                    <label className={`form-label${errors.price ? ' has-error' : ''}`}>
                      Base Price (₹) *
                      <input 
                        type="number"
                        value={form.price} 
                        onChange={(e) => {
                          setForm({ ...form, price: e.target.value })
                          if (errors.price) setErrors(prev => ({ ...prev, price: '' }))
                        }} 
                        placeholder="e.g. 690" 
                      />
                      {errors.price && <span className="form-field-error"><FaXmark /> {errors.price}</span>}
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
                </div>

                {/* Variants Editor Section */}
                <div className="admin-form-section">
                  <div className="admin-section-header-row">
                    <div className="modal-section-title">Multiple Quantity Variants</div>
                    <button type="button" onClick={addQuantityPrice} className="admin-btn primary small">
                      <FaPlus /> Add Variant
                    </button>
                  </div>
                  
                  {form.quantity_prices.length === 0 ? (
                    <div className="admin-empty-card">
                      <p>No variants defined. This product will default to the base unit size and price.</p>
                    </div>
                  ) : (
                    <div className="admin-variants-list">
                      {form.quantity_prices.map((qp, idx) => (
                        <div key={idx} className="admin-variant-row-card">
                          <div className="variant-field">
                            <span className="variant-field-lbl">Size/Qty</span>
                            <input 
                              value={qp.quantity} 
                              onChange={(e) => updateQuantityPrice(idx, 'quantity', e.target.value)} 
                              placeholder="e.g. 500 ml"
                            />
                          </div>
                          <div className="variant-field">
                            <span className="variant-field-lbl">Price (₹)</span>
                            <input 
                              type="number" 
                              value={qp.price} 
                              onChange={(e) => updateQuantityPrice(idx, 'price', Number(e.target.value))} 
                              placeholder="Price" 
                            />
                          </div>
                          <div className="variant-field">
                            <span className="variant-field-lbl">MRP (₹)</span>
                            <input 
                              type="number" 
                              value={qp.mrp || ''} 
                              onChange={(e) => updateQuantityPrice(idx, 'mrp', e.target.value ? Number(e.target.value) : undefined)} 
                              placeholder="MRP" 
                            />
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeQuantityPrice(idx)}
                            className="variant-delete-btn"
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

            {/* ═══════════════════════════════════════════
                3. MEDIA & IMAGES TAB
                ═══════════════════════════════════════════ */}
            {activeTab === 'media' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Primary Display Image */}
                <div className="admin-form-section">
                  <div className="modal-section-title">Primary Display Image</div>
                  
                  {form.image ? (
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <div className="editor-main-image-preview">
                        <img src={form.image} alt="Main product" />
                        <label 
                          className="editor-image-replace-overlay"
                          onClick={() => replaceMainImageRef.current?.click()}
                        >
                          <FaArrowsRotate />
                          <span>{uploadingImage ? 'Uploading...' : 'Click to Replace'}</span>
                        </label>
                      </div>
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <label className="form-label">
                          Image URL
                          <input 
                            type="text" 
                            value={form.image} 
                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                            placeholder="Paste image URL" 
                          />
                        </label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button 
                            type="button" 
                            className="admin-btn secondary small"
                            onClick={() => replaceMainImageRef.current?.click()}
                            disabled={uploadingImage}
                          >
                            <FaArrowsRotate /> Replace
                          </button>
                          <button 
                            type="button" 
                            className="admin-btn danger small"
                            onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                          >
                            <FaTrash /> Remove
                          </button>
                        </div>
                        {uploadingImage && (
                          <div className="upload-progress-bar">
                            <div className="upload-progress-bar-fill" />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <label 
                      className="editor-image-dropzone"
                      onClick={() => mainImageInputRef.current?.click()}
                    >
                      <FaCloudArrowUp />
                      <span className="dropzone-title">
                        {uploadingImage ? 'Uploading...' : 'Upload Primary Image'}
                      </span>
                      <span className="dropzone-hint">Click to browse or drag & drop · JPG, PNG, WebP up to 5MB</span>
                      {uploadingImage && (
                        <div className="upload-progress-bar" style={{ width: '60%' }}>
                          <div className="upload-progress-bar-fill" />
                        </div>
                      )}
                    </label>
                  )}

                  {!form.image && (
                    <label className="form-label" style={{ marginTop: '8px' }}>
                      Or paste an image URL
                      <input 
                        type="text" 
                        value={form.image} 
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="https://example.com/image.jpg" 
                      />
                    </label>
                  )}
                </div>

                {/* Gallery Images */}
                <div className="admin-form-section">
                  <div className="admin-section-header-row">
                    <div className="modal-section-title">Product Gallery Images</div>
                    <button 
                      type="button" 
                      onClick={() => galleryInputRef.current?.click()} 
                      className="admin-btn primary small"
                      disabled={uploadingImage}
                    >
                      <FaCloudArrowUp /> {uploadingImage ? 'Uploading...' : 'Upload Images'}
                    </button>
                  </div>
                  
                  {form.images.length === 0 ? (
                    <label
                      className="editor-image-dropzone"
                      onClick={() => galleryInputRef.current?.click()}
                    >
                      <FaImages />
                      <span className="dropzone-title">No gallery images yet</span>
                      <span className="dropzone-hint">Upload multiple images to showcase different product angles</span>
                    </label>
                  ) : (
                    <div className="editor-gallery-grid">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="editor-gallery-thumb">
                          {img ? (
                            <img src={img} alt={`Gallery ${idx + 1}`} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>
                              <FaImage style={{ opacity: 0.3, fontSize: '20px' }} />
                            </div>
                          )}
                          <button 
                            type="button"
                            className="gallery-thumb-remove"
                            onClick={() => removeGalleryImage(idx)}
                            title="Remove image"
                          >
                            <FaXmark />
                          </button>
                        </div>
                      ))}
                      {/* Add more tile */}
                      <label 
                        className="editor-gallery-add-tile" 
                        onClick={() => galleryInputRef.current?.click()}
                      >
                        <FaPlus />
                        <span>Add More</span>
                      </label>
                    </div>
                  )}

                  {uploadingImage && (
                    <div className="upload-progress-bar">
                      <div className="upload-progress-bar-fill" />
                    </div>
                  )}
                </div>

                {/* Product Details & Lifespan */}
                <div className="admin-form-section">
                  <div className="modal-section-title">Product Details & Lifespan</div>
                  <div className="modal-grid-cols-2">
                    <label className="form-label">
                      Shelf Life (e.g. 5 days fresh, 6 months)
                      <input 
                        value={form.shelf_life} 
                        onChange={(e) => setForm({ ...form, shelf_life: e.target.value })} 
                        placeholder="e.g. 7 days fresh, 30 days" 
                      />
                    </label>

                    <label className="form-label">
                      Pack Serves (e.g. 2-3 people, family pack)
                      <input 
                        value={form.serves} 
                        onChange={(e) => setForm({ ...form, serves: e.target.value })} 
                        placeholder="e.g. 3-4 persons, family size" 
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                4. NUTRITION & INGREDIENTS TAB
                ═══════════════════════════════════════════ */}
            {activeTab === 'nutrition' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="admin-form-section">
                  <div className="modal-section-title">Nutrition Facts (per 100g)</div>
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
                      Dietary Fiber
                      <input 
                        value={form.nutrition.fiber} 
                        onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, fiber: e.target.value } })} 
                        placeholder="e.g. 0.5 g" 
                      />
                    </label>
                  </div>
                </div>

                {/* Ingredients Grid */}
                <div className="admin-form-section">
                  <div className="admin-section-header-row">
                    <div className="modal-section-title">Ingredients Sourced</div>
                    <button type="button" onClick={addIngredient} className="admin-btn primary small">
                      <FaPlus /> Add Ingredient
                    </button>
                  </div>
                  
                  {form.ingredients.length === 0 ? (
                    <div className="admin-empty-card">
                      <p>No ingredients listed.</p>
                    </div>
                  ) : (
                    <div className="admin-ingredients-grid">
                      {form.ingredients.map((ing, idx) => (
                        <div key={idx} className="admin-ingredient-card">
                          <input 
                            value={ing} 
                            onChange={(e) => updateIngredient(idx, e.target.value)} 
                            placeholder="Ingredient Name" 
                          />
                          <button 
                            type="button" 
                            onClick={() => removeIngredient(idx)}
                            className="ingredient-delete-btn"
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

            {/* ═══════════════════════════════════════════
                5. TAGS & LABELS TAB
                ═══════════════════════════════════════════ */}
            {activeTab === 'tags' && (
              <div className="admin-form-section">
                <div className="modal-section-title">Product Tags & Labels</div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                  Tags help customers discover your products. Add relevant tags like "organic", "sugar-free", "farm-fresh", etc.
                </p>
                
                <div className="editor-tags-container">
                  {form.tags.map((tag, idx) => (
                    <span key={idx} className="editor-tag-chip">
                      {tag}
                      <button type="button" onClick={() => removeTag(idx)} title="Remove tag">
                        <FaXmark />
                      </button>
                    </span>
                  ))}
                  <input
                    className="editor-tag-input-inline"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={form.tags.length === 0 ? 'Type a tag and press Enter...' : 'Add more...'}
                  />
                </div>
                <p className="editor-tags-hint">
                  Press <strong>Enter</strong> or <strong>comma (,)</strong> to add a tag. Press <strong>Backspace</strong> to remove the last tag.
                </p>

                {/* Quick-add popular tags */}
                <div style={{ marginTop: '16px' }}>
                  <div className="modal-section-title" style={{ fontSize: '11px' }}>Quick Add Common Tags</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                    {['vegetarian', 'organic', 'farm-fresh', 'sugar-free', 'gluten-free', 'daily-essential', 'premium', 'healthy', 'protein-rich', 'festive-special', 'cold-pressed', 'hand-made'].map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        disabled={form.tags.includes(tag)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          border: '1px solid var(--border-light)',
                          background: form.tags.includes(tag) ? 'var(--bg-green-soft)' : '#fff',
                          color: form.tags.includes(tag) ? 'var(--primary-green)' : 'var(--text-muted)',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: form.tags.includes(tag) ? 'default' : 'pointer',
                          opacity: form.tags.includes(tag) ? 0.5 : 1,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {form.tags.includes(tag) ? '✓ ' : '+ '}{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════
                6. REVIEWS TAB
                ═══════════════════════════════════════════ */}
            {activeTab === 'reviews' && (
              <div className="admin-form-section">
                <div className="admin-section-header-row">
                  <div className="modal-section-title">Customer Reviews & Testimonials</div>
                  <button type="button" onClick={addReview} className="admin-btn primary small">
                    <FaPlus /> Add Review
                  </button>
                </div>

                {form.reviews.length === 0 ? (
                  <div className="admin-empty-card">
                    <p>No reviews added yet.</p>
                  </div>
                ) : (
                  <div className="admin-reviews-editor-list">
                    {form.reviews.map((rev, idx) => (
                      <div key={idx} className="admin-review-editor-card">
                        <div className="review-meta-row">
                          <div className="review-meta-field">
                            <span className="review-meta-field span">Customer Name</span>
                            <input 
                              value={rev.name} 
                              onChange={(e) => updateReview(idx, 'name', e.target.value)} 
                              placeholder="Reviewer Name" 
                            />
                          </div>
                          <div className="review-meta-field">
                            <span className="review-meta-field span">Rating Stars</span>
                            <select 
                              value={rev.rating} 
                              onChange={(e) => updateReview(idx, 'rating', Number(e.target.value))}
                            >
                              {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                            </select>
                          </div>
                          <div className="review-meta-field">
                            <span className="review-meta-field span">Review Date</span>
                            <input 
                              type="date" 
                              value={rev.date} 
                              onChange={(e) => updateReview(idx, 'date', e.target.value)} 
                            />
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeReview(idx)}
                            className="review-delete-btn"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <div className="review-comment-field">
                          <span className="review-comment-field span">Comment Message</span>
                          <textarea 
                            value={rev.comment} 
                            onChange={(e) => updateReview(idx, 'comment', e.target.value)} 
                            placeholder="What does the customer say?"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="editor-footer-actions">
          <button className="admin-btn primary large-btn" type="submit" disabled={saving}>
            <FaCheck /> {saving ? 'Saving...' : (isNew ? 'Create New Product' : 'Save Product Details')}
          </button>
          <button className="admin-btn secondary large-btn" onClick={() => navigate('/admin/products')} type="button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProductEdit
