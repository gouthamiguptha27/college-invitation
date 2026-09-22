const express = require('express');
const router = express.Router();
const axios = require('axios');
const Event = require('../models/Event');

// Curated geographic coordinates for popular Indian cities & localities
const POPULAR_LOCATIONS = {
  // Telangana & Andhra Hubs (Explicitly requested in prompt)
  'hyderabad': { name: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  'secunderabad': { name: 'Secunderabad, Telangana', lat: 17.4399, lng: 78.4983, state: 'Telangana' },
  'shamshabad': { name: 'Shamshabad, Hyderabad', lat: 17.2505, lng: 78.4285, state: 'Telangana' },
  'warangal': { name: 'Warangal, Telangana', lat: 17.9689, lng: 79.5941, state: 'Telangana' },
  'karimnagar': { name: 'Karimnagar, Telangana', lat: 18.4386, lng: 79.1288, state: 'Telangana' },
  'nizamabad': { name: 'Nizamabad, Telangana', lat: 18.6725, lng: 78.0941, state: 'Telangana' },
  'khammam': { name: 'Khammam, Telangana', lat: 17.2473, lng: 80.1514, state: 'Telangana' },
  'vijayawada': { name: 'Vijayawada, Andhra Pradesh', lat: 16.5062, lng: 80.6480, state: 'Andhra Pradesh' },
  'visakhapatnam': { name: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh' },
  'tirupati': { name: 'Tirupati, Andhra Pradesh', lat: 13.6288, lng: 79.4192, state: 'Andhra Pradesh' },
  'guntur': { name: 'Guntur, Andhra Pradesh', lat: 16.3067, lng: 80.4365, state: 'Andhra Pradesh' },
  'hitec city': { name: 'HITEC City, Hyderabad', lat: 17.4435, lng: 78.3772, state: 'Telangana' },
  'gachibowli': { name: 'Gachibowli, Hyderabad', lat: 17.4401, lng: 78.3489, state: 'Telangana' },
  'kukatpally': { name: 'Kukatpally, Hyderabad', lat: 17.4849, lng: 78.4138, state: 'Telangana' },

  // Major Metros & Hubs
  'bangalore': { name: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'bengaluru': { name: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  'delhi': { name: 'New Delhi', lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  'new delhi': { name: 'New Delhi', lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  'noida': { name: 'Noida, Uttar Pradesh', lat: 28.5355, lng: 77.3910, state: 'Uttar Pradesh' },
  'gurugram': { name: 'Gurugram, Haryana', lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  'gurgaon': { name: 'Gurugram, Haryana', lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  'mumbai': { name: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  'pune': { name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  'chennai': { name: 'Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  'kolkata': { name: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  'jaipur': { name: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  'ahmedabad': { name: 'Ahmedabad, Gujarat', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  'chandigarh': { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, state: 'Chandigarh' },
  'ludhiana': { name: 'Ludhiana, Punjab', lat: 30.9010, lng: 75.8573, state: 'Punjab' },
  'amritsar': { name: 'Amritsar, Punjab', lat: 31.6340, lng: 74.8723, state: 'Punjab' },
  'jalandhar': { name: 'Jalandhar, Punjab', lat: 31.3260, lng: 75.5762, state: 'Punjab' },
  'patiala': { name: 'Patiala, Punjab', lat: 30.3398, lng: 76.3869, state: 'Punjab' },
  'rupnagar': { name: 'Rupnagar (Ropar), Punjab', lat: 30.9664, lng: 76.5331, state: 'Punjab' },
  'ropar': { name: 'Rupnagar (Ropar), Punjab', lat: 30.9664, lng: 76.5331, state: 'Punjab' },
  'mohali': { name: 'Mohali, Punjab', lat: 30.7046, lng: 76.7179, state: 'Punjab' },
  'lucknow': { name: 'Lucknow, Uttar Pradesh', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
  'kanpur': { name: 'Kanpur, Uttar Pradesh', lat: 26.4499, lng: 80.3319, state: 'Uttar Pradesh' },
  'bhopal': { name: 'Bhopal, Madhya Pradesh', lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh' },
  'indore': { name: 'Indore, Madhya Pradesh', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
  'nagpur': { name: 'Nagpur, Maharashtra', lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
  'patna': { name: 'Patna, Bihar', lat: 25.5941, lng: 85.1376, state: 'Bihar' },
  'kochi': { name: 'Kochi, Kerala', lat: 9.9312, lng: 76.2673, state: 'Kerala' },
  'thiruvananthapuram': { name: 'Thiruvananthapuram, Kerala', lat: 8.5241, lng: 76.9366, state: 'Kerala' }
};

// Haversine formula to compute great-circle distance in kilometers
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generate smooth intermediate polyline points along the great circle route
function generateArcPoints(start, end, numPoints = 30) {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints;
    // Quadratic arc curvature for visual beauty on 2D map
    const lat = start.lat + (end.lat - start.lat) * fraction;
    const lng = start.lng + (end.lng - start.lng) * fraction;
    // Add slight natural curvature
    const arcOffset = Math.sin(fraction * Math.PI) * 0.45;
    points.push([lat + arcOffset * 0.5, lng + arcOffset]);
  }
  return points;
}

// Format duration into readable string
function formatDuration(totalHours) {
  if (totalHours < 1) {
    const mins = Math.round(totalHours * 60);
    return `${mins} min`;
  }
  const hrs = Math.floor(totalHours);
  const mins = Math.round((totalHours - hrs) * 60);
  if (mins === 0) return `${hrs} hrs`;
  return `${hrs} hrs ${mins} mins`;
}

// Geocode location string
async function geocodeLocation(query) {
  const clean = query.trim().toLowerCase();

  // 1. Direct match in local dictionary
  if (POPULAR_LOCATIONS[clean]) {
    return POPULAR_LOCATIONS[clean];
  }

  // 2. Partial match in local dictionary
  for (const key of Object.keys(POPULAR_LOCATIONS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return POPULAR_LOCATIONS[key];
    }
  }

  // 3. Fallback to OpenStreetMap Nominatim
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: `${query}, India`,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'CollegeInvitationApp/1.0 (contact@collegeevent.edu)'
      },
      timeout: 3500
    });

    if (res.data && res.data.length > 0) {
      const match = res.data[0];
      return {
        name: match.display_name.split(',').slice(0, 2).join(','),
        lat: parseFloat(match.lat),
        lng: parseFloat(match.lon),
        state: 'India'
      };
    }
  } catch (err) {
    console.warn('Nominatim geocode failed or timed out:', err.message);
  }

  // Default fallback if unknown (Hyderabad as default reference)
  return {
    name: query,
    lat: 17.3850,
    lng: 78.4867,
    state: 'Telangana (Approx)'
  };
}

// GET /api/route/suggestions - Autocomplete quick suggestions
router.get('/suggestions', (req, res) => {
  const suggestions = [
    { city: 'Hyderabad', state: 'Telangana', tag: 'Direct flight to Chandigarh / Delhi' },
    { city: 'Secunderabad', state: 'Telangana', tag: 'Direct trains to Punjab/Delhi' },
    { city: 'Shamshabad (RGIA)', state: 'Telangana', tag: 'Airport Hub' },
    { city: 'Warangal', state: 'Telangana', tag: 'Rail connect via Kazipet' },
    { city: 'Karimnagar', state: 'Telangana', tag: 'Telangana North' },
    { city: 'Nizamabad', state: 'Telangana', tag: 'Telangana West' },
    { city: 'Vijayawada', state: 'Andhra Pradesh', tag: 'Andhra Hub' },
    { city: 'Visakhapatnam', state: 'Andhra Pradesh', tag: 'Coastal Andhra' },
    { city: 'Bangalore', state: 'Karnataka', tag: 'Direct flights & express trains' },
    { city: 'New Delhi', state: 'Delhi NCR', tag: '4.5 hrs via NH44 / Vande Bharat' },
    { city: 'Chandigarh', state: 'Punjab', tag: '45 mins road drive to Ropar' }
  ];
  res.json({ success: true, suggestions });
});

// GET /api/route - Calculate distance, travel time & polyline from source to fixed college destination
router.get('/', async (req, res) => {
  try {
    const { source } = req.query;

    if (!source || !source.trim()) {
      return res.status(400).json({ success: false, message: 'Source location is required' });
    }

    // Retrieve the fixed college destination from database
    const event = await Event.findOne();
    const destination = (event && event.fixedDestination) ? event.fixedDestination : {
      name: 'IIT Ropar, Rupnagar',
      address: 'IIT Ropar Permanent Campus, Rupnagar, Punjab 140001',
      lat: 30.9678,
      lng: 76.4732
    };

    // Geocode source
    const sourceData = await geocodeLocation(source);

    // Calculate direct Haversine distance
    const airDistKm = haversineDistance(
      sourceData.lat,
      sourceData.lng,
      destination.lat,
      destination.lng
    );

    // Road distance is typically ~1.2x to 1.3x straight-line distance
    const roadDistKm = Math.round(airDistKm * 1.25);

    // Driving time estimate (~65 km/h avg including highway stops)
    const drivingHours = (roadDistKm / 65) + (roadDistKm > 500 ? 2.5 : 0.5);
    const driveTimeText = formatDuration(drivingHours);

    // Train time estimate (~75 km/h avg speed)
    const trainHours = (roadDistKm / 75) + 1.5;
    const trainTimeText = formatDuration(trainHours);

    // Flight time estimate
    let flightText = '';
    if (airDistKm > 350) {
      const flightDuration = Math.round((airDistKm / 650) * 10) / 10 + 2.5; // flight + airport buffer
      flightText = `~${formatDuration(flightDuration)} (Fly to Chandigarh IXC / Delhi IGI, then cab/train to campus)`;
    } else {
      flightText = 'Short distance - Direct road travel or express train recommended';
    }

    // Try OSRM route for real road coordinates if feasible (< 2000 km)
    let coordinates = [];
    let isRoadRoute = false;

    if (roadDistKm <= 1200) {
      try {
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${sourceData.lng},${sourceData.lat};${destination.lng},${destination.lat}?overview=simplified&geometries=geojson`;
        const osrmRes = await axios.get(osrmUrl, { timeout: 3500 });
        if (osrmRes.data && osrmRes.data.routes && osrmRes.data.routes.length > 0) {
          const route = osrmRes.data.routes[0];
          coordinates = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
          isRoadRoute = true;
        }
      } catch (e) {
        // Fallback gracefully to smooth geodesic arc
      }
    }

    // If OSRM wasn't used or failed, generate smooth scenic route arc points
    if (!coordinates.length) {
      coordinates = generateArcPoints(
        { lat: sourceData.lat, lng: sourceData.lng },
        { lat: destination.lat, lng: destination.lng },
        40
      );
    }

    // Travel transit guidance
    let transitGuidance = [];
    if (roadDistKm > 1000) {
      transitGuidance = [
        {
          mode: 'Flight + Cab',
          primary: true,
          details: `Fly from ${sourceData.name} to Chandigarh Airport (IXC) or Delhi (DEL). From Chandigarh, IIT Ropar is just 45 km (approx. 50 mins by taxi or bus).`
        },
        {
          mode: 'Train',
          primary: false,
          details: `Direct or connecting express trains to Rupnagar (RPAR) or Chandigarh Junction. Daily Vande Bharat & Shatabdi connect Delhi to Ropar/Anandpur Sahib.`
        },
        {
          mode: 'Road Trip',
          primary: false,
          details: `${roadDistKm} km via National Highway corridors (NH44). Scenic cross-country journey.`
        }
      ];
    } else if (roadDistKm > 150) {
      transitGuidance = [
        {
          mode: 'Train / Express',
          primary: true,
          details: `Take Vande Bharat Express or Jan Shatabdi directly to Rupnagar or Chandigarh. Station is ~6 km from IIT Ropar campus.`
        },
        {
          mode: 'Car / Cab',
          primary: true,
          details: `${roadDistKm} km via National Highway. Approx ${driveTimeText} drive with smooth four-lane highway connectivity.`
        },
        {
          mode: 'Intercity Bus',
          primary: false,
          details: `Frequent AC Volvo buses run between ISBT Sector 43 Chandigarh / Delhi Kashmiri Gate and Rupnagar.`
        }
      ];
    } else {
      transitGuidance = [
        {
          mode: 'Cab / Private Vehicle',
          primary: true,
          details: `Direct drive: ${roadDistKm} km taking ~${driveTimeText}. Direct campus entry via Main Gate on Ropar Bypass.`
        },
        {
          mode: 'Local Shuttle / Bus',
          primary: false,
          details: `Regular campus shuttles and local buses connect directly to the IIT Ropar Permanent Campus.`
        }
      ];
    }

    res.json({
      success: true,
      route: {
        source: {
          query: source,
          name: sourceData.name,
          lat: sourceData.lat,
          lng: sourceData.lng,
          state: sourceData.state
        },
        destination: {
          name: destination.name,
          address: destination.address,
          lat: destination.lat,
          lng: destination.lng
        },
        distanceKm: roadDistKm,
        airDistanceKm: Math.round(airDistKm),
        durationText: driveTimeText,
        driveTime: driveTimeText,
        trainTime: trainTimeText,
        flightTime: flightText,
        coordinates: coordinates,
        isRoadRoute: isRoadRoute,
        transitGuidance: transitGuidance
      }
    });

  } catch (error) {
    console.error('Route calculation error:', error);
    res.status(500).json({ success: false, message: 'Route calculation error', error: error.message });
  }
});

module.exports = router;
