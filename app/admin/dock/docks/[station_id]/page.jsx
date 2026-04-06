"use client";

import React, { useEffect, useState } from "react";
import { axiosbaseurl } from "@/axios/axios";
import QRCode from "react-qr-code";

export default function DockManager() {
  const [stations, setStations] = useState([]);
  const [stationId, setStationId] = useState(null);

  const [docks, setDocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // 🔥 Fetch stations
  const fetchStations = async () => {
    try {
      const res = await axiosbaseurl.get("/admin/stations");
      const data = res.data || [];

      setStations(data);

      // ✅ set first station correctly
      if (data.length > 0) {
        setStationId(data[0].station_id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Fetch docks
  const fetchDocks = async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await axiosbaseurl.get(`/admin/docks/${id}`);
      setDocks(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    if (stationId) {
      fetchDocks(stationId);
    }
  }, [stationId]);

  // ❌ Delete
  const confirmDelete = async () => {
    try {
      await axiosbaseurl.delete(`/admin/docks/${deleteId}`);
      setDeleteId(null);
      fetchDocks(stationId);
    } catch (err) {
      console.error(err);
    }
  };

  // ✏️ Toggle status
  const toggleStatus = async (dock) => {
    try {
      await axiosbaseurl.put(`/admin/docks/${dock.dock_id}`, {
        is_occupied: !dock.is_occupied,
      });
      fetchDocks(stationId);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔒 Toggle lock
  const toggleLock = async (dock) => {
    try {
      const newStatus =
        dock.lock_status === "locked" ? "unlocked" : "locked";

      await axiosbaseurl.put(`/admin/docks/${dock.dock_id}`, {
        lock_status: newStatus,
      });

      fetchDocks(stationId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🚲 Dock Manager</h1>

      {/* 🔽 STATION DROPDOWN */}
      <div>
        <label className="block mb-1 font-semibold">
          Select Station
        </label>

        <select
          value={stationId || ""}
          onChange={(e) => setStationId(Number(e.target.value))} // ✅ FIXED (convert to number)
          className="border px-3 py-2 rounded w-60"
        >
          {stations.length === 0 && (
            <option value="">No stations</option>
          )}

          {stations.map((s) => (
            <option key={s.station_id} value={s.station_id}>
              {s.station_name} (ID: {s.station_id})
            </option>
          ))}
        </select>
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* 🧾 DOCK CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {docks.length === 0 && !loading && (
          <p>No docks found</p>
        )}

        {docks.map((d) => (
          <div
            key={d.dock_id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="font-bold text-lg mb-2">
              Dock #{d.dock_number}
            </h2>

            {/* QR CODE */}
            <div className="bg-white p-2 inline-block mb-3">
              <QRCode
                value={d.qr_code_identifier || `dock-${d.dock_id}`}
              />
            </div>

            <p>
              Status:{" "}
              <span
                className={
                  d.is_occupied ? "text-red-500" : "text-green-500"
                }
              >
                {d.is_occupied ? "Occupied" : "Free"}
              </span>
            </p>

            <p>Lock: {d.lock_status}</p>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                onClick={() => toggleStatus(d)}
                className="bg-green-600 text-white px-2 py-1 rounded"
              >
                Toggle Status
              </button>

              <button
                onClick={() => toggleLock(d)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Toggle Lock
              </button>

              <button
                onClick={() => setDeleteId(d.dock_id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded text-center">
            <h2 className="mb-4">Delete this dock?</h2>

            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>

              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}