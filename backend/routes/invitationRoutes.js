const express = require('express');
const router = express.Router();
const Invitation = require('../models/Invitation');

// Generate unique 6-character invitation code
function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'INV-';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST create or record personalized invitation
router.post('/', async (req, res) => {
  try {
    const {
      guestName,
      sourceLocation,
      sourceCoords,
      distanceKm,
      durationText,
      travelModeRecommendations
    } = req.body;

    if (!sourceLocation) {
      return res.status(400).json({ success: false, message: 'Source location is required' });
    }

    const inviteCode = generateInviteCode();

    const invitation = await Invitation.create({
      guestName: guestName || 'Valued Guest',
      sourceLocation: sourceLocation,
      sourceCoords: sourceCoords || { lat: 17.3850, lng: 78.4867 },
      distanceKm: distanceKm || 0,
      durationText: durationText || '',
      travelModeRecommendations: travelModeRecommendations || {},
      inviteCode: inviteCode
    });

    res.status(201).json({
      success: true,
      message: 'Personalized invitation created successfully',
      invitation
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({ success: false, message: 'Failed to create invitation', error: error.message });
  }
});

// GET invitation by code
router.get('/:code', async (req, res) => {
  try {
    const invitation = await Invitation.findOne({ inviteCode: req.params.code.toUpperCase() });
    if (!invitation) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    invitation.viewsCount += 1;
    await invitation.save();

    res.json({ success: true, invitation });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch invitation', error: error.message });
  }
});

// GET recent invitations
router.get('/', async (req, res) => {
  try {
    const invitations = await Invitation.find().sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, count: invitations.length, invitations });
  } catch (error) {
    console.error('Error listing invitations:', error);
    res.status(500).json({ success: false, message: 'Failed to list invitations', error: error.message });
  }
});

module.exports = router;
