import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Lock,
  Compass,
  Car,
  Train,
  Plane,
  Clock,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import MapView from './MapView';

export default function RoutePlanner({
  event,
  sourceQuery,
  setSourceQuery,
  routeData,
  loadingRoute,
  onCalculateRoute,
  onGenerateInvitation
}) {
  const [activeTravelTab, setActiveTravelTab] = useState('driving');

  const popularSources = [
    'Hyderabad',
    'Secunderabad',
    'Shamshabad',
    'Warangal',
    'Karimnagar',
    'Bangalore',
    'New Delhi',
    'Chandigarh'
  ];

  const handleQuickSelect = (city) => {
    setSourceQuery(city);
    onCalculateRoute(city);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (sourceQuery.trim()) {
      onCalculateRoute(sourceQuery);
    }
  };

  return (
    <section id="route-planner" className="section-wrapper">
      <div>
        <span className="section-tag">Smart Route & Distance Calculator</span>
        <h2 className="section-title">Plan Your Journey to Campus</h2>
        <p className="section-desc">
          The college destination is locked for all attendees. Choose or type your starting city to calculate road distance, travel duration, transit options, and view the interactive map.
        </p>
      </div>

      <div className="route-grid">
        {/* Left Side: Input & Stats */}
        <div className="glass-panel route-input-panel">
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Source Input */}
            <div className="location-box">
              <div className="loc-label-row">
                <label className="loc-label" style={{ color: '#38bdf8' }}>
                  <MapPin size={16} />
                  <span>Your Source Location</span>
                </label>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Enter your city / area</span>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <input
                  type="text"
                  value={sourceQuery}
                  onChange={(e) => setSourceQuery(e.target.value)}
                  placeholder="e.g. Hyderabad, Secunderabad, Shamshabad..."
                  className="custom-input"
                  required
                />
                <button
                  type="submit"
                  disabled={loadingRoute}
                  className="btn-pill btn-primary"
                  style={{ whiteSpace: 'nowrap', padding: '0.75rem 1.4rem' }}
                >
                  {loadingRoute ? 'Routing...' : 'Calculate'}
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div style={{ marginTop: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Quick Popular Telangana & National Hubs:
                </div>
                <div className="quick-tags">
                  {popularSources.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleQuickSelect(city)}
                      className={`city-pill ${sourceQuery.toLowerCase() === city.toLowerCase() ? 'active' : ''}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Destination Display (FIXED - Cannot Be Changed) */}
            <div className="location-box fixed-dest">
              <div className="loc-label-row">
                <div className="loc-label" style={{ color: 'var(--accent-gold)' }}>
                  <Compass size={16} />
                  <span>Destination College</span>
                </div>
                <div className="loc-badge-fixed">
                  <Lock size={12} />
                  <span>FIXED DESTINATION</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                <div style={{ fontSize: '1.6rem' }}>🏫</div>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                    {event?.fixedDestination?.name || 'IIT Ropar Campus'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {event?.fixedDestination?.address || 'Permanent Campus, Rupnagar, Punjab 140001'}
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Route Calculation Metrics */}
          {routeData && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e2e8f0' }}>
                  📍 {routeData.source.name} ➔ 🏫 {routeData.destination.name}
                </div>
              </div>

              {/* Travel Stats Cards */}
              <div className="travel-stats-grid">
                <div className="stat-chip">
                  <div className="stat-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                    <Navigation size={18} />
                  </div>
                  <div className="stat-val">{routeData.distanceKm} km</div>
                  <div className="stat-sub">Road Distance</div>
                </div>

                <div className="stat-chip">
                  <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                    <Car size={18} />
                  </div>
                  <div className="stat-val">{routeData.durationText}</div>
                  <div className="stat-sub">Estimated Drive</div>
                </div>

                <div className="stat-chip">
                  <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                    <Train size={18} />
                  </div>
                  <div className="stat-val">{routeData.trainTime}</div>
                  <div className="stat-sub">By Rail/Express</div>
                </div>
              </div>

              {/* Transit Guidance Highlights */}
              <div className="transit-advice-list">
                {routeData.transitGuidance && routeData.transitGuidance.map((guide, idx) => (
                  <div key={idx} className="advice-card">
                    <div>
                      <div className="advice-mode">{guide.mode}</div>
                      <div className="advice-text">{guide.details}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Generate Invitation Trigger */}
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button
                  onClick={onGenerateInvitation}
                  className="btn-pill btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.85rem 1.5rem' }}
                >
                  <Sparkles size={18} />
                  <span>Generate Your Personalized Invitation Card</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Leaflet Interactive Map */}
        <div style={{ height: '100%', minHeight: '440px' }}>
          <MapView
            sourceCoords={routeData ? { lat: routeData.source.lat, lng: routeData.source.lng } : { lat: 17.3850, lng: 78.4867 }}
            destCoords={event?.fixedDestination ? { lat: event.fixedDestination.lat, lng: event.fixedDestination.lng } : { lat: 30.9678, lng: 76.4732 }}
            coordinates={routeData ? routeData.coordinates : []}
            sourceName={routeData ? routeData.source.name : 'Hyderabad'}
            destName={event?.collegeShortName || 'IIT ROPAR'}
          />
        </div>
      </div>
    </section>
  );
}
