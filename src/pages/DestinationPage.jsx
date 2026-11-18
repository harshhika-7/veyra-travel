import WishlistButton from '../components/WishlistButton'
import { useParams } from 'react-router-dom'
import { destinations } from '../data/destinations'
import { ArrowLeft, ArrowUpRight, MapPin, Clock3 } from 'lucide-react'
import { useState } from 'react'
import './DestinationPage.css'

const API_URL = 'https://veyra-travel.onrender.com'

function DestinationPage() {
  const { slug } = useParams()

  const destination = destinations.find(
    (item) => item.slug === slug
  )

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    travellers: '2',
    message: '',
  })

  const [formStatus, setFormStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setFormStatus('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!destination || isSubmitting) return

    setIsSubmitting(true)
    setFormStatus('')

    try {
      const response = await fetch(`${API_URL}/api/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: destination.name,
          ...formData,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Unable to submit your enquiry.'
        )
      }

      setFormStatus(
        'Your enquiry has been submitted successfully!'
      )

      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        travellers: '2',
        message: '',
      })
    } catch (error) {
      setFormStatus(
        error.message ||
          'Something went wrong. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!destination) {
    return (
      <div className="trip-page">
        <header className="trip-navbar">
          <a href="/" className="trip-logo">
            veyra<span>.</span>
          </a>
        </header>

        <section className="trip-overview">
          <div className="trip-overview-heading">
            <span className="trip-label">404 / NOT FOUND</span>
            <h2>
              Destination <em>not found.</em>
            </h2>
            <a href="/" className="trip-enquire">
              <ArrowLeft size={18} /> Back to home
            </a>
          </div>
        </section>
      </div>
    )
  }

  const gallery = destination.gallery || []

  return (
    <div className="trip-page">
      {/* NAVIGATION */}
      <header className="trip-navbar">
        <a href="/" className="trip-logo">
          veyra<span>.</span>
        </a>

        <a href="/" className="trip-back">
          <ArrowLeft size={17} /> Back to destinations
        </a>
      </header>

      {/* HERO */}
      <section className="trip-hero">
        <img
          src={destination.image}
          alt={destination.name}
          className="trip-hero-image"
        />

        <div className="trip-hero-shade" />

        <div className="trip-hero-content">
          <span className="trip-eyebrow">
            THE VEYRA COLLECTION / THE EXPERIENCE
          </span>

          <h1>
  {destination.name}<span>.</span>
</h1>

<WishlistButton slug={destination.slug} />

<p>{destination.tagline}</p>

          <div className="trip-meta">
            <span>
              <MapPin size={16} /> {destination.location}
            </span>

            <span>
              <Clock3 size={16} /> Duration to be confirmed
            </span>
          </div>
        </div>

        <div className="trip-hero-bottom">
          <span>01 / THE EXPERIENCE</span>
          <a href="#overview">SCROLL TO EXPLORE ↓</a>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="trip-overview" id="overview">
        <div className="trip-overview-heading">
          <span className="trip-label">
            AN ESCAPE INTO NATURE
          </span>

          <h2>
            Some places are
            <br />
            <em>felt, not explained.</em>
          </h2>
        </div>

        <div className="trip-overview-text">
          <p>{destination.description}</p>

          <div className="trip-price">
            <span>PACKAGES STARTING FROM</span>

            <strong>
              ₹{destination.price.toLocaleString('en-IN')}
            </strong>

            <small>
              Final pricing and inclusions to be confirmed
            </small>
          </div>

          <a className="trip-enquire" href="#enquire">
            Enquire about this trip
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      {/* DESTINATION HIGHLIGHT */}
      <section className="trip-highlight">
        <div className="trip-highlight-image">
          <img
            src={destination.image}
            alt={`Beautiful scenery in ${destination.name}`}
            loading="lazy"
          />
        </div>

        <div className="trip-highlight-content">
          <span className="trip-label">
            THE DESTINATION
          </span>

          <h2>{destination.highlight}</h2>

          <p>{destination.highlightDescription}</p>

          <span className="trip-highlight-index">
            VEYRA / {destination.name.toUpperCase()} / 2026
          </span>
        </div>
      </section>

      {/* DYNAMIC PHOTO GALLERY */}
      {gallery.length > 0 && (
        <section className="trip-gallery" id="gallery">
          <div className="trip-gallery-heading">
            <div>
              <span className="trip-label">
                MOMENTS FROM {destination.name.toUpperCase()}
              </span>

              <h2>
                A closer look at <em>paradise.</em>
              </h2>
            </div>

            <p>
              Explore the landscapes, beautiful scenery,
              and unforgettable moments that make
              {' '}{destination.name} worth discovering.
            </p>
          </div>

          <div className="trip-gallery-grid">
            {gallery.map((photo, index) => (
              <div
                className={`trip-gallery-photo ${
                  index === 0 ? 'trip-gallery-main' : ''
                }`}
                key={photo}
              >
                <img
                  src={photo}
                  alt={`${destination.name} gallery photo ${index + 1}`}
                  loading="lazy"
                />

                <div className="trip-gallery-caption">
                  <span>
                    {String(index + 1).padStart(2, '0')}
                    {' '} / {destination.name.toUpperCase()}
                  </span>

                  <h3>
                    {index === 0
                      ? 'Discover the beauty.'
                      : index === 1
                        ? 'Beyond the ordinary.'
                        : 'Moments to remember.'}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="trip-gallery-bottom">
            <span>THE VEYRA COLLECTION</span>

            <span>
              {destination.name.toUpperCase()} — INDIA
            </span>
          </div>
        </section>
      )}

      {/* BOOKING ENQUIRY */}
      <section
        className="trip-enquiry-section"
        id="enquire"
      >
        <div className="trip-enquiry-layout">
          <div className="trip-enquiry-intro">
            <span className="trip-label">
              YOUR NEXT ESCAPE AWAITS
            </span>

            <h2>
              Let's make it
              <br />
              <em>unforgettable.</em>
            </h2>

            <p>
              Tell us a little about your travel plans
              and begin your next unforgettable journey.
            </p>

            <div className="trip-enquiry-note">
              <span>01 — CHOOSE YOUR DATES</span>
              <span>02 — SHARE YOUR PLANS</span>
              <span>03 — START YOUR JOURNEY</span>
            </div>
          </div>

          <form
            className="trip-booking-form"
            onSubmit={handleSubmit}
          >
            <div className="trip-form-heading">
              <span>THE VEYRA COLLECTION</span>

              <h3>Plan your escape.</h3>

              <p>
                {destination.name}, {destination.location}
                {' '}· Booking enquiry
              </p>
            </div>

            <div className="trip-form-field">
              <label htmlFor="booking-name">
                FULL NAME *
              </label>

              <input
                id="booking-name"
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleInputChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="trip-form-row">
              <div className="trip-form-field">
                <label htmlFor="booking-email">
                  EMAIL ADDRESS *
                </label>

                <input
                  id="booking-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="trip-form-field">
                <label htmlFor="booking-phone">
                  PHONE NUMBER *
                </label>

                <input
                  id="booking-phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            <div className="trip-form-row">
              <div className="trip-form-field">
                <label htmlFor="booking-date">
                  PREFERRED TRAVEL DATE *
                </label>

                <input
                  id="booking-date"
                  type="date"
                  name="date"
                  min={new Date().toLocaleDateString('en-CA')}
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="trip-form-field">
                <label htmlFor="booking-travellers">
                  TRAVELLERS *
                </label>

                <select
                  id="booking-travellers"
                  name="travellers"
                  value={formData.travellers}
                  onChange={handleInputChange}
                  required
                >
                  <option value="1">1 traveller</option>
                  <option value="2">2 travellers</option>
                  <option value="3">3 travellers</option>
                  <option value="4">4 travellers</option>
                  <option value="5">5 travellers</option>
                  <option value="6+">6+ travellers</option>
                </select>
              </div>
            </div>

            <div className="trip-form-field">
              <label htmlFor="booking-message">
                ANYTHING ELSE?
              </label>

              <textarea
                id="booking-message"
                name="message"
                rows="4"
                placeholder="Tell us about your ideal trip..."
                value={formData.message}
                onChange={handleInputChange}
              />
            </div>

            <button
              className="trip-form-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Submitting...'
                : 'Send enquiry'}
              <ArrowUpRight size={19} />
            </button>

            {formStatus && (
              <p
                className="trip-form-status"
                role="status"
                aria-live="polite"
              >
                {formStatus}
              </p>
            )}

            <p className="trip-form-disclaimer">
              This is a portfolio demonstration.
              Please use fictional details when testing.
            </p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="trip-footer">
        <span>
          veyra<span className="trip-gold">.</span>
        </span>

        <p>For the places you'll go.</p>

        <a href="/">Back to home ↑</a>
      </footer>
    </div>
  )
}

export default DestinationPage
