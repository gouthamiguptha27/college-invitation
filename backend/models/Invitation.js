const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  guestName: {
    type: String,
    trim: true,
    default: 'Valued Guest'
  },
  sourceLocation: {
    type: String,
    required: true,
    trim: true
  },
  sourceCoords: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  distanceKm: {
    type: Number,
    required: true
  },
  durationText: {
    type: String,
    default: ''
  },
  travelModeRecommendations: {
    flight: { type: String, default: '' },
    train: { type: String, default: '' },
    drive: { type: String, default: '' }
  },
  inviteCode: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  viewsCount: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Invitation', InvitationSchema);
