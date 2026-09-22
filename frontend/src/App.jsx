import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RoutePlanner from './components/RoutePlanner';
import InvitationCard from './components/InvitationCard';
import EventSchedule from './components/EventSchedule';
import CollegeInfo from './components/CollegeInfo';
import RSVPSection from './components/RSVPSection';
import Footer from './components/Footer';
import PhotoUploaderModal from './components/PhotoUploaderModal';
import { fetchEventDetails, fetchRouteInfo, saveInvitation } from './services/api';
import confetti from 'canvas-confetti';
import './App.css';

export default function App() {
  const [event, setEvent] = useState(null);
  const [sourceQuery, setSourceQuery] = useState('Hyderabad');
  const [guestName, setGuestName] = useState('Honored Guest');
  const [routeData, setRouteData] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [inviteCode, setInviteCode] = useState('INV-AURA26');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize event and parse URL parameters
  useEffect(() => {
    async function init() {
      // 1. Fetch Event details from server / MongoDB
      const eventData = await fetchEventDetails();
      setEvent(eventData);

      // 2. Parse URL parameters if guest opened a shared invitation link
      const urlParams = new URLSearchParams(window.location.search);
      const urlFrom = urlParams.get('from') || urlParams.get('source');
      const urlGuest = urlParams.get('guest');
      const urlCode = urlParams.get('code');

      const initialSource = urlFrom || 'Hyderabad';
      const initialGuest = urlGuest || 'Honored Guest';

      setSourceQuery(initialSource);
      setGuestName(initialGuest);
      if (urlCode) setInviteCode(urlCode);

      // 3. Compute initial route
      calculateRoute(initialSource, initialGuest, eventData);
    }

    init();
  }, []);

  // Calculate route and save invitation
  const calculateRoute = async (source, guest = guestName, eventObj = event) => {
    if (!source || !source.trim()) return;
    try {
      setLoadingRoute(true);
      const res = await fetchRouteInfo(source);
      if (res.success && res.route) {
        setRouteData(res.route);

        // Record invitation in MongoDB
        try {
          const invRes = await saveInvitation({
            guestName: guest,
            sourceLocation: res.route.source.name,
            sourceCoords: { lat: res.route.source.lat, lng: res.route.source.lng },
            distanceKm: res.route.distanceKm,
            durationText: res.route.durationText,
            travelModeRecommendations: {
              drive: res.route.driveTime,
              train: res.route.trainTime,
              flight: res.route.flightTime
            }
          });
          if (invRes.success && invRes.invitation) {
            setInviteCode(invRes.invitation.inviteCode);
          }
        } catch (e) {
          console.warn('Could not record invitation pass in DB:', e);
        }
      }
    } catch (err) {
      console.error('Failed to compute route:', err);
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleGenerateInvitation = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
    const el = document.getElementById('invitation-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPlanner = () => {
    const el = document.getElementById('route-planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToRoute = () => {
    const el = document.getElementById('route-planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar event={event} onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Hero Section with College Background */}
      <HeroSection
        event={event}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onScrollToPlanner={scrollToPlanner}
      />

      {/* Route Planner & Map: Source Location -> Fixed College Destination */}
      <RoutePlanner
        event={event}
        sourceQuery={sourceQuery}
        setSourceQuery={setSourceQuery}
        routeData={routeData}
        loadingRoute={loadingRoute}
        onCalculateRoute={(src) => calculateRoute(src, guestName)}
        onGenerateInvitation={handleGenerateInvitation}
      />

      {/* Personalized VIP Invitation Pass */}
      <InvitationCard
        event={event}
        routeData={routeData}
        guestName={guestName}
        setGuestName={setGuestName}
        inviteCode={inviteCode}
        onScrollToRoute={scrollToRoute}
      />

      {/* Program Schedule / Day Timeline */}
      <EventSchedule event={event} />

      {/* Campus Info, Brother's Personal Note & Contacts */}
      <CollegeInfo
        event={event}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* RSVP Submission to MongoDB */}
      <RSVPSection
        event={event}
        sourceLocation={routeData?.source?.name || sourceQuery}
        guestName={guestName}
      />

      {/* Footer */}
      <Footer event={event} />

      {/* Upload College Photograph & Event Settings Modal */}
      <PhotoUploaderModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        event={event}
        onEventUpdated={(updated) => setEvent(updated)}
      />
    </div>
  );
}
