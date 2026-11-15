
import WishlistPage from './pages/WishlistPage'
import AccountPage from './pages/AccountPage'
import AuthPage from './pages/AuthPage'
import AdminPage from './pages/AdminPage'
import DestinationPage from './pages/DestinationPage.jsx'

import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Menu,
  X,
  Globe2,
} from 'lucide-react'
import { gsap } from 'gsap'
import './App.css'

const BRAND = 'veyra'

const destinations = [
  {
    name: 'Nandi Hills',
    slug: 'nandi-hills',
    location: 'Karnataka, India',
    title: 'Above the clouds. Beyond the ordinary.',
    description:
      'Chase the sunrise, wander through the clouds, and rediscover the beauty of a little escape.',
    price: '₹999',
    image: '/images/destinations/nandi-hills.jpg',
  },
  {
    name: 'Chikkamagaluru',
    slug: 'chikkamagaluru',
    location: 'Karnataka, India',
    title: 'Find yourself in the quiet of the hills.',
    description:
      'Coffee-scented mornings, winding mountain roads, and endless shades of green.',
    price: '₹5,999',
    image: '/images/destinations/chikkamagaluru.jpg',
  },
  {
    name: 'Coorg',
    slug: 'coorg',
    location: 'Karnataka, India',
    title: 'Where the mist meets the mountains.',
    description:
      'Escape into mist-covered hills, winding trails, and the timeless beauty of Coorg.',
    price: '₹5,499',
    image: '/images/destinations/coorg.jpg',
  },
  {
    name: 'Ooty',
    slug: 'ooty',
    location: 'Tamil Nadu, India',
    title: 'A little closer to the clouds.',
    description:
      'Rolling tea gardens, cool mountain air, and slow days in the Nilgiris.',
    price: '₹5,499',
    image: '/images/destinations/ooty.jpg',
  },
  {
    name: 'Goa',
    slug: 'goa',
    location: 'Goa, India',
    title: 'Follow the sun. Feel the freedom.',
    description:
      'Golden coastlines, vibrant streets, and days that stretch into unforgettable nights.',
    price: '₹6,499',
    image: '/images/destinations/goa.jpg',
  },
  {
    name: 'Kerala',
    slug: 'kerala',
    location: 'Kerala, India',
    title: 'Somewhere between calm and wonder.',
    description:
      'Drift through peaceful backwaters and discover the slower side of paradise.',
    price: '₹5,499',
    image: '/images/destinations/kerala.jpg',
  },
  {
    name: 'Lakshadweep',
    slug: 'lakshadweep',
    location: 'Lakshadweep, India',
    title: 'Where the ocean feels like a dream.',
    description:
      'Turquoise lagoons, untouched islands, and an escape unlike anywhere else.',
    price: '₹18,999',
    image: '/images/destinations/lakshadweep.jpg',
  },
]

const internationalDestinations = [
  {
    name: 'Bali',
    location: 'Indonesia',
    description: 'Sacred temples, lush jungles, and ocean horizons.',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Japan',
    location: 'East Asia',
    description: 'Ancient traditions meet a world of possibility.',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Switzerland',
    location: 'Europe',
    description: 'Alpine beauty, quiet lakes, and extraordinary views.',
    image:
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Italy',
    location: 'Southern Europe',
    description: 'Timeless cities, sunlit coastlines, and slow afternoons.',
    image:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
  },
  {
    name: 'Maldives',
    location: 'Indian Ocean',
    description: 'A quieter kind of paradise, surrounded by blue.',
    image:
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=85',
  },
]

