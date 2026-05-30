import { useState, useEffect } from 'react'
import { api } from '../../api'
import '../Account.css'

function CustomerSupport() {
  const [category, setCategory] = useState('Daily Milk subscription delivery issue')
  const [message, setMessage] = useState('')
  const [tickets, setTickets] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load ticket history on mount
  useEffect(() => {
    loadTicketHistory()
  }, [])

  const loadTicketHistory = () => {
    setLoadingHistory(true)
    api.auth.getSupportTickets()
      .then((res) => {
        setTickets(res)
        setLoadingHistory(false)
      })
      .catch((err) => {
        console.error('Failed to load tickets:', err.message)
        setLoadingHistory(false)
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await api.auth.submitSupportTicket(category, message)
      setSuccess('Your support ticket has been submitted. Our team will review it shortly!')
      setMessage('')
      loadTicketHistory() // Reload history to see the new ticket
    } catch (err) {
      setError(err.message || 'Failed to submit support ticket.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <div className="admin-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 12px', color: '#17351f', fontSize: '1.4rem' }}>Customer Helpdesk</h3>
        <p style={{ marginBottom: '20px', color: '#6d8471' }}>Submit a ticket directly to our helpline. We typically resolve issues within 2 hours.</p>
        
        {error && (
          <div style={{ background: '#fce8e6', border: '1px solid #ea4335', color: '#c5221f', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ background: '#e6f4ea', border: '1px solid #34a853', color: '#137333', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px' }}>
            {success}
          </div>
        )}

        <form style={{ display: 'grid', gap: '14px', maxWidth: '540px' }} onSubmit={handleSubmit}>
          <label style={{ display: 'grid', gap: '6px', fontWeight: '800', color: '#364a38' }}>
            Help Category
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{ padding: '12px', border: '1px solid #ccdcc2', borderRadius: '16px', background: '#fbfff8', fontSize: '0.95rem' }}
            >
              <option>Daily Milk subscription delivery issue</option>
              <option>Vegetables freshness issue</option>
              <option>Incorrect order details / payment billing</option>
              <option>General query / Delivery area request</option>
            </select>
          </label>
          <label style={{ display: 'grid', gap: '6px', fontWeight: '800', color: '#364a38' }}>
            Message
            <textarea 
              placeholder="Describe your issue or request here..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ minHeight: '120px', padding: '12px', border: '1px solid #ccdcc2', borderRadius: '16px', fontSize: '0.95rem', fontFamily: 'inherit' }}
              required
            ></textarea>
          </label>
          <button className="primary" style={{ justifySelf: 'start' }} type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Support Ticket'}
          </button>
        </form>
      </div>

      <div className="admin-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px', color: '#17351f', fontSize: '1.2rem' }}>Past Tickets History</h3>
        {loadingHistory ? (
          <p style={{ color: '#6d8471' }}>Loading support history...</p>
        ) : tickets.length === 0 ? (
          <p style={{ color: '#6d8471' }}>No past support tickets found.</p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {tickets.map((ticket) => (
              <div 
                key={ticket.id} 
                style={{ 
                  padding: '14px', 
                  border: '1px solid #ccdcc2', 
                  borderRadius: '16px', 
                  background: '#fbfff8',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'grid', gap: '4px' }}>
                  <strong style={{ color: '#17351f', fontSize: '0.95rem' }}>{ticket.category}</strong>
                  <span style={{ fontSize: '0.9rem', color: '#364a38' }}>{ticket.message}</span>
                  <small style={{ color: '#6d8471', fontSize: '0.8rem' }}>
                    Submitted: {new Date(ticket.created_at).toLocaleDateString('en-IN')}
                  </small>
                </div>
                <span 
                  className={`status-badge ${ticket.status.toLowerCase()}`}
                  style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    background: ticket.status === 'open' ? '#fff3cd' : '#d4edda',
                    color: ticket.status === 'open' ? '#856404' : '#155724'
                  }}
                >
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerSupport
