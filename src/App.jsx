import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useLocation, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'
import './styles/premium.css'
import Header from './components/Header'
import AdminHeader from './components/AdminHeader'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import { useProducts } from './hooks/useProducts'
import ProductDetail from './pages/ProductDetail'
import Services from './pages/Services'
import About from './pages/About'
import Contact from './pages/Contact'
import PolicyPage from './pages/PolicyPage'
import Auth from './pages/Auth'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductEdit from './pages/admin/AdminProductEdit'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminReports from './pages/admin/AdminReports'

import AccountLayout from './pages/account/AccountLayout'
import CustomerProfile from './pages/account/CustomerProfile'
import CustomerOrders from './pages/account/CustomerOrders'
import CustomerTracking from './pages/account/CustomerTracking'
import CustomerSupport from './pages/account/CustomerSupport'

import { whatsAppNumber } from './data/storeData'
import { api } from './api'

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'all'
  const setSelectedCategory = (category) => {
    if (category === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', category)
    }
    setSearchParams(searchParams)
  }
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mahesh_cart') || '[]')
    } catch {
      return []
    }
  })
  const [signedIn, setSignedIn] = useState(!!localStorage.getItem('mahesh_token'))
  const [user, setUser] = useState(null)
  const { products: adminProducts, setProducts: setAdminProducts, loading: loadingProducts, invalidate: invalidateProducts } = useProducts()
  const location = useLocation()

  // Save cart to localStorage when changed
  useEffect(() => {
    localStorage.setItem('mahesh_cart', JSON.stringify(cart))
  }, [cart])

  // Restore session / fetch user profile on load or auth change
  useEffect(() => {
    const token = localStorage.getItem('mahesh_token')
    if (token) {
      api.auth.getProfile()
        .then((profile) => {
          setUser(profile)
          setSignedIn(true)
        })
        .catch(() => {
          localStorage.removeItem('mahesh_token')
          setUser(null)
          setSignedIn(false)
        })
    } else {
      setUser(null)
      setSignedIn(false)
    }
  }, [signedIn])



  const filteredProducts = useMemo(() => {
    if (!adminProducts) return []
    return selectedCategory === 'all'
      ? adminProducts
      : adminProducts.filter((product) => product.category === selectedCategory)
  }, [adminProducts, selectedCategory])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const cartIds = useMemo(() => cart.map((item) => item.id), [cart])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 100)

    return () => clearTimeout(timer)
  }, [location.key])

  const addToCart = (product, selectedVariant = null) => {
    setCart((items) => {
      const cartItemId = selectedVariant 
        ? `${product.id}-${selectedVariant.quantity.replace(/\s+/g, '')}` 
        : `${product.id}`;

      const itemPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);
      const itemUnit = selectedVariant ? selectedVariant.quantity : product.unit;

      const existing = items.find((item) => (item.cartItemId || item.id) === cartItemId)
      if (existing) {
        return items.map((item) => (item.cartItemId || item.id) === cartItemId ? { ...item, qty: item.qty + 1 } : item)
      }
      return [...items, { 
        ...product, 
        cartItemId,
        price: itemPrice, 
        unit: itemUnit, 
        qty: 1 
      }]
    })
  }

  const redirectInquiry = (message) => {
    window.open(`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const addProduct = async (newProduct) => {
    try {
      const res = await api.products.create(newProduct)
      setAdminProducts((items) => [...items, res])
      invalidateProducts()
      return true
    } catch (err) {
      alert(`Error adding product: ${err.message}`)
      return false
    }
  }

  const updateProduct = async (id, updatedProductData) => {
    try {
      const res = await api.products.update(id, updatedProductData)
      setAdminProducts((items) => items.map((item) => (
        item.id === id ? res : item
      )))
      invalidateProducts()
      return true
    } catch (err) {
      alert(`Error updating product: ${err.message}`)
      return false
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return false
    try {
      await api.products.delete(id)
      setAdminProducts((items) => items.filter((item) => item.id !== id))
      invalidateProducts()
      return true
    } catch (err) {
      alert(`Error deleting product: ${err.message}`)
      return false
    }
  }

  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="app">
      {isAdminRoute ? (
        <AdminHeader user={user} setSignedIn={setSignedIn} />
      ) : (
        <Header signedIn={signedIn} user={user} cartCount={cart.length} setSignedIn={setSignedIn} />
      )}
      <main>
        {loadingProducts ? (
          <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', color: '#17351f' }}>
            <div>
              <p style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>Loading Farm Fresh Products...</p>
              <div className="spinner" style={{ margin: '16px auto', border: '4px solid #ccdcc2', borderTop: '4px solid #364a38', borderRadius: '50%', width: '36px', height: '36px', animation: 'spin 1s linear infinite' }}></div>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="page-motion-shell"
              exit={{ opacity: 0, y: 12 }}
              initial={{ opacity: 0, y: 18 }}
              key={location.pathname}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Routes location={location}>
                <Route path="/" element={<Home products={adminProducts} addToCart={addToCart} redirectInquiry={redirectInquiry} cartIds={cartIds} />} />
                <Route path="/products" element={<Products products={filteredProducts} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} addToCart={addToCart} cartIds={cartIds} />} />
                <Route path="/product/:slug" element={<ProductDetail products={adminProducts} addToCart={addToCart} cartIds={cartIds} cart={cart} />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact redirectInquiry={redirectInquiry} />} />
                <Route path="/policies/:policySlug" element={<PolicyPage />} />
                <Route path="/signin" element={<Auth mode="signin" setSignedIn={setSignedIn} />} />
                <Route path="/signup" element={<Auth mode="signup" setSignedIn={setSignedIn} />} />
                <Route path="/cart" element={<Cart cart={cart} setCart={setCart} cartTotal={cartTotal} />} />
                <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} cartTotal={cartTotal} user={user} />} />
                <Route path="/admin" element={<AdminLayout user={user} />}>
                  <Route index element={<AdminDashboard products={adminProducts} redirectInquiry={redirectInquiry} />} />
                  <Route path="dashboard" element={<AdminDashboard products={adminProducts} redirectInquiry={redirectInquiry} />} />
                  <Route path="products" element={<AdminProducts products={adminProducts} deleteProduct={deleteProduct} />} />
                  <Route path="products/new" element={<AdminProductEdit products={adminProducts} addProduct={addProduct} />} />
                  <Route path="products/edit/:id" element={<AdminProductEdit products={adminProducts} updateProduct={updateProduct} />} />
                  <Route path="orders" element={<AdminOrders redirectInquiry={redirectInquiry} />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="reports" element={<AdminReports />} />
                </Route>
                <Route path="/account" element={<AccountLayout user={user} />}>
                  <Route index element={<CustomerProfile user={user} setUser={setUser} />} />
                  <Route path="profile" element={<CustomerProfile user={user} setUser={setUser} />} />
                  <Route path="my-orders" element={<CustomerOrders />} />
                  <Route path="tracking" element={<CustomerTracking />} />
                  <Route path="support" element={<CustomerSupport />} />
                </Route>
              </Routes>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
