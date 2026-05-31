import { motion } from 'framer-motion'

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
}

export function ScrollReveal({ children, className = '', delay = 0, style = {} }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -50px 0px" }}
      variants={{
        hidden: revealVariants.hidden,
        visible: {
          ...revealVariants.visible,
          transition: { ...revealVariants.visible.transition, delay }
        }
      }}
      style={style}
    >
      {children}
    </motion.div>
  )
}
