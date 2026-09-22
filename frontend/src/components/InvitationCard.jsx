import React, { useRef, useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  CalendarPlus,
  ArrowRight,
  Send,
  FileDown,
  Navigation
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';

export default function InvitationCard({
  event,
  routeData,
  guestName,
  setGuestName,
  inviteCode,
  onScrollToRoute
}) {
  const cardRef = useRef(null);
  const [downloadingImg, setDownloadingImg] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Trigger celebratory confetti effect
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Download Invitation as High-Res Image (PNG)
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setDownloadingImg(true);
      triggerCelebration();
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0d1527'
      });
      const link = document.createElement('a');
      link.download = `Invitation-${(guestName || 'Guest').replace(/\s+/g, '_')}-${event?.collegeShortName || 'Event'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Image export failed:', err);
      alert('Unable to capture invitation image. You can take a screenshot or try PDF download.');
    } finally {
      setDownloadingImg(false);
    }
  };

  // Download Invitation as PDF
  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      setDownloadingPdf(true);
      triggerCelebration();
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0d1527'
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Invitation-${(guestName || 'Guest').replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Share via WhatsApp
  const handleShareWhatsApp = () => {
    const inviteLink = `${window.location.origin}${window.location.pathname}?from=${encodeURIComponent(routeData?.source?.name || 'Hyderabad')}&guest=${encodeURIComponent(guestName || 'Friend')}&code=${inviteCode || ''}`;
    const text = `🎓 *YOU'RE INVITED TO ${event?.eventTitle || 'FRESHERS'} AT ${event?.collegeShortName || 'IIT ROPAR'}!*
    
Dear ${guestName || 'Friend'},
You have been warmly invited to celebrate with us!

📍 *From:* ${routeData?.source?.name || 'Your City'}
🏫 *To:* ${event?.collegeName || 'IIT Ropar'}
📅 *Date:* ${event?.eventDate || 'October 18, 2026'}
⏰ *Time:* ${event?.eventTime || '10:00 AM onwards'}
🚗 *Distance:* ${routeData?.distanceKm || 'Direct'} km

