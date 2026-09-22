const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Event = require('../models/Event');

// Memory storage works both in local Node.js and Vercel Serverless!
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB limit
  fileFilter: fileFilter
});

// Helper to get or create single default event
async function getOrCreateEvent() {
  let event = await Event.findOne();
  if (!event) {
    event = await Event.create({
      collegeName: 'Indian Institute of Technology Ropar',
      collegeShortName: 'IIT ROPAR',
      eventTitle: 'FRESHERS 2026',
      eventSubtitle: 'AURA - The Grand Induction & Cultural Fest',
      eventDate: '2026-10-18',
      eventTime: '10:00 AM onwards',
      invitationMessage: "You are warmly invited to join my brother's college fest & grand freshers induction! Experience the campus vibrancy, cultural brilliance, and celebrate this special milestone together.",
      venue: 'Main Auditorium & Sen Hall, Permanent Campus',
      fixedDestination: {
        name: 'IIT Ropar Campus, Rupnagar',
        address: 'IIT Ropar Permanent Campus, Birla Seed Farms, Rupnagar, Punjab 140001',
        lat: 30.9678,
        lng: 76.4732
      },
      photoUrl: '/default-college.jpg',
      brotherName: 'My Brother',
      brotherDepartment: 'Computer Science & Engineering',
      contactInfo: {
        email: 'events@iitrpr.ac.in',
        phone: '+91 98765 43210',
        helpline: 'Student Affairs Desk: +91 1881 242100'
      }
    });
  }
  return event;
}

// GET event details
router.get('/', async (req, res) => {
  try {
    const event = await getOrCreateEvent();
    res.json({ success: true, event });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ success: false, message: 'Server error fetching event details', error: error.message });
  }
});

// UPDATE event details (Editable college details, date, title, fixed coords, etc.)
router.put('/', async (req, res) => {
  try {
    let event = await getOrCreateEvent();
    const updatableFields = [
      'collegeName',
      'collegeShortName',
      'eventTitle',
      'eventSubtitle',
      'eventDate',
      'eventTime',
      'invitationMessage',
      'venue',
      'fixedDestination',
      'brotherName',
      'brotherDepartment',
      'contactInfo',
      'photoUrl'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    event.updatedAt = new Date();
    await event.save();
    res.json({ success: true, message: 'Event details updated successfully', event });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, message: 'Failed to update event', error: error.message });
  }
});

// POST Upload college photograph (saves as Data URL directly in MongoDB, 100% Vercel Serverless compatible)
router.post('/upload-photo', upload.single('collegePhoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const base64Data = req.file.buffer.toString('base64');
    const photoDataUrl = `data:${req.file.mimetype};base64,${base64Data}`;

    // Optionally also save to disk if uploads directory exists/writable
    try {
      const uploadDir = path.join(__dirname, '../uploads');
      if (fs.existsSync(uploadDir)) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
        fs.writeFileSync(path.join(uploadDir, 'college-' + uniqueSuffix + ext), req.file.buffer);
      }
    } catch (e) {
      // Ignore disk write errors in read-only serverless environments
    }

    const event = await getOrCreateEvent();
    event.photoUrl = photoDataUrl;
    event.updatedAt = new Date();
    await event.save();

    res.json({
      success: true,
      message: 'College photograph uploaded and saved successfully!',
      photoUrl: photoDataUrl,
      event
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ success: false, message: 'Failed to upload photo', error: error.message });
  }
});

module.exports = router;
