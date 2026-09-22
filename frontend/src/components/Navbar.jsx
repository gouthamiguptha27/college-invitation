import React from 'react';
import { Sparkles, Camera, MapPin, Calendar, Users, Award } from 'lucide-react';

export default function Navbar({ event, onOpenSettings }) {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <a href="#hero" className="nav-brand">
          <div className="nav-logo-badge">
            <Award size={22} color="#fbbf24" />
          </div>
          <div>
            <div className="nav-title">{event?.collegeShortName || 'IIT ROPAR'}</div>
            <div className="nav-subtitle">{event?.eventTitle || 'FRESHERS 2026'}</div>
          </div>
        </a>

        <nav className="nav-links">
          <a href="#route-planner" className="nav-link">Plan Route</a>
          <a href="#invitation-card" className="nav-link">Invitation Pass</a>
          <a href="#schedule" className="nav-link">Schedule</a>
          <a href="#campus-info" className="nav-link">College Info</a>
          <a href="#rsvp" className="nav-link">RSVP</a>
          
          <button
            onClick={onOpenSettings}
            className="btn-pill btn-gold-outline"
            title="Upload Brother's College Photo or Edit Event"
          >
            <Camera size={15} />
            <span>Customize Photo</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