View your personalized route and invitation pass here:
${inviteLink}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Copy Invitation Link
  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}${window.location.pathname}?from=${encodeURIComponent(routeData?.source?.name || 'Hyderabad')}&guest=${encodeURIComponent(guestName || 'Guest')}&code=${inviteCode || ''}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Add to Calendar (.ics download & Google Calendar link)
  const handleAddToCalendar = () => {
    const title = `${event?.eventTitle || 'FRESHERS 2026'} - ${event?.collegeShortName || 'IIT Ropar'}`;
    const description = `Personalized College Invitation for ${guestName || 'Valued Guest'} from ${routeData?.source?.name || 'Home'}. Join the celebrations with my brother at ${event?.collegeName}!`;
    const location = event?.fixedDestination?.address || event?.venue || 'Campus Auditorium';
    
    // Google Calendar URL
    const startDate = (event?.eventDate || '2026-10-18').replace(/-/g, '') + 'T043000Z'; // 10:00 AM IST in UTC
    const endDate = (event?.eventDate || '2026-10-18').replace(/-/g, '') + 'T143000Z';
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    
    window.open(gCalUrl, '_blank');
  };

  return (
    <section id="invitation-card" className="section-wrapper" style={{ paddingBottom: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <span className="section-tag">Personalized Digital Travel Pass</span>
        <h2 className="section-title">Your Exclusive Invitation Pass</h2>
        <p className="section-desc" style={{ margin: '0 auto' }}>
          Personalized specifically for your journey from <strong>{routeData?.source?.name || 'your city'}</strong> to <strong>{event?.collegeShortName || 'IIT ROPAR'}</strong>.
        </p>

        {/* Guest Name Customizer Input */}
        <div style={{ maxWidth: '400px', margin: '1.5rem auto 0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Type your name for the card..."
            className="custom-input"
            style={{ textAlign: 'center', fontWeight: 600 }}
          />
        </div>
      </div>

      <div className="invitation-card-container">
        {/* Printable Card Area */}
        <div ref={cardRef} className="invitation-card">
          {/* Header with College Photograph Vignette */}
          <div className="card-header-photo-wrap">
            <img
              src={event?.photoUrl || '/default-college.jpg'}
              alt={event?.collegeName || 'College'}
              className="card-header-img"
              onError={(e) => {
                e.target.src = '/default-college.jpg';
              }}
            />
            <div className="card-header-gradient"></div>
            <div className="card-header-badge">
              OFFICIAL VIP PASS
            </div>
            <div className="card-college-stamp">
              <div className="card-college-title">{event?.collegeName || 'Indian Institute of Technology Ropar'}</div>
              <div className="card-college-sub">{event?.eventSubtitle || 'Annual Induction & Cultural Fest'}</div>
            </div>
          </div>

          {/* Card Body */}
          <div className="card-body">
            <div className="card-headline">
              <div className="card-sub-invite">Official Invitation</div>
              <h2 className="card-main-invite-text">
                You're invited to {event?.eventTitle || 'FRESHERS 2026'} at {event?.collegeShortName || 'IIT ROPAR'}
              </h2>
              <div className="card-guest-pill">
                <span>Honored Guest:</span>
                <strong>{guestName || 'Special Guest'}</strong>
              </div>
            </div>

            {/* Travel Route Strip */}
            <div className="card-route-strip">
              <div className="route-endpoint">
                <div className="route-subtag">
                  <MapPin size={13} color="#38bdf8" />
                  <span>From (Your Origin)</span>
                </div>
                <div className="route-placename">{routeData?.source?.name || 'Hyderabad, Telangana'}</div>
              </div>

              <div className="route-connector">
                <div className="route-dist-tag">{routeData?.distanceKm || '1905'} km</div>
                <div className="route-arrow-line">
                  <ArrowRight size={22} />
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {routeData?.durationText || 'Direct Route'}
                </div>
              </div>

              <div className="route-endpoint" style={{ textAlign: 'right' }}>
                <div className="route-subtag" style={{ justifyContent: 'flex-end', color: 'var(--accent-gold)' }}>
                  <Sparkles size={13} />
                  <span>To (Fixed Destination)</span>
                </div>
                <div className="route-placename">{event?.fixedDestination?.name || 'IIT Ropar Campus'}</div>
              </div>
            </div>

            {/* Event Key Details Grid */}
            <div className="card-details-grid">
              <div className="card-detail-item">
                <div className="card-detail-label">
                  <Calendar size={14} color="#38bdf8" />
                  <span>Event Date</span>
                </div>
                <div className="card-detail-val">{event?.eventDate || 'October 18, 2026'}</div>
              </div>

              <div className="card-detail-item">
                <div className="card-detail-label">
                  <Clock size={14} color="#f59e0b" />
                  <span>Event Time</span>
                </div>
                <div className="card-detail-val">{event?.eventTime || '10:00 AM onwards'}</div>
              </div>

              <div className="card-detail-item">
                <div className="card-detail-label">
                  <MapPin size={14} color="#10b981" />
                  <span>Main Venue</span>
                </div>
                <div className="card-detail-val">{event?.venue || 'Senate Hall & Auditorium'}</div>
              </div>
            </div>

            {/* Perforation Divider */}
            <div className="ticket-divider">
              <div className="ticket-notch-left"></div>
              <div className="ticket-notch-right"></div>
            </div>

            {/* Card Footer Stub */}
            <div className="card-footer-bar">
              <div className="pass-code-badge">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pass ID:</span>
                <span className="pass-code">{inviteCode || 'INV-ROPAR26'}</span>
              </div>

              <div className="brother-signoff">
                Warmly invited by <strong>{event?.brotherName || "Brother"}</strong> & Family
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Below Card */}
        <div className="invitation-actions">
          <button
            onClick={onScrollToRoute}
            className="btn-pill btn-secondary"
            title="Inspect Travel Map"
          >
            <Navigation size={16} />
            <span>View Route</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={downloadingImg}
            className="btn-pill btn-primary"
            title="Download Invitation Card as PNG"
          >
            <Download size={16} />
            <span>{downloadingImg ? 'Generating PNG...' : 'Download as Image (PNG)'}</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
            className="btn-pill btn-secondary"
            title="Download Invitation Card as PDF"
          >
            <FileDown size={16} />
            <span>{downloadingPdf ? 'Exporting PDF...' : 'Download as PDF'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="btn-pill"
            style={{ background: '#25D366', color: '#ffffff' }}
            title="Share directly on WhatsApp"
          >
            <Send size={16} />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="btn-pill btn-secondary"
            title="Copy unique link to clipboard"
          >
            {copiedLink ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Invitation Link'}</span>
          </button>

          <button
            onClick={handleAddToCalendar}
            className="btn-pill btn-secondary"
            title="Add to Google Calendar"
          >
            <CalendarPlus size={16} />
            <span>Add to Calendar</span>
          </button>
        </div>
      </div>
    </section>
  );
}
