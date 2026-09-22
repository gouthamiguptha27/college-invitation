# College Invitation & Travel Route Web Application 🎓

A full-stack, responsive web application designed for a brother's college celebration (e.g., **FRESHERS 2026** at **IIT Ropar** or customizable to any college).

---

## 🌟 Key Highlights & Features

1. **Fixed College Destination & Dynamic Source Routing**:
   - The college destination is locked for all guests (**IIT Ropar Campus, Rupnagar, Punjab** or customized).
   - Guests enter or pick their source location (e.g., **Hyderabad, Secunderabad, Shamshabad, Warangal, Bangalore, Delhi NCR, Chandigarh, etc.**).
   - Real-time road distance (km), estimated drive time, rail transit time, and flight guidance.
   - Interactive Leaflet/OpenStreetMap routing with glowing polylines and animated pins.

2. **Personalized VIP Invitation Card**:
   - Displays:
     - *"You're invited to [FRESHERS 2026] at [IIT ROPAR]"*
     - 📍 **From:** [Selected Source]
     - 🏫 **To:** [Fixed College Destination]
     - 📅 **Date:** [Event Date]
     - ⏰ **Time:** [Event Time]
     - Unique Pass ID & QR stub.
   - **Download as Image (PNG)** (powered by `html2canvas` with celebratory confetti).
   - **Download as PDF** (powered by `jspdf`).
   - **Direct WhatsApp Share** (formats full message and personalized link).
   - **Copy Shareable Link** with URL query parameters (`?from=Hyderabad&guest=Name`).
   - **Add to Calendar** (.ics and direct Google Calendar link).

3. **College Photograph System**:
   - Prominently displays the college photograph across the **Hero Section**, **Invitation Card**, and **College Information Section**.
   - Built-in **"Upload Brother's College Photo"** modal with drag-and-drop file upload (`/api/event/upload-photo`).
   - Live photo update that persists in MongoDB and backend uploads without restarting.

4. **Event Schedule & Campus Highlights**:
   - Day-long event itinerary timeline (Welcome Reception, Inaugural Induction, Fellowship Lunch, Cultural Fest, Campus Sunset Tour, DJ Night).
   - Campus landmarks, brother's batch note, and student coordinator contact information.

5. **RSVP & Guest Confirmation**:
   - Guests can confirm attendance, specify party count and dietary preferences.
   - Submissions persist directly to **MongoDB**.

---

## 🚀 Running Locally

### Prerequisites
- **Node.js** (v18+ or v22+)
- **MongoDB** (running locally or MongoDB Atlas)

### 1. Start the Backend API Server
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
```

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

Open your browser and visit: **`http://localhost:5173/`**
