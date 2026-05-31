export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to make HTTP fetch requests with auto JWT header injection
 */
async function request(path, options = {}) {
  const token = localStorage.getItem('mahesh_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  // Authentication & Profile Endpoints
  auth: {
    signin: (identifier, password) => 
      request('/auth/signin', { method: 'POST', body: { identifier, password } }),
    
    signup: (name, email, phone, password) => 
      request('/auth/signup', { method: 'POST', body: { name, email, phone, password } }),
    
    getProfile: () => 
      request('/auth/profile', { method: 'GET' }),
    
    updateProfile: (name, address) => 
      request('/auth/profile', { method: 'PUT', body: { name, address } }),
    
    getCustomers: () => 
      request('/auth/customers', { method: 'GET' }),
      
    getStats: () => 
      request('/auth/stats', { method: 'GET' }),
      
    submitSupportTicket: (category, message) =>
      request('/auth/support', { method: 'POST', body: { category, message } }),
      
    getSupportTickets: () =>
      request('/auth/support', { method: 'GET' }),

    sendOtp: (email) =>
      request('/auth/send-otp', { method: 'POST', body: { email } }),
  },

  // Products Endpoints
  products: {
    getAll: (category) => {
      const query = category && category !== 'all' ? `?category=${category}` : '';
      return request(`/products${query}`, { method: 'GET' });
    },
    
    getById: (id) => 
      request(`/products/${id}`, { method: 'GET' }),
    
    create: (product) => 
      request('/products', { method: 'POST', body: product }),
    
    update: (id, product) => 
      request(`/products/${id}`, { method: 'PUT', body: product }),
    
    delete: (id) => 
      request(`/products/${id}`, { method: 'DELETE' }),
  },

  // Orders Endpoints
  orders: {
    getMyOrders: () => 
      request('/orders/my', { method: 'GET' }),
    
    getAllOrders: (status) => {
      const query = status ? `?status=${status}` : '';
      return request(`/orders${query}`, { method: 'GET' });
    },
    
    updateStatus: (id, status) => 
      request(`/orders/${id}/status`, { method: 'PUT', body: { status } }),
  },

  // Payment & Checkout Endpoints
  payment: {
    createOrder: (cart, address, total) => 
      request('/payment/create-order', { method: 'POST', body: { cart, address, total } }),
    
    verifyPayment: (payload) => 
      request('/payment/verify', { method: 'POST', body: payload }),
  },

  // Cloudinary File Upload Endpoints
  upload: {
    uploadImage: (file) => {
      const token = localStorage.getItem('mahesh_token');
      const formData = new FormData();
      formData.append('image', file);
      
      return fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }
        return data;
      });
    }
  }
};