function App() {
  const navigate = useNavigate()

  const [activeIndex, setActiveIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const heroTextRef = useRef(null)
  const imageRef = useRef(null)
  const firstRender = useRef(true)

  const active = destinations[activeIndex]

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        heroTextRef.current?.children || [],
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.09,
          ease: 'power3.out',
        }
      )

      gsap.fromTo(
        imageRef.current,
        { scale: 1.065, opacity: 0.65 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.3,
          ease: 'power2.out',
        }
      )
    })

    return () => context.revert()
  }, [activeIndex])

  useEffect(() => {
    destinations.forEach((destination) => {
      const img = new Image()
      img.src = destination.image
    })
  }, [])

  function changeDestination(index) {
    if (index === activeIndex) return
    setActiveIndex(index)
  }

  function next() {
    changeDestination((activeIndex + 1) % destinations.length)
  }

  function previous() {
    changeDestination(
      (activeIndex - 1 + destinations.length) % destinations.length
    )
  }

  function exploreDestination(index) {
    navigate(`/destinations/${destinations[index].slug}`)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <div className="site">
      <header className="navbar">
        <a
          href="#home"
          className="logo"
          aria-label="Veyra home"
          onClick={closeMenu}
        >
          {BRAND}<span>.</span>
        </a>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#explore" onClick={closeMenu}>Explore India</a>
          <a href="#international" onClick={closeMenu}>
            International
          </a>
          <a href="#about" onClick={closeMenu}>Our Story</a>
        </nav>

        <Link className="nav-cta" to="/account">
          My account <ArrowUpRight size={17} />
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <main>
        {/* CINEMATIC HERO */}
        <section className="hero" id="home">
          <div
            key={active.image}
            ref={imageRef}
            className="hero-background"
            style={{
              backgroundImage: `url("${active.image}")`,
            }}
          />

          <div className="hero-overlay" />

          <div className="hero-content" ref={heroTextRef}>
            <div className="eyebrow">
              <span className="eyebrow-line" />
              CURATED JOURNEYS · UNFORGETTABLE PLACES
            </div>

            <h1>{active.title}</h1>

            <p className="hero-description">
              {active.description}
            </p>

            <div className="hero-location">
              <MapPin size={16} />
              <span>{active.location}</span>
            </div>

            <div className="hero-actions">
              <button
                type="button"
                className="hero-button"
                onClick={() => exploreDestination(activeIndex)}
              >
                Explore destination
                <ArrowUpRight size={18} />
              </button>

              <div className="hero-price">
                <span>STARTING FROM</span>
                <strong>{active.price}</strong>
              </div>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hero-counter">
              <span className="counter-current">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="counter-separator">/</span>
              <span>
                {String(destinations.length).padStart(2, '0')}
              </span>
              <span className="counter-destination">
                {active.name}
              </span>
            </div>

            <div className="hero-controls">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous destination"
              >
                <ArrowLeft size={20} />
              </button>

              <button
                type="button"
                onClick={next}
                aria-label="Next destination"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* DESTINATION SELECTOR */}
        <section
          className="destination-strip"
          aria-label="Choose a destination"
        >
          <div className="strip-heading">
            <span>YOUR NEXT ESCAPE</span>
            <strong>Where to?</strong>
          </div>

          <div className="strip-scroll">
            {destinations.map((place, index) => (
              <button
                type="button"
                key={place.slug}
                className={`strip-item ${
                  activeIndex === index ? 'active' : ''
                }`}
                onClick={() => changeDestination(index)}
                aria-pressed={activeIndex === index}
              >
                <div className="strip-image">
                  <img
                    src={place.image}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <span>{place.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* OUR STORY */}
        <section className="intro" id="about">
          <div className="intro-label">
            <span className="section-label">
              THE VEYRA WAY
            </span>
            <span className="intro-index">01 — 03</span>
          </div>

          <div className="intro-main">
            <h2>
              Not just places.
              <br />
              <em>Stories worth living.</em>
            </h2>

            <div className="intro-aside">
              <p>
                The best journeys don't just take you somewhere new.
                They make you feel something different. Discover
                remarkable destinations, thoughtfully curated for
                the curious.
              </p>

              <a href="#explore" className="text-link">
                Discover our journeys
                <ArrowUpRight size={19} />
              </a>
            </div>
          </div>
        </section>

        {/* EXPLORE INDIA */}
        <section className="destinations" id="explore">
          <div className="section-heading">
            <div>
              <span className="section-label">
                THE INDIA COLLECTION
              </span>

              <h2>
                Closer to home.
                <br />
                <em>Far from ordinary.</em>
              </h2>
            </div>

            <p>
              Seven extraordinary destinations,
              thoughtfully curated for you.
            </p>
          </div>

          <div className="destination-grid">
            {destinations.map((place, index) => (
              <button
                type="button"
                className="destination-card"
                key={place.slug}
                onClick={() => exploreDestination(index)}
                aria-label={`View ${place.name}`}
              >
                <div className="destination-image">
                  <img
                    src={place.image}
                    alt={place.name}
                    loading="lazy"
                  />

                  <span className="card-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="card-arrow">
                    <ArrowUpRight size={20} />
                  </span>
                </div>

                <div className="destination-info">
                  <div>
                    <h3>{place.name}</h3>
                    <p>{place.location}</p>
                  </div>

                  <span>From {place.price}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* INTERNATIONAL COLLECTION */}
        <section
          className="international-section"
          id="international"
        >
          <div className="international-heading">
            <div>
              <span className="section-label">
                THE WORLD COLLECTION
              </span>

              <h2>
                Beyond borders.
                <br />
                <em>Beyond imagination.</em>
              </h2>
            </div>

            <p>
              A world of extraordinary places is waiting
              to be discovered.
            </p>
          </div>

          <div className="international-grid">
            {internationalDestinations.map((place, index) => (
              <article
                className="international-card"
                key={place.name}
              >
                <div className="international-image">
                  <img
                    src={place.image}
                    alt={place.name}
                    loading="lazy"
                  />

                  <span className="international-number">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span className="international-badge">
                    COMING SOON
                  </span>
                </div>

                <div className="international-card-info">
                  <span>{place.location}</span>
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="international-bottom">
            <Globe2 size={19} strokeWidth={1.3} />
            <span>
              New destinations are being added to the collection.
            </span>
          </div>
        </section>

        {/* CLOSING */}
        <section className="closing">
          <span className="section-label">
            YOUR NEXT STORY STARTS HERE
          </span>

          <h2>
            There's more out there.
            <br />
            <em>Go find it.</em>
          </h2>

          <a href="#explore" className="closing-button">
            Explore destinations
            <ArrowUpRight size={19} />
          </a>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <a href="#home" className="footer-logo">
            {BRAND}<span>.</span>
          </a>

          <p>
            For the places you'll go.
            <br />
            And the stories you'll bring back.
          </p>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Veyra · Design concept</span>
          <span>Made for the journey.</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </div>
  )
}

function VeyraRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route
        path="/destinations/:slug"
        element={<DestinationPage />}
      />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
    </Routes>
  )
}

export default VeyraRoutes
