// API Service layer for College Invitation Web App
const BASE_URL = ''; // Relative path uses Vite proxy to http://localhost:5000

export async function fetchEventDetails() {
  try {
    const res = await fetch(`${BASE_URL}/api/event`);
    if (!res.ok) throw new Error('Failed to fetch event');
    const data = await res.json();
    return data.event;
  } catch (err) {
    console.warn('Using default event details fallback:', err);
    return {
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
    };
  }
}

export async function updateEventDetails(eventData) {
  const res = await fetch(`${BASE_URL}/api/event`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  });
  return res.json();
}

export async function uploadCollegePhoto(formData) {
  const res = await fetch(`${BASE_URL}/api/event/upload-photo`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function fetchRouteInfo(sourceCity) {
  const res = await fetch(`${BASE_URL}/api/route?source=${encodeURIComponent(sourceCity)}`);
  if (!res.ok) throw new Error('Failed to calculate route');
  return res.json();
}

export async function fetchRouteSuggestions() {
  try {
    const res = await fetch(`${BASE_URL}/api/route/suggestions`);
    if (!res.ok) throw new Error('Failed to fetch suggestions');
    const data = await res.json();
    return data.suggestions || [];
  } catch (e) {
    return [
      { city: 'Hyderabad', state: 'Telangana', tag: 'Direct flight to Chandigarh / Delhi' },
      { city: 'Secunderabad', state: 'Telangana', tag: 'Direct trains to Punjab/Delhi' },
      { city: 'Shamshabad', state: 'Telangana', tag: 'Airport Hub' },
      { city: 'Warangal', state: 'Telangana', tag: 'Rail connect via Kazipet' },
      { city: 'Bangalore', state: 'Karnataka', tag: 'Direct flights & express trains' },
      { city: 'New Delhi', state: 'Delhi NCR', tag: '4.5 hrs via NH44' },
      { city: 'Chandigarh', state: 'Punjab', tag: '45 mins road drive' }
    ];
  }
}

export async function saveInvitation(invitationData) {
  const res = await fetch(`${BASE_URL}/api/invitations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invitationData)
  });
  return res.json();
}

export async function getInvitationByCode(code) {
  const res = await fetch(`${BASE_URL}/api/invitations/${encodeURIComponent(code)}`);
  return res.json();
}

export async function submitRSVP(rsvpData) {
  const res = await fetch(`${BASE_URL}/api/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rsvpData)
  });
  return res.json();
}

export async function fetchRSVPStats() {
  try {
    const res = await fetch(`${BASE_URL}/api/rsvp`);
    return res.json();
  } catch (e) {
    return { success: false, totalCount: 0, totalGuests: 0 };
  }
}
