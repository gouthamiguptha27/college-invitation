const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_invitation';

// Cached MongoDB Connection for Serverless (Vercel) & Local execution
let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  try {
    const db = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.warn('⚠️ MongoDB connection error / working offline:', err.message);
  }
}

// Middleware to ensure DB connection on every serverless request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded college photos statically if local
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
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Serve frontend build if accessed through Express directly
const distPath = path.join(__dirname, '../dist');
const localHtmlPath = path.join(__dirname, 'index.html');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  if (fs.existsSync(localHtmlPath)) {
    return res.sendFile(localHtmlPath);
  }
  res.send('College Invitation App is starting up...');
});

// Start listening if run directly (local node execution)
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 College Invitation Backend running on http://localhost:${PORT}`);
    });
  });
}

// Export for Vercel Serverless Function
module.exports = app;
