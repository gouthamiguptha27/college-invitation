import React from 'react';
import { Calendar, Clock, Music, Coffee, Utensils, Award, Sparkles } from 'lucide-react';

export default function EventSchedule({ event }) {
  const scheduleItems = [
    {
      time: '09:30 AM - 10:15 AM',
      title: 'Grand Welcome & Registration',
      location: 'Central Entrance & Senate Foyer',
      desc: 'Guest reception, welcome drink, distribution of VIP event badges and campus orientation kits.',
      icon: <Coffee size={18} color="#f59e0b" />
    },
    {
      time: '10:30 AM - 12:30 PM',
      title: 'Inaugural Induction Ceremony',
      location: 'Main Auditorium',
      desc: 'Lamp lighting, welcoming speeches by Director & Deans, batch felicitations, and keynote by distinguished alumni.',
      icon: <Award size={18} color="#38bdf8" />
    },
    {
      time: '12:45 PM - 02:30 PM',
      title: 'Royal Fellowship Gala Lunch',
      location: 'Dining Pavilion & Lawn Gardens',
      desc: 'A lavish multi-cuisine festive lunch celebrating traditional flavours and delicacies for all invited families and guests.',
      icon: <Utensils size={18} color="#10b981" />
    },
    {
      time: '02:45 PM - 05:30 PM',
      title: 'Cultural Extravaganza & Talent Fest',
      location: 'Open Air Amphitheatre',
      desc: 'Music band performances, theatrical skits, traditional fusion dance, and freshers showcase competitions.',
      icon: <Music size={18} color="#ec4899" />
    },
    {
      time: '05:30 PM - 06:30 PM',
      title: 'Guided Campus Sunset Tour',
      location: 'Academic Complex & Riverside Promenade',
      desc: 'Scenic walk exploring the brother’s department, state-of-the-art research labs, and picturesque campus architecture.',
      icon: <Sparkles size={18} color="#fbbf24" />
    },
    {
      time: '07:00 PM - 10:00 PM',
      title: 'Grand Finale & Star DJ Night',
      location: 'Fest Grounds',
      desc: 'High-energy musical night, vibrant laser lights, celebrations, and farewell memories with brother’s batch.',
      icon: <Music size={18} color="#a855f7" />
    }
  ];

  return (
    <section id="schedule" className="section-wrapper">
      <div style={{ textAlign: 'center' }}>
        <span className="section-tag">Program Flow & Itinerary</span>
        <h2 className="section-title">Day-Long Celebration Schedule</h2>
        <p className="section-desc" style={{ margin: '0 auto' }}>
          Explore the curated itinerary prepared for {event?.eventTitle || 'Freshers 2026'}. Every moment is designed to give you an unforgettable college celebration experience.
        </p>
      </div>

      <div className="timeline">
        {scheduleItems.map((item, idx) => (
          <div key={idx} className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div className="timeline-time">{item.time}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {item.icon}
                  <span>{item.location}</span>
                </div>
              </div>
              <h3 className="timeline-title">{item.title}</h3>
              <p className="timeline-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
