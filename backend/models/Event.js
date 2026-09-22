const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true,
    default: 'Indian Institute of Technology Ropar'
  },
  collegeShortName: {
    type: String,
    required: true,
    default: 'IIT ROPAR'
  },
  eventTitle: {
    type: String,
    required: true,
    default: 'FRESHERS 2026'
  },
  eventSubtitle: {
    type: String,
    default: 'AURA - The Grand Induction & Cultural Fest'
  },
  eventDate: {
    type: String,
    required: true,
    default: '2026-10-18'
  },
  eventTime: {
    type: String,
    required: true,
    default: '10:00 AM onwards'
  },
  invitationMessage: {
    type: String,
    default: "We are thrilled to welcome you to celebrate this grand milestone with my brother and his college batch! Join us for a day of celebration, memories, cultural performances, and gala lunch."
  },
  venue: {
    type: String,
    default: 'Main Auditorium & Sen Hall, Permanent Campus'
  },
  fixedDestination: {
    name: {
      type: String,
      required: true,
      default: 'IIT Ropar, Rupnagar'
    },
    address: {
      type: String,
      default: 'IIT Ropar Permanent Campus, Birla Seed Farms, Rupnagar, Punjab 140001'
    },
    lat: {
      type: Number,
      required: true,
      default: 30.9678
    },
    lng: {
      type: Number,
      required: true,
      default: 76.4732
    }
  },
  photoUrl: {
    type: String,
    default: '/uploads/default-college.jpg'
  },
  brotherName: {
    type: String,
    default: 'My Brother'
  },
  brotherDepartment: {
    type: String,
    default: 'Computer Science & Engineering'
  },
  contactInfo: {
    email: { type: String, default: 'events@iitrpr.ac.in' },
    phone: { type: String, default: '+91 98765 43210' },
    helpline: { type: String, default: 'Reception Desk: +91 1881 242100' }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);
