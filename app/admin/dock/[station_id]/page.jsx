"use client";

import React, { useEffect, useState } from "react";
import { axiosbaseurl } from "@/axios/axios";
import { useParams } from "next/navigation";

export default function DockManager() {
  const { station_id } = useParams();

  const [docks, setDocks] = useState([]);
  const [dockNumber, setDockNumber] = useState("");
  const [count, setCount] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Modal state
  const [deleteId, setDeleteId] = useState(null);

  const fetchDocks = async () => {
    setLoading(true);
    const res = await axiosbaseurl.get(`/admin/docks/${station_id}`);
    setDocks(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (station_id) fetchDocks();
  }, [station_id]);

  // ✅ Create single dock
  const addDock = async () => {
    if (!dockNumber) return;

    await axiosbaseurl.post("/admin/docks", {
      station_id,
      dock_number: Number(dockNumber),
    });

    setDockNumber("");
    fetchDocks();
  };

  // 🔥 Create multiple docks
  const addMany = async () => {
    if (!count) return;

    await axiosbaseurl.post("/admin/docks/bulk", {
      station_id,
      count: Number(count),
    });

    setCount("");
    fetchDocks();
  };

  // ❌ Delete dock
  const confirmDelete = async () => {
    await axiosbaseurl.delete(`/admin/docks/${deleteId}`);
    setDeleteId(null);
    fetchDocks();
  };

  // ✏️ Toggle status
  const toggleStatus = async (dock) => {
    await axiosbaseurl.put(`/admin/docks/${dock.dock_id}`, {
      is_occupied: !dock.is_occupied,
    });

    fetchDocks();
  };

  // 🔒 Toggle lock
  const toggleLock = async (dock) => {
    const newStatus = dock.lock_status === "locked" ? "unlocked" : "locked";

    await axiosbaseurl.put(`/admin/docks/${dock.dock_id}`, {
      lock_status: newStatus,
    });

    fetchDocks();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        🚲 Dock Manager (Station {station_id})
      </h1>

      {/* ADD SINGLE DOCK */}
      <div className="mb-6 flex gap-2">
        <input
          className="border px-3 py-2 rounded w-40"
          placeholder="Dock Number"
          value={dockNumber}
          onChange={(e) => setDockNumber(e.target.value)}
        />
        <button
          onClick={addDock}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Dock
        </button>
      </div>

      {/* ADD MULTIPLE DOCKS */}
      <div className="mb-6 flex gap-2">
        <input
          className="border px-3 py-2 rounded w-40"
          placeholder="Count"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />
        <button
          onClick={addMany}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Bulk Add
        </button>
      </div>

      {/* LOADING */}
      {loading && <p className="text-gray-500">Loading docks...</p>}

      {/* TABLE */}
      <table className="w-full border rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Dock #</th>
            <th>Status</th>
            <th>Lock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {docks.map((d) => (
            <tr key={d.dock_id} className="border-t text-center">
              <td className="p-2">{d.dock_number}</td>

              {/* STATUS */}
              <td>
                <button
                  onClick={() => toggleStatus(d)}
                  className={`px-2 py-1 rounded text-white ${
                    d.is_occupied ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {d.is_occupied ? "Occupied" : "Free"}
                </button>
              </td>

              {/* LOCK */}
              <td>
                <button
                  onClick={() => toggleLock(d)}
                  className={`px-2 py-1 rounded text-white ${
                    d.lock_status === "locked"
                      ? "bg-gray-700"
                      : "bg-yellow-500"
                  }`}
                >
                  {d.lock_status || "unlock"}
                </button>
              </td>

              {/* ACTIONS */}
              <td>
                <button
                  onClick={() => setDeleteId(d.dock_id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔥 CUSTOM DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h2 className="text-lg font-bold mb-4">
              Delete this dock?
            </h2>

            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes, Delete
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