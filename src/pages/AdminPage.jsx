
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  LogOut,
  Mail,
  Phone,
  CalendarDays,
  Users,
  Search,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react'
import './AdminPage.css'

const API = 'http://localhost:5000/api/admin'
const TOKEN_KEY = 'veyra_admin_token'

export default function AdminPage() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem(TOKEN_KEY) || ''
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY)
    setToken('')
    setEnquiries([])
    setPassword('')
  }

  async function loadEnquiries(currentToken = token) {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API}/enquiries`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      })

      if (response.status === 401 || response.status === 403) {
        logout()
        throw new Error('Your session expired. Please log in again.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load enquiries.')
      }

      setEnquiries(data.enquiries || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) loadEnquiries(token)
  }, [token])

  async function handleLogin(event) {
    event.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      const response = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.token) {
        throw new Error(data.message || 'Login failed.')
      }

      sessionStorage.setItem(TOKEN_KEY, data.token)
      setPassword('')
      setToken(data.token)
    } catch (err) {
      setLoginError(err.message)
    } finally {
      setLoginLoading(false)
    }
  }

  async function updateStatus(id, status) {
    setUpdatingId(id)
    setError('')

    try {
      const response = await fetch(
        `${API}/enquiries/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      )

      if (response.status === 401 || response.status === 403) {
        logout()
        throw new Error('Your session expired. Please log in again.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Update failed.')
      }

      setEnquiries((previous) =>
        previous.map((item) =>
          item._id === id ? { ...item, status } : item
        )
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = enquiries.filter((item) => {
    const matchesStatus =
      filter === 'all' || (item.status || 'new') === filter

    const term = search.toLowerCase().trim()
    const matchesSearch = [
      item.name,
      item.email,
      item.destination,
    ].some((value) =>
      String(value || '').toLowerCase().includes(term)
    )

    return matchesStatus && matchesSearch
  })

  const counts = {
    all: enquiries.length,
    new: enquiries.filter((e) => (e.status || 'new') === 'new').length,
    contacted: enquiries.filter((e) => e.status === 'contacted').length,
    closed: enquiries.filter((e) => e.status === 'closed').length,
  }

  if (!token) {
    return (
      <div className="veyra-admin-login">
        <div className="veyra-login-panel">
          <div className="veyra-login-symbol">V</div>
          <p className="veyra-login-eyebrow">PRIVATE ACCESS</p>
          <h1>Welcome back.</h1>
          <p className="veyra-login-subtitle">
            Sign in to manage your Veyra enquiries.
          </p>

          <form onSubmit={handleLogin}>
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@veyra.local"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {loginError && (
              <p className="veyra-admin-error" role="alert">
                {loginError}
              </p>
            )}

            <button type="submit" disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign in securely'}
            </button>
          </form>

          <div className="veyra-login-footer">
            <ShieldCheck size={16} />
            Protected administration
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="veyra-admin-shell">
      <aside className="veyra-admin-sidebar">
        <div className="veyra-admin-brand">VEYRA<span>.</span></div>
        <p className="veyra-sidebar-caption">ADMINISTRATION</p>

        <div className="veyra-sidebar-active">
          <LayoutDashboard size={18} />
          Enquiries
        </div>

        <button className="veyra-admin-logout" onClick={logout}>
          <LogOut size={17} />
          Sign out
        </button>
      </aside>

      <main className="veyra-admin-main">
        <header className="veyra-admin-topbar">
          <div>
            <p className="veyra-admin-eyebrow">OVERVIEW</p>
            <h1>Booking enquiries</h1>
            <p>Manage incoming travel requests in one place.</p>
          </div>

          <button
            className="veyra-refresh"
            onClick={() => loadEnquiries()}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </header>

        <div className="veyra-stats">
          {[
            ['all', 'Total enquiries'],
            ['new', 'New requests'],
            ['contacted', 'Contacted'],
            ['closed', 'Closed'],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`veyra-stat ${filter === key ? 'selected' : ''}`}
              onClick={() => setFilter(key)}
            >
              <span>{label}</span>
              <strong>{counts[key]}</strong>
            </button>
          ))}
        </div>

        <section className="veyra-enquiry-panel">
          <div className="veyra-enquiry-heading">
            <div>
              <h2>All requests</h2>
              <p>{filtered.length} enquiries displayed</p>
            </div>

            <div className="veyra-admin-search">
              <Search size={17} />
              <input
                type="search"
                placeholder="Search name, email, destination"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="veyra-admin-error" role="alert">{error}</p>
          )}

          {loading ? (
            <div className="veyra-admin-empty">Loading enquiries...</div>
          ) : filtered.length === 0 ? (
            <div className="veyra-admin-empty">
              No enquiries found.
            </div>
          ) : (
            <div className="veyra-enquiry-list">
              {filtered.map((item) => (
                <article className="veyra-enquiry-card" key={item._id}>
                  <div className="veyra-enquiry-card-top">
                    <div>
                      <p className="veyra-enquiry-destination">
                        {item.destination || 'Destination not specified'}
                      </p>
                      <h3>{item.name || 'Unknown guest'}</h3>
                    </div>

                    <select
                      aria-label={`Status for ${item.name || 'guest'}`}
                      className={`veyra-status ${item.status || 'new'}`}
                      value={item.status || 'new'}
                      disabled={updatingId === item._id}
                      onChange={(e) =>
                        updateStatus(item._id, e.target.value)
                      }
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div className="veyra-enquiry-details">
                    <span><Mail size={15} /> {item.email || '—'}</span>
                    <span><Phone size={15} /> {item.phone || '—'}</span>
                    <span>
                      <CalendarDays size={15} />
                      {item.date || 'Date not specified'}
                    </span>
                    <span>
                      <Users size={15} />
                      {item.travellers || '—'} travellers
                    </span>
                  </div>

                  {item.message && (
                    <p className="veyra-enquiry-message">{item.message}</p>
                  )}

                  <p className="veyra-enquiry-timestamp">
                    Received{' '}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : 'recently'}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
