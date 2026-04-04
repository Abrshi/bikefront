"use client";

import React, { useEffect, useState } from "react";
import { axiosbaseurl } from "@/axios/axios";
import AdminBikes from "@/components/admin/bike/AdminBikes";

export default function BikePage() {
  const [stations, setStations] = useState([]);
  const [docks, setDocks] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    qr_code_identifier: "",
    battery_level: "",
    dock_id: "",
  });

  // Load stations
  useEffect(() => {
    axiosbaseurl.get("/admin/stations").then((res) => {
      setStations(res.data);
    });
  }, []);

  // Load docks when station changes
  useEffect(() => {
    if (selectedStation) {
      axiosbaseurl
        .get(`/admin/docks/${selectedStation}`)
        .then((res) => {
          // only free docks
          setDocks(res.data.filter((d) => !d.is_occupied));
        });
    }
  }, [selectedStation,loading]);

  const handleSubmit = async () => {
    setLoading(true);
    await axiosbaseurl.post("/admin/bikes", form);

    alert("Bike created!");
    setForm({
      battery_level: "",
      dock_id: "",
    });
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Add Bike</h1>

      {/* SELECT STATION */}
      <select
        className="input"
        onChange={(e) => setSelectedStation(e.target.value)}
      >
        <option value="">Select Station</option>
        {stations.map((s) => (
          <option key={s.station_id} value={s.station_id}>
            {s.city} - {s.area_name}
          </option>
        ))}
      </select>

      {/* SELECT DOCK */}
      <select
        className="input mt-2"
        value={form.dock_id}
        onChange={(e) =>
          setForm({ ...form, dock_id: e.target.value })
        }
      >
        <option value="">Select Free Dock</option>
        {docks.map((d) => (
          <option key={d.dock_id} value={d.dock_id}>
            Dock {d.dock_number}
          </option>
        ))}
      </select>

      {/* INPUTS */}
      {/* <input
        className="input mt-2"
        placeholder="QR Code"
        value={form.qr_code_identifier}
        onChange={(e) =>
          setForm({ ...form, qr_code_identifier: e.target.value })
        }
      /> */}

      <input
        className="input mt-2"
        placeholder="Battery Level"
        value={form.battery_level}
        onChange={(e) =>
          setForm({ ...form, battery_level: e.target.value })
        }
      />

      <button onClick={handleSubmit} className="button">
        {loading ? "Creating..." : "Create Bike"}
      </button>
      <AdminBikes />
    </div>
  );
}