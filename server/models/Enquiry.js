
const mongoose = require('mongoose')

const enquirySchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },

    date: {
      type: String,
      required: true,
    },

    travellers: {
      type: String,
      required: true,
      enum: ['1', '2', '3', '4', '5', '6+'],
    },

    message: {
      type: String,
      default: '',
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Enquiry', enquirySchema)
