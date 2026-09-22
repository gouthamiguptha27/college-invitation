import React, { useState } from 'react';
import { X, Upload, Camera, Check, Save, Image as ImageIcon } from 'lucide-react';
import { uploadCollegePhoto, updateEventDetails } from '../services/api';

export default function PhotoUploaderModal({ isOpen, onClose, event, onEventUpdated }) {
  if (!isOpen) return null;

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(event?.photoUrl || '');
  const [uploading, setUploading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Editable fields
  const [formData, setFormData] = useState({
    collegeName: event?.collegeName || '',
    collegeShortName: event?.collegeShortName || '',
    eventTitle: event?.eventTitle || '',
    eventSubtitle: event?.eventSubtitle || '',
    eventDate: event?.eventDate || '',
    eventTime: event?.eventTime || '',
    venue: event?.venue || '',
    brotherName: event?.brotherName || '',
    brotherDepartment: event?.brotherDepartment || '',
    destName: event?.fixedDestination?.name || '',
    destAddress: event?.fixedDestination?.address || ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      const data = new FormData();
      data.append('collegePhoto', selectedFile);

      const res = await uploadCollegePhoto(data);
      if (res.success) {
        setSuccessMsg('College photo uploaded and updated across all sections!');
        onEventUpdated(res.event);
        setTimeout(() => setSuccessMsg(''), 3500);
      } else {
        alert(res.message || 'Failed to upload photo');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading photograph');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const payload = {
        collegeName: formData.collegeName,
        collegeShortName: formData.collegeShortName,
        eventTitle: formData.eventTitle,
        eventSubtitle: formData.eventSubtitle,
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        venue: formData.venue,
        brotherName: formData.brotherName,
        brotherDepartment: formData.brotherDepartment,
        fixedDestination: {
          ...event.fixedDestination,
          name: formData.destName,
          address: formData.destAddress
        }
      };

      const res = await updateEventDetails(payload);
      if (res.success) {
        setSuccessMsg('College & event details updated successfully!');
        onEventUpdated(res.event);
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating event details');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Camera size={22} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', fontFamily: 'var(--font-heading)' }}>
              Upload College Photo & Event Settings
            </h3>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--accent-emerald)',
            color: '#6ee7b7',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <Check size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. PHOTO UPLOAD SECTION */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            Step 1: Brother's College Photograph
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Upload the actual photo of your brother's college. It will automatically update in the <strong>Hero Section</strong>, <strong>Personalized Invitation Card</strong>, and <strong>College Showcase</strong>.
          </p>

          <label className="dropzone">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            {previewUrl ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ maxHeight: '160px', width: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-gold)' }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                  Click to select a different photo from your device
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={32} color="var(--accent-gold)" />
                <div style={{ fontWeight: 600, color: '#ffffff' }}>Click to Browse or Drag College Photo Here</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Supports JPG, PNG, WEBP (Max 10MB)</div>
              </div>
            )}
          </label>

          {selectedFile && (
            <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
              <button
                type="button"
                onClick={handleUploadPhoto}
                disabled={uploading}
                className="btn-pill btn-primary"
              >
                <Upload size={16} />
                <span>{uploading ? 'Uploading...' : 'Save & Apply Photograph'}</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. EVENT & COLLEGE DETAILS FORM */}
        <form onSubmit={handleSaveSettings}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
            Step 2: Customize College & Event Information
          </div>

          <div className="rsvp-grid">
            <div className="form-group">
              <label className="form-label">College Full Name</label>
              <input
                type="text"
                className="custom-input"
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College Short Name (e.g. IIT ROPAR)</label>
              <input
                type="text"
                className="custom-input"
                value={formData.collegeShortName}
                onChange={(e) => setFormData({ ...formData, collegeShortName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Title</label>
              <input
                type="text"
                className="custom-input"
                value={formData.eventTitle}
                onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Subtitle / Tagline</label>
              <input
                type="text"
                className="custom-input"
                value={formData.eventSubtitle}
                onChange={(e) => setFormData({ ...formData, eventSubtitle: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Date</label>
              <input
                type="date"
                className="custom-input"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Time</label>
              <input
                type="text"
                className="custom-input"
                value={formData.eventTime}
                onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                placeholder="10:00 AM onwards"
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Campus Venue / Hall</label>
              <input
                type="text"
                className="custom-input"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brother's Name</label>
              <input
                type="text"
                className="custom-input"
                value={formData.brotherName}
                onChange={(e) => setFormData({ ...formData, brotherName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brother's Department / Branch</label>
              <input
                type="text"
                className="custom-input"
                value={formData.brotherDepartment}
                onChange={(e) => setFormData({ ...formData, brotherDepartment: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Fixed College Address</label>
              <input
                type="text"
                className="custom-input"
                value={formData.destAddress}
                onChange={(e) => setFormData({ ...formData, destAddress: e.target.value })}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn-pill btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={savingSettings} className="btn-pill btn-primary">
              <Save size={16} />
              <span>{savingSettings ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
