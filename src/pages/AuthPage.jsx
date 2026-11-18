
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import './AuthPage.css'

const API = 'https://veyra-travel.onrender.com/api/users'

export default function AuthPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    })
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
    setForm({ name: '', email: '', password: '' })
    setShowPassword(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = mode === 'login' ? 'login' : 'signup'

      const response = await fetch(`${API}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok || !data.token) {
        throw new Error(data.message || 'Something went wrong.')
      }

      sessionStorage.setItem('veyra_customer_token', data.token)
      sessionStorage.setItem(
        'veyra_customer',
        JSON.stringify(data.user)
      )

      navigate('/account')
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="veyra-auth-page">
      <section className="veyra-auth-visual">
        <div className="veyra-auth-visual-overlay" />

        <Link to="/" className="veyra-auth-logo">
          VEYRA<span>.</span>
        </Link>

        <div className="veyra-auth-quote">
          <p>THE ART OF GOING SOMEWHERE</p>
          <h1>
            Every journey
            <br />
            begins with
            <br />
            <em>a feeling.</em>
          </h1>
          <span>Discover places worth remembering.</span>
        </div>

        <div className="veyra-auth-photo-credit">
          CURATED JOURNEYS · MEANINGFUL MOMENTS
        </div>
      </section>

      <section className="veyra-auth-content">
        <Link to="/" className="veyra-auth-back">
          <ArrowLeft size={17} />
          Back to exploring
        </Link>

        <div className="veyra-auth-form-container">
          <p className="veyra-auth-eyebrow">
            {mode === 'login' ? 'WELCOME BACK' : 'BEGIN YOUR JOURNEY'}
          </p>

          <h2>
            {mode === 'login'
              ? 'Your next chapter awaits.'
              : 'A world of possibilities.'}
          </h2>

          <p className="veyra-auth-description">
            {mode === 'login'
              ? 'Sign in to continue exploring with Veyra.'
              : 'Create your account and start collecting extraordinary places.'}
          </p>

          <div className="veyra-auth-tabs">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => switchMode('login')}
            >
              Sign in
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => switchMode('signup')}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="veyra-auth-form">
            {mode === 'signup' && (
              <div className="veyra-auth-field">
                <label htmlFor="customer-name">Full name</label>
                <input
                  id="customer-name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                  minLength={2}
                  maxLength={80}
                  value={form.name}
                  onChange={update}
                  required
                />
              </div>
            )}

            <div className="veyra-auth-field">
              <label htmlFor="customer-email">Email address</label>
              <input
                id="customer-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={update}
                required
              />
            </div>

            <div className="veyra-auth-field">
              <label htmlFor="customer-password">Password</label>
              <div className="veyra-auth-password">
                <input
                  id="customer-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete={
                    mode === 'signup'
                      ? 'new-password'
                      : 'current-password'
                  }
                  minLength={mode === 'signup' ? 12 : undefined}
                  value={form.password}
                  onChange={update}
                  required
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>
              {mode === 'signup' && (
                <small>Use at least 12 characters.</small>
              )}
            </div>

            {error && (
              <p className="veyra-auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="veyra-auth-submit"
              disabled={loading}
            >
              {loading
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Sign in'
                  : 'Create my account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="veyra-auth-bottom">
            {mode === 'login'
              ? "New to Veyra?"
              : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() =>
                switchMode(mode === 'login' ? 'signup' : 'login')
              }
            >
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="veyra-auth-copyright">
          © VEYRA · TRAVEL CONCEPT
        </div>
      </section>
    </main>
  )
}
