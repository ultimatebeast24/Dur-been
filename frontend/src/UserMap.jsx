import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { renderToString } from 'react-dom/server';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

// Convert FontAwesomeIcon to HTML string and create a custom icon
const trashIconHtml = renderToString(
  <FontAwesomeIcon icon={faTrash} size="2x" />
);
const trashCanIcon = new L.DivIcon({
  html: trashIconHtml,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Custom hook to update map center and routing
const Routing = ({ userLocation, nearestBin }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation && nearestBin) {
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userLocation.lat, userLocation.lng),
          L.latLng(nearestBin.lat, nearestBin.lng),
        ],
        routeWhileDragging: false,
        createMarker: () => null,
      }).addTo(map);

      return () => {
        map.removeControl(routingControl);
      };
    }
  }, [map, userLocation, nearestBin]);

  return null;
};

const UserMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [bins, setBins] = useState([]);
  const [nearestBin, setNearestBin] = useState(null);

  const binLocations = [
    { lat: 23.414411, lng: 85.441424, name: "Mesra" },
    { lat: 23.417, lng: 85.442, name: "Hostel 1" },
    { lat: 23.416, lng: 85.438, name: "Hostel 2" },
    { lat: 23.415, lng: 85.444, name: "Hostel 3" },
    { lat: 23.413, lng: 85.439, name: "Hostel 4" },
  ];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLoc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUserLocation(userLoc);

      const nearest = binLocations.reduce((nearest, bin) => {
        const distance = getDistance(userLoc, bin);
        if (distance < getDistance(userLoc, nearest)) {
          return bin;
        }
        return nearest;
      }, binLocations[0]);
      setNearestBin(nearest);

      setBins(binLocations);
    });
  }, []);

  const getDistance = (location1, location2) => {
    const lat1 = location1.lat;
    const lng1 = location1.lng;
    const lat2 = location2.lat;
    const lng2 = location2.lng;
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Nearest Bin: {nearestBin ? nearestBin.name : 'Loading...'}
      </h1>
      <div className="w-full h-full">
        <MapContainer
          center={userLocation}
          zoom={15}
          style={{ height: "80vh", width: "100%" }}
          className="rounded-lg shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={L.icon({
                iconUrl: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            />
          )}

          {bins.map((bin, index) => (
            <Marker key={index} position={[bin.lat, bin.lng]} icon={trashCanIcon} />
          ))}

          {userLocation && nearestBin && (
            <Routing userLocation={userLocation} nearestBin={nearestBin} />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default UserMap;