import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function SimpleMap() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Get the current position using the browser's geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  if (!location) {
    return <div>Loading map...</div>; // Display a loading message while waiting for location
  }

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer center={location} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={location} icon={icon}>
          <Popup>
            <div>
              <h3>Your Location</h3>
              <p><strong>Latitude:</strong> {location[0].toFixed(5)}</p>
              <p><strong>Longitude:</strong> {location[1].toFixed(5)}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default SimpleMap;
