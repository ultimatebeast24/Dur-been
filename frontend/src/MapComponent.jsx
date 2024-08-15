import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { renderToString } from 'react-dom/server';
import 'leaflet/dist/leaflet.css';

// Convert FontAwesomeIcon to HTML string and create a custom icon
const trashIconHtml = renderToString(<FontAwesomeIcon icon={faTrash} size="2x" />);
const trashCanIcon = new L.DivIcon({
  html: trashIconHtml,
  className: '', // You can add your custom CSS class here if needed
  iconSize: [30, 30], // Adjust the size according to your needs
  iconAnchor: [15, 30], // Adjust anchor based on the size
  popupAnchor: [0, -30], // Position of the popup relative to the icon
});

const locations = [
  { lat: 40.7128, lng: -74.0060, name: "New York" },
  { lat: 34.0522, lng: -118.2437, name: "Los Angeles" },
  { lat: 41.8781, lng: -87.6298, name: "Chicago" },
  { lat: 23.414411, lng: 85.441424, name: "Mesra" },
];

const MapComponent = () => {
  return (
    <MapContainer center={[23.414411, 85.441424]} zoom={15} style={{ height: "100vh", width: "100vh" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location, index) => (
        <Marker key={index} position={[location.lat, location.lng]} icon={trashCanIcon}>
          <Popup>{location.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
