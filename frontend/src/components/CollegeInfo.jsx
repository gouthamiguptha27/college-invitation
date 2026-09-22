import React from 'react';
import { Building2, MapPin, Mail, Phone, ExternalLink, Camera, GraduationCap } from 'lucide-react';

export default function CollegeInfo({ event, onOpenSettings }) {
  return (
    <section id="campus-info" className="section-wrapper">
      <div>
        <span className="section-tag">Campus & Host Highlights</span>
        <h2 className="section-title">About The College & Host</h2>
        <p className="section-desc">
          Get to know more about the campus, venue amenities, and your host coordinator.
        </p>
      </div>

      <div className="route-grid" style={{ marginTop: '2.5rem' }}>
        {/* Left Side: College Photograph Card */}
        <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
            <img
              src={event?.photoUrl || '/default-college.jpg'}
              alt={event?.collegeName || 'Campus'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = '/default-college.jpg';
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1.25rem',
              background: 'linear-gradient(to top, rgba(7, 12, 24, 0.95), transparent)'
            }}>
              <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.25rem' }}>
                {event?.collegeName || 'Indian Institute of Technology Ropar'}
              </div>
              <div style={{ color: 'var(--accent-gold)', fontSize: '0.85rem' }}>
                Permanent Campus, Rupnagar
              </div>
            </div>

            <button
              onClick={onOpenSettings}
              className="btn-pill btn-primary"
              style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
            >
              <Camera size={14} />
              <span>Change Photo</span>
            </button>
          </div>

          <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Recognized as one of India's premier Institutes of National Importance, the picturesque 500+ acre campus combines world-class research facilities, futuristic eco-architecture, and a vibrant community of scholars and student innovators.
            </p>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0', fontSize: '0.88rem' }}>
                <MapPin size={18} color="var(--accent-cyan)" />
                <span>{event?.fixedDestination?.address || 'Rupnagar, Punjab 140001, India'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0', fontSize: '0.88rem' }}>
                <Mail size={18} color="var(--accent-gold)" />
                <span>{event?.contactInfo?.email || 'events@iitrpr.ac.in'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#e2e8f0', fontSize: '0.88rem' }}>
                <Phone size={18} color="var(--accent-emerald)" />
                <span>{event?.contactInfo?.helpline || 'Helpline: +91 1881 242100'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Brother's Note & Host Desk */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#050b14'
              }}>
                <GraduationCap size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                  A Personal Note from {event?.brotherName || "My Brother"}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                  {event?.brotherDepartment || 'Department of Computer Science & Engineering'}
                </div>
              </div>
            </div>

            <p style={{ color: '#cbd5e1', fontStyle: 'italic', fontSize: '0.95rem', lineHeight: '1.65', marginBottom: '1.25rem' }}>
              "Stepping into college has been an extraordinary chapter filled with ambition, discovery, and lifelong friendships. Having our close family and dearest friends here to share in this celebration means the world to me. We have arranged transport assistance and campus hosts to ensure your visit is completely comfortable and memorable!"
            </p>

            <div style={{
              padding: '1rem',
              borderRadius: '10px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)'
            }}>
              💡 <strong>Travel Tip:</strong> If arriving by train, look out for student volunteer desks at Rupnagar Station or Chandigarh Junction with shuttle transfers to the campus gates.
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem 2rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
              Guest Support & Coordination Team
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hospitality Desk</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--accent-gold-light)', fontWeight: 600 }}>+91 98765 43210</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Route & Parking Queries</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Gate 1 Parking Lot</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
