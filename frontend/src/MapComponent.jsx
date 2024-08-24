import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { renderToString } from "react-dom/server";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator";

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

// Initial bin locations with levels
const locations = [
  { lat: 23.414411, lng: 85.441424, name: "Mesra", level: 0.8 },
  { lat: 23.417, lng: 85.442, name: "Hostel 1", level: 0.5 },
  { lat: 23.416, lng: 85.438, name: "Hostel 2", level: 0.7 },
  { lat: 23.415, lng: 85.444, name: "Hostel 3", level: 0.9 },
  { lat: 23.413, lng: 85.439, name: "Hostel 4", level: 0.4 },
];

const RoutingMachine = ({ waypoints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !waypoints.length) return;

    const routingControl = L.Routing.control({
      waypoints: waypoints,
      routeWhileDragging: true,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }],
      },
      createMarker: function () {
        return null;
      }, // Don't create markers for waypoints
    }).addTo(map);

    // Add arrows to the route
    routingControl.on("routesfound", function (e) {
      const routes = e.routes;
      if (routes.length > 0) {
        const route = routes[0];
        const line = L.polyline(route.coordinates, {
          color: "#6FA1EC",
          weight: 4,
        }).addTo(map);
        L.polylineDecorator(line, {
          patterns: [
            {
              offset: 12,
              repeat: 25,
              symbol: L.Symbol.arrowHead({
                pixelSize: 15,
                polygon: false,
                pathOptions: { stroke: true, color: "#6FA1EC", weight: 2 },
              }),
            },
          ],
        }).addTo(map);
      }
    });

    return () => map.removeControl(routingControl);
  }, [map, waypoints]);

  return null;
};

const MapComponent = () => {
  const [waypoints, setWaypoints] = useState([]);
  const mapRef = useRef(null);

  const handleCalculateRoute = () => {
    const startLocation = { lat: 23.426383253418077, lng: 85.43146842158133 };
    const optimalPath = calculateOptimalPath(startLocation);
    setWaypoints(optimalPath);

    if (mapRef.current) {
      mapRef.current.fitBounds(L.latLngBounds(optimalPath));
    }
  };

  // Function to calculate best path considering bin levels
  const calculateOptimalPath = (startLocation) => {
    // Sort bins based on distance and level
    const sortedBins = locations
      .slice() // Make a copy of locations
      .sort((a, b) => {
        const distA = getDistance(startLocation, a);
        const distB = getDistance(startLocation, b);
        return distA - distB || b.level - a.level; // Sort by distance, then level
      });

    // Generate waypoints in the sorted order
    const waypoints = [L.latLng(startLocation.lat, startLocation.lng)];
    sortedBins.forEach((bin) => {
      waypoints.push(L.latLng(bin.lat, bin.lng));
    });
    waypoints.push(L.latLng(startLocation.lat, startLocation.lng)); // Return to start

    return waypoints;
  };

  // Helper function to calculate the distance between two points (Haversine formula)
  const getDistance = (loc1, loc2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
    const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(loc1.lat * (Math.PI / 180)) *
        Math.cos(loc2.lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1">
        <MapContainer
          center={[23.414411, 85.441424]}
          zoom={15}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={[location.lat, location.lng]}
              icon={trashCanIcon}
            >
              <Popup>
                {location.name} (Level: {location.level})
              </Popup>
            </Marker>
          ))}
          <RoutingMachine waypoints={waypoints} />
        </MapContainer>
      </div>
      <div className="p-4 bg-white text-center">
        <button
          onClick={handleCalculateRoute}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Calculate Optimal Route
        </button>
      </div>
    </div>
  );
};

export default MapComponent;
