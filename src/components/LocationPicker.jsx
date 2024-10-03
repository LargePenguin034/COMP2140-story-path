import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Marker icon configuration
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const LocationPicker = ({ formData, setFormData }) => {
  const mapRef = useRef();

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData({
          ...formData,
          longitude: lng,
          latitude: lat,
          position: [lat, lng],
        });
      },
    });

    return <Marker position={[formData.latitude, formData.longitude]}></Marker>;
  };

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.flyTo([formData.latitude, formData.longitude], 13); // Center and adjust zoom
    }
  }, [formData.latitude, formData.longitude]); // Listen for changes to latitude and longitude

  return (
    <>
      <MapContainer
        center={[formData.latitude, formData.longitude]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
        ref={mapRef} // Assign map reference
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
    </>
  );
};

export default LocationPicker;
