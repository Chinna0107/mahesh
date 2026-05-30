import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaGoogle, FaLeaf, FaLock, FaPhone, FaUser, FaEnvelope, FaKey } from 'react-icons/fa6'
import { api, API_BASE_URL } from '../api'
import './Auth.css'

function Auth({ mode, setSignedIn }) {
  const isSignup = mode === 'signup'
  const navigate = useNavigate()

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [identifier, setIdentifier] = useState('') // For Sign In (email or phone)
  const [password, setPassword] = useState('')
  
  // Verification states
  const [showVerification, setShowVerification] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleGoogleLoginSuccess = async (response) => {
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Google Sign-In failed')
      }
      localStorage.setItem('mahesh_token', data.token)
      setSignedIn(true)
      navigate('/')
    } catch (err) {
      console.error('❌ Google Sign-In error:', err.message)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com",
          callback: handleGoogleLoginSuccess
        })
        const btnContainer = document.getElementById("google-signin-btn")
        if (btnContainer) {
          window.google.accounts.id.renderButton(
            btnContainer,
            { theme: "outline", size: "large", width: "100%" }
          )
        }
      }
    }

    if (!document.getElementById("google-gsi-client")) {
      const script = document.createElement("script")
      script.id = "google-gsi-client"
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      script.onload = initGoogle
      document.body.appendChild(script)
    } else {
      initGoogle()
    }
  }, [isSignup])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      if (isSignup) {
        if (!name || !password || !email) {
          throw new Error('Please fill in Name, Email Address, and Password.')
        }
        const res = await api.auth.signup(name, email, phone || null, password)
        setVerificationEmail(email)
        setShowVerification(true)
        setSuccess('A 6-digit verification code has been dispatched to your email address.')
      } else {
        if (!identifier || !password) {
          throw new Error('Please enter your email/phone and password.')
        }
        try {
          const res = await api.auth.signin(identifier, password)
          localStorage.setItem('mahesh_token', res.token)
          setSignedIn(true)
          if (res.customer?.role === 'admin') {
            navigate('/admin')
          } else {
            navigate('/')
          }
        } catch (err) {
          // If the customer account is registered but unverified, route to OTP verification
          if (err.message.includes('verify your email')) {
            const result = await fetch(`${API_BASE_URL}/auth/signin`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ identifier, password })
            });
            const data = await result.json();
            if (data.email) {
              setVerificationEmail(data.email);
              setShowVerification(true);
              setSuccess('Please complete verification. Enter the code sent to your email.');
              return;
            }
          }
          throw err;
        }
      }
    } catch (err) {
      console.error('❌ Auth Error:', err.message)
      setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      if (!otpCode || otpCode.length !== 6) {
        throw new Error('Please enter a valid 6-digit OTP code.')
      }
      const res = await api.auth.verifyEmail(verificationEmail, otpCode)
      localStorage.setItem('mahesh_token', res.token)
      setSignedIn(true)
      alert('🎉 Email verified successfully! Welcome to Mahesh.')
      
      if (res.customer?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      console.error('❌ Verification Error:', err.message)
      setError(err.message || 'Email verification failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (showVerification) {
    return (
      <section className="auth-page">
        <form className="auth-card" onSubmit={handleVerifyOtp}>
          <span className="auth-mark"><FaLeaf /></span>
          <p className="eyebrow">Email Verification</p>
          <h1>Enter Verification Code</h1>
          <p style={{ fontSize: '0.9rem', color: '#6d8471', textAlign: 'center', marginBottom: '20px', lineHeight: '1.4' }}>
            We sent a 6-digit code to <strong>{verificationEmail}</strong>. Please enter it below:
          </p>

          {error && (
            <div className="auth-error-banner" style={{ background: '#fce8e6', border: '1px solid #ea4335', color: '#c5221f', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px', width: '100%', boxSizing: 'border-box' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: '#e6f4ea', border: '1px solid #34a853', color: '#137333', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
              {success}
            </div>
          )}

          <label>
            <FaKey />
            <input 
              placeholder="6-Digit OTP Code" 
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required 
              style={{ letterSpacing: otpCode ? '4px' : 'normal', textAlign: otpCode ? 'center' : 'left', fontSize: otpCode ? '1.2rem' : 'inherit', fontWeight: otpCode ? 'bold' : 'normal' }}
            />
          </label>

          <button className="primary" disabled={submitting} type="submit">
            {submitting ? 'Verifying OTP...' : 'Verify & Sign In'}
          </button>

          <button 
            className="ghost" 
            onClick={() => { setShowVerification(false); setError(''); setSuccess(''); }} 
            type="button" 
            style={{ width: '100%', marginTop: '10px' }}
          >
            ← Back to Sign In
          </button>
        </form>
      </section>
    )
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <span className="auth-mark"><FaLeaf /></span>
        <p className="eyebrow">{isSignup ? 'Create Account' : 'Welcome Back'}</p>
        <h1>{isSignup ? 'Sign up for Mahesh' : 'Sign in to continue'}</h1>
        
        {error && (
          <div className="auth-error-banner" style={{ background: '#fce8e6', border: '1px solid #ea4335', color: '#c5221f', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px', width: '100%', boxSizing: 'border-box' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#e6f4ea', border: '1px solid #34a853', color: '#137333', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px', width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
            {success}
          </div>
        )}

        {isSignup ? (
          <>
            <label>
              <FaUser />
              <input 
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </label>
            <label>
              <FaEnvelope />
              <input 
                placeholder="Email Address" 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </label>
            <label>
              <FaPhone />
              <input 
                placeholder="Phone Number (optional)" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
            </label>
          </>
        ) : (
          <label>
            <FaPhone />
            <input 
              placeholder="Phone Number or Email" 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              required 
            />
          </label>
        )}

        <label>
          <FaLock />
          <input 
            placeholder="Password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </label>
        
        <button 
          className="primary" 
          disabled={submitting} 
          type="submit"
        >
          {submitting ? 'Authenticating...' : isSignup ? 'Sign Up' : 'Sign In'}
        </button>
        
        <div id="google-signin-btn" style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', width: '100%', minHeight: '40px' }} />
        
        <Link 
          className="link-button" 
          to={isSignup ? '/signin' : '/signup'} 
          style={{ textDecoration: 'none', textAlign: 'center', display: 'block', marginTop: '15px', color: '#364a38', fontWeight: 'bold' }}
        >
          {isSignup ? 'Already have an account? Sign In' : 'Create a new account? Sign Up'}
        </Link>
      </form>
    </section>
  )
}

export default Auth
