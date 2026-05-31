import { FaLeaf, FaSun, FaCheckDouble, FaSeedling } from 'react-icons/fa6'
import { ScrollReveal } from './Shared'
import './TrustBadges.css'

function TrustBadges() {
  const badges = [
    { icon: <FaSeedling />, title: '100% Organic', desc: 'No chemicals or synthetic pesticides.' },
    { icon: <FaSun />, title: 'Daily Fresh', desc: 'Harvested and delivered within hours.' },
    { icon: <FaCheckDouble />, title: 'Purity Checked', desc: 'Strict multi-level quality controls.' },
    { icon: <FaLeaf />, title: 'Farm to Home', desc: 'Sourced directly from local farmers.' }
  ]

  return (
    <ScrollReveal className="global-trust-badges">
      <div className="trust-badges-container">
        {badges.map((badge, idx) => (
          <div className="global-trust-item" key={idx}>
            <div className="trust-icon-wrapper">{badge.icon}</div>
            <div className="trust-text">
              <h4>{badge.title}</h4>
              <p>{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  )
}

export default TrustBadges
