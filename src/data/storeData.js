export const whatsAppNumber = '919876543210'

export const navItems = ['home', 'products', 'services', 'about', 'contact']

export const categories = [
  { id: 'milk', name: 'Milk', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=700&q=80' },
  { id: 'flowers', name: 'Flowers', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=80' },
  { id: 'oils', name: 'Wood Pressed Oils', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80' },
  { id: 'vegetables', name: 'Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80' },
]

export const productsSeed = [
  { id: 1, name: 'A2 Farm Fresh Milk', category: 'milk', price: 78, unit: '1 litre', badge: 'Daily fresh', stock: 42, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80', description: 'Naturally sourced milk delivered chilled every morning from trusted local farms.' },
  { id: 2, name: 'Desi Cow Ghee', category: 'milk', price: 690, unit: '500 ml', badge: 'Best seller', stock: 18, image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=700&q=80', description: 'Slow-cooked traditional ghee with rich aroma and clean ingredients.' },
  { id: 3, name: 'Marigold Puja Flowers', category: 'flowers', price: 120, unit: 'bundle', badge: 'Fresh cut', stock: 30, image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=700&q=80', description: 'Bright, fresh flowers packed for homes, temples, and celebrations.' },
  { id: 4, name: 'Wood Pressed Groundnut Oil', category: 'oils', price: 310, unit: '1 litre', badge: 'Cold pressed', stock: 26, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=80', description: 'Traditional wood pressed oil with full-bodied taste and no chemical refining.' },
  { id: 5, name: 'Seasonal Veggie Basket', category: 'vegetables', price: 280, unit: '3 kg', badge: 'Farm pack', stock: 35, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80', description: 'A practical mix of fresh vegetables selected for everyday home cooking.' },
  { id: 6, name: 'Wood Pressed Sesame Oil', category: 'oils', price: 360, unit: '1 litre', badge: 'Pure', stock: 16, image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=700&q=80', description: 'Deep, nutty oil made with slow pressing for authentic flavor.' },
]

export const orders = [
  { id: 'ME1028', customer: 'Anjali Rao', phone: '919000111222', total: 1048, status: 'Packing', items: 'Milk, Ghee, Veggie Basket' },
  { id: 'ME1027', customer: 'Rahul Varma', phone: '919000111223', total: 430, status: 'Out for delivery', items: 'Groundnut Oil' },
  { id: 'ME1026', customer: 'Meera K', phone: '919000111224', total: 980, status: 'Delivered', items: 'Daily Milk Plan' },
]

export const customers = [
  { name: 'Anjali Rao', orders: 14, spent: 18420, city: 'Hyderabad' },
  { name: 'Rahul Varma', orders: 8, spent: 9630, city: 'Vijayawada' },
  { name: 'Meera K', orders: 21, spent: 28600, city: 'Guntur' },
  { name: 'Prakash N', orders: 5, spent: 4120, city: 'Warangal' },
]
