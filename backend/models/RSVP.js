const mongoose = require('mongoose');

const RSVPSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  sourceLocation: {
    type: String,
    default: ''
  },
  attendingStatus: {
    type: String,
    enum: ['attending', 'maybe', 'declined'],
    default: 'attending'
  },
  attendeesCount: {
    type: Number,
    default: 1
  },
  dietaryPreference: {
    type: String,
    default: 'Vegetarian'
  },
  message: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RSVP', RSVPSchema);
