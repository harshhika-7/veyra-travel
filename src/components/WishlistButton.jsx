
import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './WishlistButton.css'

const API = 'https://veyra-travel.onrender.com/api/users/wishlist'

export default function WishlistButton({ slug }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const token = sessionStorage.getItem('veyra_customer_token')

    if (!token) {
      setSaved(false)
      setLoading(false)
      return
    }

    setLoading(true)

    fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load wishlist.')
        }
        return response.json()
      })
      .then((data) => {
        if (active) {
          setSaved((data.wishlist || []).includes(slug))
        }
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug])

  async function toggleWishlist() {
    const token = sessionStorage.getItem('veyra_customer_token')

    if (!token) {
      navigate('/login')
      return
    }

    if (loading) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        saved ? `${API}/${encodeURIComponent(slug)}` : API,
        {
          method: saved ? 'DELETE' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          ...(saved ? {} : { body: JSON.stringify({ slug }) }),
        }
      )

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem('veyra_customer_token')
        sessionStorage.removeItem('veyra_customer')
        navigate('/login')
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update wishlist.')
      }

      setSaved((data.wishlist || []).includes(slug))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="veyra-wishlist-control">
      <button
        type="button"
        className={`veyra-wishlist-button ${saved ? 'is-saved' : ''}`}
        onClick={toggleWishlist}
        disabled={loading}
        aria-label={
          saved ? 'Remove from wishlist' : 'Add to wishlist'
        }
        aria-pressed={saved}
        title={saved ? 'Remove from wishlist' : 'Save destination'}
      >
        <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
        <span>{saved ? 'Saved' : 'Save destination'}</span>
      </button>

      {error && (
        <p className="veyra-wishlist-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
