import { useState } from 'react'
import { api } from '../../api'
import '../Account.css'

function CustomerProfile({ user, setUser }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [address, setAddress] = useState(user?.address || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updatedProfile = await api.auth.updateProfile(name, address)
      setUser(updatedProfile)
      setSuccess('Profile updated successfully!')
      setEditing(false)
    } catch (err) {
      setError(err.message || 'Failed to update profile settings.')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="admin-card" style={{ padding: '24px', color: '#17351f' }}>
        <p>Loading profile details...</p>
      </div>
    )
  }

  return (
    <div className="admin-card" style={{ padding: '24px', display: 'grid', gap: '20px' }}>
      <h3 style={{ margin: 0, color: '#17351f', fontSize: '1.4rem' }}>Account Profile</h3>
      
      {error && (
        <div style={{ background: '#fce8e6', border: '1px solid #ea4335', color: '#c5221f', padding: '12px', borderRadius: '12px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ background: '#e6f4ea', border: '1px solid #34a853', color: '#137333', padding: '12px', borderRadius: '12px', fontSize: '0.9rem' }}>
          {success}
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '14px' }}>
          <label style={{ display: 'grid', gap: '6px', fontWeight: 'bold', color: '#364a38' }}>
            Full Name
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={{ padding: '10px', border: '1px solid #ccdcc2', borderRadius: '12px' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '6px', fontWeight: 'bold', color: '#364a38' }}>
            Email Address (Cannot be changed)
            <input 
              value={user.email || 'Not provided'} 
              disabled 
              style={{ padding: '10px', border: '1px solid #ccdcc2', borderRadius: '12px', background: '#f0f5ec', color: '#6d8471' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '6px', fontWeight: 'bold', color: '#364a38' }}>
            Phone Number (Cannot be changed)
            <input 
              value={user.phone || 'Not provided'} 
              disabled 
              style={{ padding: '10px', border: '1px solid #ccdcc2', borderRadius: '12px', background: '#f0f5ec', color: '#6d8471' }}
            />
          </label>

          <label style={{ display: 'grid', gap: '6px', fontWeight: 'bold', color: '#364a38' }}>
            Default Delivery Address
            <textarea 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Enter your standard shipping address" 
              required 
              style={{ padding: '10px', border: '1px solid #ccdcc2', borderRadius: '12px', minHeight: '80px', fontFamily: 'inherit' }}
            />
          </label>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="primary small" disabled={saving} type="submit">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className="ghost small" onClick={() => { setEditing(false); setError(''); }} type="button" disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="profile-grid">
            <div className="profile-field">
              <span>Full Name</span>
              <p>{user.name || 'Not provided'}</p>
            </div>
            <div className="profile-field">
              <span>Phone Number</span>
              <p>{user.phone || 'Not provided'}</p>
            </div>
            <div className="profile-field">
              <span>Email Address</span>
              <p>{user.email || 'Not provided'}</p>
            </div>
            <div className="profile-field">
              <span>Default Address</span>
              <p>{user.address || 'No address set yet. Click Edit to add your default delivery address.'}</p>
            </div>
          </div>
          <button 
            className="primary small" 
            style={{ justifySelf: 'start' }} 
            onClick={() => {
              setName(user.name || '')
              setAddress(user.address || '')
              setEditing(true)
            }} 
            type="button"
          >
            Edit Profile Settings
          </button>
        </>
      )}
    </div>
  )
}

export default CustomerProfile
