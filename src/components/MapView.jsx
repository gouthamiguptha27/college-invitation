import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function MapView({ sourceCoords, destCoords, coordinates, sourceName, destName }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map if not already initialized
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [23.5, 78.5], // Center of India
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // Add CartoDB Dark Matter tiles for sleek modern aesthetics
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    // Clear previous layers
    layerGroup.clearLayers();

    if (!sourceCoords || !destCoords) return;

    // Custom Source Icon (Neon Blue Pulse Pin)
    const sourceIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(56, 189, 248, 0.4); animation: pulseGlow 2s infinite;"></div>
          <div style="width: 18px; height: 18px; border-radius: 50%; background: #0284c7; border: 3px solid #ffffff; box-shadow: 0 0 10px #38bdf8;"></div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    // Custom Destination Icon (Gold College Cap Pin)
    const destIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: rgba(245, 158, 11, 0.35); animation: pulseGlow 2s infinite;"></div>
          <div style="width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #b45309); border: 3px solid #ffffff; box-shadow: 0 0 14px #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 14px;">
            🎓
          </div>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21]
    });

    // Add Source Marker
    const sMarker = L.marker([sourceCoords.lat, sourceCoords.lng], { icon: sourceIcon })
      .bindPopup(`<strong style="color: #0369a1;">📍 Origin:</strong><br/>${sourceName || 'Your Location'}`);
    layerGroup.addLayer(sMarker);

    // Add Destination Marker
    const dMarker = L.marker([destCoords.lat, destCoords.lng], { icon: destIcon })
      .bindPopup(`<strong style="color: #b45309;">🏫 Fixed College Destination:</strong><br/>${destName || 'College Campus'}`);
    layerGroup.addLayer(dMarker);

    // Draw Route Polyline
    if (coordinates && coordinates.length > 0) {
      // Background glow polyline
      const glowLine = L.polyline(coordinates, {
        color: '#f59e0b',
        weight: 7,
        opacity: 0.35,
        lineCap: 'round'
      });
      layerGroup.addLayer(glowLine);

      // Main vibrant route polyline
      const mainLine = L.polyline(coordinates, {
        color: '#0284c7',
        weight: 4,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round'
      });
      layerGroup.addLayer(mainLine);

      // Fit bounds with padding
      const bounds = L.latLngBounds([
        [sourceCoords.lat, sourceCoords.lng],
        [destCoords.lat, destCoords.lng],
        ...coordinates
      ]);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    } else {
      const bounds = L.latLngBounds([
        [sourceCoords.lat, sourceCoords.lng],
        [destCoords.lat, destCoords.lng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Leaflet map invalidation helper to ensure complete tile rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [sourceCoords, destCoords, coordinates, sourceName, destName]);

  return (
    <div className="map-panel glass-panel" style={{ height: '100%', minHeight: '420px' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '420px' }} />
    </div>
  );
}
