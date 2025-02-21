"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
//import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// import "leaflet.markercluster/dist/MarkerCluster.css";
// import "leaflet.markercluster/dist/MarkerCluster.Default.css";


// Fix for marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

export default function MapView({ data }) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      if (!data?.ips || data.ips.length === 0) return;

      const locationPromises = data.ips.map(async (ip, idx) => {
        try {
          const response = await fetch(`http://ip-api.com/json/${ip}`);
          const result = await response.json();

          if (result.status === "success") {
            return {
              id: idx,
              ip,
              lat: result.lat,
              lon: result.lon,
              city: result.city,
              region: result.regionName,
              country: result.country,
            };
          }
        } catch (error) {
          console.error(`Failed to fetch geolocation for IP: ${ip}`, error);
        }
        return null;
      });

      const fetchedLocations = (await Promise.all(locationPromises)).filter(Boolean);
      setLocations(fetchedLocations);
    };

    fetchLocations();
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Geolocation Map with Clustering</h3>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "400px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MarkerClusterGroup>
          {locations.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lon]}>
              <Popup>
                <strong>IP:</strong> {loc.ip} <br />
                <strong>Location:</strong> {loc.city}, {loc.region}, {loc.country}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
