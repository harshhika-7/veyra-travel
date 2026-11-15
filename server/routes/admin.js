
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { rateLimit } = require('express-rate-limit')
const mongoose = require('mongoose')

const Enquiry = require('../models/Enquiry')
const requireAdmin = require('../middleware/auth')

const router = express.Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Try again in 15 minutes.',
  },
})

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      })
    }

    const validEmail =
      email.trim().toLowerCase() ===
      process.env.ADMIN_EMAIL.trim().toLowerCase()

    const validPassword = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    )

    if (!validEmail || !validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h',
        algorithm: 'HS256',
      }
    )

    return res.json({
      success: true,
      message: 'Admin login successful.',
      token,
    })
  } catch (error) {
    console.error('Admin login failed:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to log in right now.',
    })
  }
})

// All routes below require admin authentication.
router.use(requireAdmin)

// GET /api/admin/enquiries
router.get('/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    return res.json({
      success: true,
      enquiries,
    })
  } catch (error) {
    console.error('Failed to load enquiries:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to load enquiries.',
    })
  }
})

// PATCH /api/admin/enquiries/:id/status
router.patch('/enquiries/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body || {}

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry ID.',
      })
    }

    const allowedStatuses = ['new', 'contacted', 'closed']

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid enquiry status.',
      })
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found.',
      })
    }

    return res.json({
      success: true,
      message: 'Enquiry status updated.',
      enquiry,
    })
  } catch (error) {
    console.error('Failed to update enquiry:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to update enquiry.',
    })
  }
})

module.exports = router
