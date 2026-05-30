import { useState, useEffect } from 'react'
import { api } from '../api'

const CACHE_KEY = 'mahesh_products_cache'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

let memoryCache = null
let inflight = null

function getLocalCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function setLocalCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

export function useProducts() {
  const [products, setProducts] = useState(() => {
    if (memoryCache && Date.now() - memoryCache.ts < CACHE_TTL) return memoryCache.data
    return []
  })
  const [loading, setLoading] = useState(() => {
    return !(memoryCache && Date.now() - memoryCache.ts < CACHE_TTL)
  })

  useEffect(() => {
    if (memoryCache && Date.now() - memoryCache.ts < CACHE_TTL) {
      setProducts(memoryCache.data)
      setLoading(false)
      return
    }

    const local = getLocalCache()
    if (local && local.length > 0) {
      setProducts(local)
      setLoading(false)
    }

    if (!inflight) {
      inflight = api.products.getAll()
        .then((data) => {
          if (data && data.length > 0) {
            memoryCache = { data, ts: Date.now() }
            setLocalCache(data)
          }
          return data
        })
        .finally(() => {
          inflight = null
        })
    }

    inflight
      .then((data) => {
        if (data && data.length > 0) {
          setProducts(data)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const invalidate = () => {
    memoryCache = null
    try {
      localStorage.removeItem(CACHE_KEY)
    } catch {}
  }

  return { products, loading, invalidate }
}
