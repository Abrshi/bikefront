'use client';
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { axiosbaseurl } from "../../../axios/axios";

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function LocationPicker({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
}

export default function CreateBikeStation() {
  const [position, setPosition] = useState(null);

  const [form, setForm] = useState({
    city: "",
    subcity: "",
    area_name: "",
    address_description: "",
    contact_phone: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosbaseurl.post("/admin/stations", {
        ...form,
        latitude: position?.lat,
        longitude: position?.lng,
      });

      alert("Station created successfully!");

      setForm({
        city: "",
        subcity: "",
        area_name: "",
        address_description: "",
        contact_phone: "",
      });

      setPosition(null);
    } catch (err) {
      console.error(err);
      alert("Error creating station");
    }
  };

  return (
    <div style={{ display: "grid", gap: "20px" }}
     >
      <h2>Create Bike Station</h2>
 <div className=' w-full flex flex-col  gap-5 text-white'>
    <div
     className="bike-bg rounded-2xl border p-8 shadow-md bg-mist-700/80">
        
    
      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
        />

        <input
          name="subcity"
          placeholder="Subcity"
          value={form.subcity}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
        />

        <input
          name="area_name"
          placeholder="Area Name"
          value={form.area_name}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
        />

        <input
          name="address_description"
          placeholder="Address Description"
          value={form.address_description}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
        />

        <input
          name="contact_phone"
          placeholder="Contact Phone"
          value={form.contact_phone}
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
        />

        {/* LAT / LNG DISPLAY */}
        <div>
          <p>
            Latitude: {position?.lat || "Not selected"}
          </p>
          <p>
            Longitude: {position?.lng || "Not selected"}
          </p>
        </div>

        <button type="submit" disabled={!position}
          className="button">
          Create Station
        </button>
      </form>
</div>
 </div>
      {/* MAP */}
      <MapContainer
        center={[9.03, 38.74]} // Addis Ababa default
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <LocationPicker setPosition={setPosition} />

        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
}