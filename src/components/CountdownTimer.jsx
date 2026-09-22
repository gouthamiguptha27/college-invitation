import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDateStr, targetTimeStr }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    function updateCountdown() {
      // Default fallback if date not provided
      const target = new Date(targetDateStr ? `${targetDateStr}T10:00:00` : '2026-10-18T10:00:00');
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr, targetTimeStr]);

  if (timeLeft.isPast) {
    return (
      <div className="countdown-box">
        <div className="time-unit" style={{ flex: '1 1 100%', borderColor: 'var(--accent-emerald)' }}>
          <div className="time-val" style={{ color: 'var(--accent-emerald)' }}>🎉 EVENT IS LIVE 🎉</div>
          <div className="time-label">Celebrations Underway</div>
        </div>
      </div>
    );
  }

  return (
    <div className="countdown-box">
      <div className="time-unit">
        <div className="time-val">{String(timeLeft.days).padStart(2, '0')}</div>
        <div className="time-label">Days</div>
      </div>
      <div className="time-unit">
        <div className="time-val">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="time-label">Hours</div>
      </div>
      <div className="time-unit">
        <div className="time-val">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="time-label">Minutes</div>
      </div>
      <div className="time-unit">
        <div className="time-val">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="time-label">Seconds</div>
      </div>
    </div>
  );
}
