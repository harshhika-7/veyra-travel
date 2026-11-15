
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { rateLimit } = require('express-rate-limit')
const User = require('../models/User')

const router = express.Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts. Please try again later.',
  },
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: 'customer' },
    process.env.JWT_SECRET,
    { expiresIn: '2h', algorithm: 'HS256' }
  )
}

// POST /api/users/signup
router.post('/signup', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body || {}

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid signup details.',
      })
    }

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (
      cleanName.length < 2 ||
      cleanName.length > 80 ||
      cleanEmail.length > 254 ||
      !emailPattern.test(cleanEmail) ||
      password.length < 12 ||
      password.length > 72
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Use a valid name and email, and a password between 12 and 72 characters.',
      })
    }

    const existingUser = await User.findOne({ email: cleanEmail })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
    })

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token: createToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      })
    }

    console.error('Signup error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to create account.',
    })
  }
})

// POST /api/users/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      email.length > 254 ||
      password.length > 1024
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email and password.',
      })
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select('+passwordHash')

    const validPassword = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false

    if (!user || !validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    return res.json({
      success: true,
      message: 'Login successful.',
      token: createToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to log in.',
    })
  }
})

const requireCustomer = require('../middleware/customerAuth')

// GET /api/users/wishlist
router.get('/wishlist', requireCustomer, async (req, res) => {
  try {
    const user = await User.findById(req.customerId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer account not found.',
      })
    }

    return res.json({
      success: true,
      wishlist: user.wishlist || [],
    })
  } catch (error) {
    console.error('Wishlist loading error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to load wishlist.',
    })
  }
})

// POST /api/users/wishlist
router.post('/wishlist', requireCustomer, async (req, res) => {
  try {
    const { slug } = req.body || {}

    if (
      typeof slug !== 'string' ||
      !/^[a-z0-9-]{1,80}$/.test(slug)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid destination.',
      })
    }

    const user = await User.findByIdAndUpdate(
      req.customerId,
      { $addToSet: { wishlist: slug } },
      { new: true, runValidators: true }
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer account not found.',
      })
    }

    return res.json({
      success: true,
      message: 'Destination saved.',
      wishlist: user.wishlist,
    })
  } catch (error) {
    console.error('Wishlist save error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to save destination.',
    })
  }
})

// DELETE /api/users/wishlist/:slug
router.delete('/wishlist/:slug', requireCustomer, async (req, res) => {
  try {
    const { slug } = req.params

    if (!/^[a-z0-9-]{1,80}$/.test(slug)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid destination.',
      })
    }

    const user = await User.findByIdAndUpdate(
      req.customerId,
      { $pull: { wishlist: slug } },
      { new: true, runValidators: true }
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer account not found.',
      })
    }

    return res.json({
      success: true,
      message: 'Destination removed.',
      wishlist: user.wishlist,
    })
  } catch (error) {
    console.error('Wishlist removal error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to remove destination.',
    })
  }
})


module.exports = router
