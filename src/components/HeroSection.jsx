import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Navigation, Camera } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

export default function HeroSection({ event, onOpenSettings, onScrollToPlanner }) {
  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'October 18, 2026';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <section id="hero" className="hero-wrapper">
      <div className="hero-bg-container">
        <img
          src={event?.photoUrl || '/default-college.jpg'}
          alt={event?.collegeName || 'College Campus'}
          className="hero-bg-img"
          onError={(e) => {
            e.target.src = '/default-college.jpg';
          }}
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-badge-wrap">
          <Sparkles size={16} color="#fbbf24" />
          <span className="hero-badge-text">Personalized College Event Invitation</span>
        </div>

        <div className="hero-college-name">
          {event?.collegeName || 'Indian Institute of Technology Ropar'}
        </div>

        <h1 className="hero-event-title">
          {event?.eventTitle || 'FRESHERS 2026'}
        </h1>

        <p className="hero-event-sub">
          {event?.invitationMessage || 
            "We warmly invite you to join my brother's college celebration! Enter your home city to plan your personalized travel route and generate your VIP invitation pass."}
        </p>

        <div className="hero-meta-row">
          <div className="hero-meta-pill">
            <Calendar size={18} color="#38bdf8" />
            <span>{formatDate(event?.eventDate)}</span>
          </div>
          <div className="hero-meta-pill">
            <Clock size={18} color="#f59e0b" />
            <span>{event?.eventTime || '10:00 AM onwards'}</span>
          </div>
          <div className="hero-meta-pill">
            <MapPin size={18} color="#ec4899" />
            <span>{event?.fixedDestination?.name || 'Main Campus'}</span>
          </div>
        </div>

        <div className="hero-ctas">
          <button onClick={onScrollToPlanner} className="btn-pill btn-primary">
            <Navigation size={17} />
            <span>Plan Your Route & Get Invitation</span>
          </button>

          <button onClick={onOpenSettings} className="btn-pill btn-secondary">
            <Camera size={16} />
            <span>Upload Brother's College Photo</span>
          </button>
        </div>

        <CountdownTimer targetDateStr={event?.eventDate} targetTimeStr={event?.eventTime} />
      </div>
    </section>
  );
}
