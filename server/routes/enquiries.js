const express = require('express')
const Enquiry = require('../models/Enquiry')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const {
      destination,
      name,
      email,
      phone,
      date,
      travellers,
      message,
    } = req.body

    if (
      !destination ||
      !name ||
      !email ||
      !phone ||
      !date ||
      !travellers
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.',
      })
    }

    // Indian mobile number validation
    if (
      typeof phone !== 'string' ||
      !/^[6-9][0-9]{9}$/.test(phone)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit Indian mobile number.',
      })
    }

    const enquiry = await Enquiry.create({
      destination,
      name,
      email,
      phone,
      date,
      travellers,
      message,
    })

    res.status(201).json({
      success: true,
      message: 'Your enquiry was received successfully!',
      enquiryId: enquiry._id,
    })
  } catch (error) {
    console.error('Enquiry creation failed:', error.message)

    res.status(400).json({
      success: false,
      message: 'Unable to submit enquiry. Check your details.',
    })
  }
})

module.exports = router