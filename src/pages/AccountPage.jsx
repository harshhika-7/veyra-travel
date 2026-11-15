
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  Compass,
  Heart,
  CalendarDays,
  LogOut,
  UserRound,
} from 'lucide-react'
import './AccountPage.css'

export default function AccountPage() {
  const navigate = useNavigate()

  const token = sessionStorage.getItem('veyra_customer_token')

  let user = null

  try {
    user = JSON.parse(
      sessionStorage.getItem('veyra_customer') || 'null'
    )
  } catch {
    user = null
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  function logout() {
    sessionStorage.removeItem('veyra_customer_token')
    sessionStorage.removeItem('veyra_customer')
    navigate('/login', { replace: true })
  }

  const firstName = user.name?.split(' ')[0] || 'Traveller'

  return (
    <main className="veyra-account-page">
      <header className="veyra-account-header">
        <Link to="/" className="veyra-account-logo">
          VEYRA<span>.</span>
        </Link>

        <nav>
          <Link to="/">Explore destinations</Link>
          <Link to="/wishlist">My wishlist</Link>

          <button type="button" onClick={logout}>
            <LogOut size={16} />
            Sign out
          </button>
        </nav>
      </header>

      <div className="veyra-account-container">
        <div className="veyra-account-intro">
          <p className="veyra-account-eyebrow">
            YOUR PERSONAL SPACE
          </p>

          <h1>
            Welcome back, <em>{firstName}.</em>
          </h1>

          <p>
            A little space for all the places you dream of going.
          </p>
        </div>

        <div className="veyra-account-grid">
          {/* EXPLORE DESTINATIONS */}
          <section className="veyra-account-feature">
            <div className="veyra-account-feature-content">
              <span>01 / DISCOVER</span>

              <Compass size={32} strokeWidth={1.2} />

              <h2>Where to next?</h2>

              <p>
                Discover extraordinary places and start planning
                your next journey.
              </p>

              <Link to="/">
                Explore destinations
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </section>

          {/* MY WISHLIST */}
          <section className="veyra-account-tile">
            <div className="veyra-account-tile-heading">
              <Heart size={25} strokeWidth={1.4} />
              <span>02 / COLLECTION</span>
            </div>

            <div>
              <h2>Your wishlist</h2>

              <p>
                Save the destinations you love and revisit your
                favourite places whenever inspiration strikes.
              </p>

              <Link
                to="/wishlist"
                className="veyra-account-coming"
              >
                View my wishlist
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </section>

          {/* MY TRIPS */}
          <section className="veyra-account-tile">
            <div className="veyra-account-tile-heading">
              <CalendarDays size={25} strokeWidth={1.4} />
              <span>03 / JOURNEYS</span>
            </div>

            <div>
              <h2>My trips</h2>

              <p>
                Your booking requests and travel plans will
                appear here.
              </p>

              <span className="veyra-account-coming">
                Coming next
              </span>
            </div>
          </section>
        </div>

        {/* ACCOUNT DETAILS */}
        <section className="veyra-account-profile">
          <div className="veyra-account-profile-icon">
            <UserRound size={25} strokeWidth={1.3} />
          </div>

          <div>
            <p>ACCOUNT DETAILS</p>
            <h3>{user.name}</h3>
            <span>{user.email}</span>
          </div>
        </section>
      </div>

      <footer className="veyra-account-footer">
        VEYRA · THE ART OF GOING SOMEWHERE
      </footer>
    </main>
  )
}
