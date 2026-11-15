
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Heart, Trash2 } from 'lucide-react'
import { destinations } from '../data/destinations'
import './WishlistPage.css'

const API = 'http://localhost:5000/api/users/wishlist'

export default function WishlistPage() {
  const navigate = useNavigate()
  const token = sessionStorage.getItem('veyra_customer_token')

  const [savedSlugs, setSavedSlugs] = useState([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let active = true

    async function loadWishlist() {
      try {
        const response = await fetch(API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem('veyra_customer_token')
          sessionStorage.removeItem('veyra_customer')
          navigate('/login', { replace: true })
          return
        }

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load wishlist.')
        }

        if (active) {
          setSavedSlugs(data.wishlist || [])
        }
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadWishlist()

    return () => {
      active = false
    }
  }, [token, navigate])

  async function removeDestination(slug) {
    setRemoving(slug)
    setError('')

    try {
      const response = await fetch(
        `${API}/${encodeURIComponent(slug)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem('veyra_customer_token')
        sessionStorage.removeItem('veyra_customer')
        navigate('/login', { replace: true })
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to remove destination.')
      }

      setSavedSlugs(data.wishlist || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setRemoving('')
    }
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  const destinationList = Array.isArray(destinations)
    ? destinations
    : Object.values(destinations)

  const savedDestinations = destinationList.filter((destination) =>
    savedSlugs.includes(destination.slug)
  )

  return (
    <main className="veyra-wishlist-page">
      <header className="veyra-wishlist-header">
        <Link to="/" className="veyra-wishlist-logo">
          VEYRA<span>.</span>
        </Link>

        <Link to="/account" className="veyra-wishlist-back">
          <ArrowLeft size={17} />
          My account
        </Link>
      </header>

      <section className="veyra-wishlist-container">
        <div className="veyra-wishlist-intro">
          <p>YOUR PERSONAL COLLECTION</p>
          <h1>Places worth <em>keeping.</em></h1>
          <span>
            A collection of destinations that inspire your next journey.
          </span>
        </div>

        {error && (
          <p className="veyra-wishlist-page-error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <div className="veyra-wishlist-empty">
            Loading your collection...
          </div>
        ) : savedDestinations.length === 0 ? (
          <div className="veyra-wishlist-empty">
            <Heart size={38} strokeWidth={1.2} />
            <h2>Your collection is waiting.</h2>
            <p>
              Explore our destinations and save the places
              you'd love to visit.
            </p>
            <Link to="/">
              Explore destinations <ArrowUpRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            <p className="veyra-wishlist-count">
              {savedDestinations.length} SAVED DESTINATIONS
            </p>

            <div className="veyra-wishlist-grid">
              {savedDestinations.map((destination) => (
                <article
                  className="veyra-wishlist-card"
                  key={destination.slug}
                >
                  <Link
                    to={`/destinations/${destination.slug}`}
                    className="veyra-wishlist-image-link"
                  >
                    <img
                      src={destination.image}
                      alt={destination.name}
                      loading="lazy"
                    />
                    <span>EXPLORE DESTINATION</span>
                  </Link>

                  <div className="veyra-wishlist-card-info">
                    <div>
                      <p>{destination.location}</p>
                      <h2>{destination.name}</h2>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeDestination(destination.slug)
                      }
                      disabled={removing === destination.slug}
                      aria-label={`Remove ${destination.name} from wishlist`}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={19} />
                    </button>
                  </div>

                  <Link
                    to={`/destinations/${destination.slug}`}
                    className="veyra-wishlist-view"
                  >
                    Discover this place <ArrowUpRight size={17} />
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <footer className="veyra-wishlist-footer">
        VEYRA · THE ART OF GOING SOMEWHERE
      </footer>
    </main>
  )
}
