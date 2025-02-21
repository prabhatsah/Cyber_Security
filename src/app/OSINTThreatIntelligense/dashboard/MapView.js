"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for marker icon issue in Next.js
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

export default function MapView({ data }) {
  const locations = data.ips?.map((ip, idx) => ({
    id: idx,
    lat: Math.random() * 180 - 90, // Mock Latitude
    lon: Math.random() * 360 - 180, // Mock Longitude
    ip,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Geolocation Map</h3>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "400px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {locations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lon]}>
            <Popup>{loc.ip}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
