import React, { useState } from 'react';
import { Send, CheckCircle2, Users, HeartHandshake } from 'lucide-react';
import { submitRSVP } from '../services/api';

export default function RSVPSection({ event, sourceLocation, guestName }) {
  const [formData, setFormData] = useState({
    name: guestName || '',
    phone: '',
    email: '',
    sourceLocation: sourceLocation || '',
    attendingStatus: 'attending',
    attendeesCount: 1,
    dietaryPreference: 'Vegetarian',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setSubmitting(true);
      const res = await submitRSVP({
        guestName: formData.name,
        phone: formData.phone,
        email: formData.email,
        sourceLocation: formData.sourceLocation || sourceLocation,
        attendingStatus: formData.attendingStatus,
        attendeesCount: formData.attendeesCount,
        dietaryPreference: formData.dietaryPreference,
        message: formData.message
      });

      if (res.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="section-wrapper">
      <div style={{ textAlign: 'center' }}>
        <span className="section-tag">Confirm Your Attendance</span>
        <h2 className="section-title">RSVP for the Celebration</h2>
        <p className="section-desc" style={{ margin: '0 auto' }}>
          Please let us know if you will be joining us so we can arrange personalized hospitality, seating, and meal passes.
        </p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '720px', margin: '2.5rem auto 0', padding: '2.5rem' }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <CheckCircle2 size={36} color="var(--accent-emerald)" />
            </div>
            <h3 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              RSVP Received with Gratitude!
            </h3>
            <p style={{ color: '#cbd5e1', maxWidth: '480px', margin: '0 auto' }}>
              Thank you, <strong>{formData.name}</strong>! Your attendance from <strong>{formData.sourceLocation || sourceLocation || 'your hometown'}</strong> has been registered. We cannot wait to celebrate together!
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn-pill btn-secondary"
              style={{ marginTop: '1.5rem' }}
            >
              Submit Another RSVP
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="rsvp-grid">
              <div className="form-group">
                <label className="form-label">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="custom-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone / WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="custom-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="your.email@domain.com"
                  className="custom-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Travelling From (City / Region)</label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad / Secunderabad"
                  className="custom-input"
                  value={formData.sourceLocation || sourceLocation}
                  onChange={(e) => setFormData({ ...formData, sourceLocation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Will you be attending?</label>
                <select
                  className="custom-input"
                  value={formData.attendingStatus}
                  onChange={(e) => setFormData({ ...formData, attendingStatus: e.target.value })}
                >
                  <option value="attending">Yes, I will happily attend! 🎉</option>
                  <option value="maybe">Tentative / Will confirm soon</option>
                  <option value="declined">Regretfully cannot attend</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Number of Attendees</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="custom-input"
                  value={formData.attendeesCount}
                  onChange={(e) => setFormData({ ...formData, attendeesCount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dietary Preference</label>
                <select
                  className="custom-input"
                  value={formData.dietaryPreference}
                  onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                >
                  <option value="Vegetarian">Pure Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Jain">Jain Friendly</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Special Message / Warm Wishes for Brother</label>
                <textarea
                  rows="3"
                  placeholder="Leave a congratulatory note or any travel accommodation assistance request..."
                  className="custom-input"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn-pill btn-primary"
                style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}
              >
                <Send size={18} />
                <span>{submitting ? 'Submitting...' : 'Confirm RSVP'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
