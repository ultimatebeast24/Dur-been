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
  { lat: 23.419244857203218, lng: 85.43539749670185, name: "Hostel 10", level: 0.8},
  { lat: 23.422646804286135, lng: 85.43834569973096, name: "Auditorium", level: 0.5},
  { lat: 23.4152917041073, lng: 85.44060449470813, name: "Chicago", level: 0.7 },
  { lat: 23.417547922834785, lng: 85.4412739565754, name: "Jungle", level: 0.3 },
  { lat: 23.414725745050873, lng: 85.43848075231287, name: "circle", level: 0.9 },
  { lat: 23.414411, lng: 85.441424, name: "Mesra", level: 0.2 },
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
        styles: [{ color: "#6FA1EC", weight: 4 }]
      },
      createMarker: function() { return null; } // Don't create markers for waypoints
    }).addTo(map);

    // Add arrows to the route
    routingControl.on('routesfound', function(e) {
      const routes = e.routes;
      if (routes.length > 0) {
        const route = routes[0];
        const line = L.polyline(route.coordinates, { color: '#6FA1EC', weight: 4 }).addTo(map);
        L.polylineDecorator(line, {
          patterns: [
            { offset: 12, repeat: 25, symbol: L.Symbol.arrowHead({ pixelSize: 15, polygon: false, pathOptions: { stroke: true, color: '#6FA1EC', weight: 2 } }) }
          ]
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

  // Function to calculate the optimal path using a TSP approach
  const calculateOptimalPath = (startLocation) => {
    const locationsWithStart = [{ ...startLocation, name: "Start" }, ...locations];
    const numBins = locationsWithStart.length;
    const visited = Array(numBins).fill(false);
    const path = [L.latLng(startLocation.lat, startLocation.lng)];
    let currentLocation = locationsWithStart[0];
    visited[0] = true;

    for (let i = 1; i < numBins; i++) {
      let nearestNeighbor = null;
      let nearestDist = Infinity;
      for (let j = 1; j < numBins; j++) {
        if (!visited[j]) {
          const dist = getDistance(currentLocation, locationsWithStart[j]);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestNeighbor = locationsWithStart[j];
          }
        }
      }
      if (nearestNeighbor) {
        visited[locationsWithStart.indexOf(nearestNeighbor)] = true;
        path.push(L.latLng(nearestNeighbor.lat, nearestNeighbor.lng));
        currentLocation = nearestNeighbor;
      }
    }

    // Return to start
    path.push(L.latLng(startLocation.lat, startLocation.lng));

    return path;
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
    <>
      <MapContainer
        center={[23.414411, 85.441424]}
        zoom={15}
        style={{ height: "100vh", width: "100vw" }}
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
      <button
        onClick={handleCalculateRoute}
        style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}
      >
        Calculate Optimal Route
      </button>
    </>
  );
};

export default MapComponent;
