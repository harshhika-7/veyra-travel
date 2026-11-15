const userRoutes = require('./routes/users')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const enquiryRoutes = require('./routes/enquiries')
const adminRoutes = require('./routes/admin')

const app = express()
const PORT = process.env.PORT || 5000

app.disable('x-powered-by')

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}))

app.use(express.json({ limit: '20kb' }))
app.use('/api/users', userRoutes)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Veyra backend is running!',
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
  })
})

app.use('/api/enquiries', enquiryRoutes)
app.use('/api/admin', adminRoutes)

async function startServer() {
  try {
    const requiredSettings = [
      'MONGODB_URI',
      'ADMIN_EMAIL',
      'ADMIN_PASSWORD_HASH',
      'JWT_SECRET',
    ]

    for (const setting of requiredSettings) {
      if (!process.env[setting]) {
        throw new Error(`${setting} is missing from .env`)
      }
    }

    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connected successfully!')

    app.listen(PORT, () => {
      console.log(
        `Veyra server running on http://localhost:${PORT}`
      )
    })
  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
