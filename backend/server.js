const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_invitation';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded college photos statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const eventRoutes = require('./routes/eventRoutes');
const routeRoutes = require('./routes/routeRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');

app.use('/api/event', eventRoutes);
app.use('/api/route', routeRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/rsvp', rsvpRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000
  })
  .then(() => {
    console.log('✅ Connected to MongoDB at', MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`🚀 College Invitation Backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ Running server in memory/fallback mode for development...');
    app.listen(PORT, () => {
      console.log(`🚀 College Invitation Backend running (no mongo fallback) on http://localhost:${PORT}`);
    });
  });
