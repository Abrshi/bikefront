'use client';

import { useEffect, useState } from "react";
import { axiosbaseurl } from "../../../axios/axios";

export default function StationList() {
  const [stations, setStations] = useState([]);

  // ✏️ Edit state
  const [editingStation, setEditingStation] = useState(null);
  const [form, setForm] = useState({
    city: "",
    area_name: "",
    latitude: "",
    longitude: "",
  });

  // 🗑️ Delete state
  const [deletingStation, setDeletingStation] = useState(null);

  // 📡 Fetch stations
  const fetchStations = async () => {
    const res = await axiosbaseurl.get("/admin/stations");
    setStations(res.data);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // ✏️ Open edit modal
  const openEditModal = (station) => {
    setEditingStation(station);
    setForm({
      city: station.city || "",
      area_name: station.area_name || "",
      latitude: station.latitude || "",
      longitude: station.longitude || "",
    });
  };

  // ✏️ Update station
  const handleUpdate = async () => {
    await axiosbaseurl.put(
      `/admin/stations/${editingStation.station_id}`,
      form
    );
    setEditingStation(null);
    fetchStations();
  };

  // 🗑️ Confirm delete
  const handleDelete = async () => {
    if (!deletingStation) return;

    await axiosbaseurl.delete(
      `/admin/stations/${deletingStation.station_id}`
    );
    setDeletingStation(null);
    fetchStations();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Stations</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>City</th>
            <th>Area</th>
            <th>Lat</th>
            <th>Lng</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {stations.map((s) => (
            <tr key={s.station_id} className="border-t text-center">
              <td>{s.station_id}</td>
              <td>{s.city}</td>
              <td>{s.area_name}</td>
              <td>{s.latitude?.toString()}</td>
              <td>{s.longitude?.toString()}</td>

              <td className="flex gap-2 justify-center p-2">
                <button
                  onClick={() => openEditModal(s)}
                  className="px-3 py-1 button max-w-20"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDeletingStation(s)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✏️ Edit Modal */}
      {editingStation && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Station</h3>

            <input
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Area"
              value={form.area_name}
              onChange={(e) =>
                setForm({ ...form, area_name: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Latitude"
              value={form.latitude}
              onChange={(e) =>
                setForm({ ...form, latitude: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />

            <input
              type="text"
              placeholder="Longitude"
              value={form.longitude}
              onChange={(e) =>
                setForm({ ...form, longitude: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingStation(null)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🗑️ Delete Modal */}
      {deletingStation && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[350px] shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Delete Station
            </h3>

            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this station?
            </p>

            <div className="text-sm text-gray-500 mb-4">
              ID: {deletingStation.station_id} <br />
              {deletingStation.city} - {deletingStation.area_name}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletingStation(null)}
                className="px-4 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}