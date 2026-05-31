import { motion } from 'framer-motion'
import './TopTicker.css'

function TopTicker() {
  const messages = [
    'Pure Milk delivered by 7 AM',
    'Wood Pressed Oils for a Healthy Life',
    'Fresh Farm Vegetables Every Day',
    '100% Traditional & Chemical Free',
    'Free Delivery on Orders above ₹500'
  ]

  return (
    <div className="top-ticker-wrapper">
      <motion.div 
        className="top-ticker-content"
        animate={{ x: [0, -1000] }}
        transition={{ 
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
      >
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="ticker-item">{msg}</span>
        ))}
      </motion.div>
    </div>
  )
}

export default TopTicker
