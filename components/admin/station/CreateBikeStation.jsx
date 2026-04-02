'use client';

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { axiosbaseurl } from "../../../axios/axios";
import { useMapEvents } from "react-leaflet"; // ✅ FIXED

// ✅ Fix marker icons (important for Next.js)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// ✅ Dynamic components (ONLY components, not hooks)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

export default function CreateBikeStation() {
  const [position, setPosition] = useState(null);
  const [mounted, setMounted] = useState(false);

  // ✅ Prevent SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // 📍 Location picker (works now)
  function LocationPicker() {
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

    if (!position) {
      alert("Please select a location on the map");
      return;
    }

    try {
      await axiosbaseurl.post("/admin/stations", {
        ...form,
        latitude: position.lat,
        longitude: position.lng,
      });

      alert("✅ Station created successfully!");

      // Reset
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
      alert("❌ Error creating station");
    }
  };

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold text-white">Create Bike Station</h2>

     <div className="gap-6 grid md:grid-cols-3">
       {/* FORM */}
      <div className="bike-bg rounded-2xl border p-8 shadow-md bg-mist-700/80 text-white col-span-1">
        <form onSubmit={handleSubmit} className="grid gap-4">

          <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="input" />
          <input name="subcity" placeholder="Subcity" value={form.subcity} onChange={handleChange} className="input" />
          <input name="area_name" placeholder="Area Name" value={form.area_name} onChange={handleChange} className="input" />
          <input name="address_description" placeholder="Address Description" value={form.address_description} onChange={handleChange} className="input" />
          <input name="contact_phone" placeholder="Contact Phone" value={form.contact_phone} onChange={handleChange} className="input" />

          {/* 📍 Coordinates */}
          <div className="text-sm bg-black/30 p-3 rounded">
            <p>Latitude: {position?.lat ?? "Not selected"}</p>
            <p>Longitude: {position?.lng ?? "Not selected"}</p>
          </div>

          <button
            type="submit"
            disabled={!position}
            className={`p-2 rounded font-semibold ${
              position ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            Create Station
          </button>
        </form>
      </div>

      {/* 🗺️ MAP */}
      {mounted && (
        <div className="rounded-2xl overflow-hidden border shadow-lg col-span-2">
          <MapContainer
            center={[9.03, 38.74]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker />
            {position && <Marker position={position} />}
          </MapContainer>
        </div>
      )}
      </div>

    </div>
  );
}