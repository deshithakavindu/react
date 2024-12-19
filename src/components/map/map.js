import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";

// Fix for missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapPage = () => {
  const [pickup, setPickup] = useState(null); // Pickup location
  const [dropoff, setDropoff] = useState(null); // Drop-off location
  const [searchQuery, setSearchQuery] = useState(""); // Search query for pickup
  const [currentLocation, setCurrentLocation] = useState(null); // User's current location

  // Get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => alert("Unable to fetch your location")
    );
  }, []);

  // Function to handle pickup search
  const handleSearch = async () => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        searchQuery
      )}&format=json`
    );
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      setPickup({ lat: parseFloat(lat), lng: parseFloat(lon) });
    } else {
      alert("No results found!");
    }
  };

  return (
    <div className="map-page">
      <header className="header">
        <h1 className="title">Select Pickup & Drop-off Locations</h1>
      </header>

      <div className="input-container">
        <input
          type="text"
          placeholder="Search for pickup location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-box"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <div className="map-container">
        {currentLocation && (
          <MapContainer
            center={currentLocation}
            zoom={14}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />

            {/* Current Location Marker */}
            <Marker position={currentLocation}>
              <Popup>
                <b>Your Current Location</b>
              </Popup>
            </Marker>

            {/* Pickup Location Marker */}
            {pickup && (
              <Marker position={pickup}>
                <Popup>
                  <b>Pickup Location</b>
                </Popup>
              </Marker>
            )}

            {/* Drop-off Location Marker */}
            {dropoff && (
              <Marker position={dropoff}>
                <Popup>
                  <b>Drop-off Location</b>
                </Popup>
              </Marker>
            )}

            {/* Enable Drop-off Selection */}
            <SelectDropoff setDropoff={setDropoff} />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

// Component to enable drop-off selection
const SelectDropoff = ({ setDropoff }) => {
  useMapEvents({
    click: (e) => {
      setDropoff({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return null;
};

export default MapPage;
