const express = require('express');
const router = express.Router();
const RSVP = require('../models/RSVP');

// POST submit RSVP
router.post('/', async (req, res) => {
  try {
    const {
      guestName,
      phone,
      email,
      sourceLocation,
      attendingStatus,
      attendeesCount,
      dietaryPreference,
      message
    } = req.body;

    if (!guestName || !guestName.trim()) {
      return res.status(400).json({ success: false, message: 'Guest name is required' });
    }

    const rsvp = await RSVP.create({
      guestName: guestName.trim(),
      phone: phone || '',
      email: email || '',
      sourceLocation: sourceLocation || '',
      attendingStatus: attendingStatus || 'attending',
      attendeesCount: attendeesCount ? parseInt(attendeesCount) : 1,
      dietaryPreference: dietaryPreference || 'Vegetarian',
      message: message || ''
    });

    res.status(201).json({
      success: true,
      message: 'RSVP submitted successfully! We look forward to celebrating with you.',
      rsvp
    });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    res.status(500).json({ success: false, message: 'Failed to submit RSVP', error: error.message });
  }
});

// GET all RSVPs
router.get('/', async (req, res) => {
  try {
    const rsvps = await RSVP.find().sort({ submittedAt: -1 });
    const totalGuests = rsvps
      .filter(r => r.attendingStatus === 'attending')
      .reduce((sum, r) => sum + (r.attendeesCount || 1), 0);

    res.json({
      success: true,
      totalCount: rsvps.length,
      totalGuests,
      rsvps
    });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch RSVPs', error: error.message });
  }
});

module.exports = router;
