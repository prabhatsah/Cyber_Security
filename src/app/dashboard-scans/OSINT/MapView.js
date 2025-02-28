"use client";

import { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";

export default function MapView({ data }) {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCDMMvQ_8n2x8jc3jXwxi-dNA_S-SostPs",
  });

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

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-4">Geolocation Map (Google Maps)</h3>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={{ lat: 20, lng: 0 }}
        zoom={2}
      >
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lon }}
            onClick={() => setSelectedLocation(loc)}
          />
        ))}

        {selectedLocation && (
          <InfoWindow
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lon }}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div>
              <strong>IP:</strong> {selectedLocation.ip} <br />
              <strong>Location:</strong> {selectedLocation.city}, {selectedLocation.region}, {selectedLocation.country}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
