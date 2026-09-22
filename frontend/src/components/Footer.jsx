import React from 'react';
import { Heart, Award, ArrowUp } from 'lucide-react';

export default function Footer({ event }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          {event?.collegeName || 'Indian Institute of Technology Ropar'}
        </div>
        <p className="footer-sub">
          {event?.eventTitle || 'FRESHERS 2026'} &bull; Dedicated to my brother & the vibrant batch of {event?.collegeShortName || 'IIT Ropar'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
          <span>Created with</span>
          <Heart size={14} color="#f43f5e" fill="#f43f5e" />
          <span>for family, friends, and esteemed guests</span>
        </div>

        <div>
          <button onClick={scrollToTop} className="btn-pill btn-secondary" style={{ fontSize: '0.78rem', padding: '0.4rem 1rem' }}>
            <ArrowUp size={14} />
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
