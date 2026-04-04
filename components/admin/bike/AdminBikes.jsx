"use client";

import { useEffect, useState } from "react";
import { axiosbaseurl } from "@/axios/axios";

export default function AdminBikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBikes = async () => {
    try {
      setLoading(true);

      const res = await axiosbaseurl.get("/admin/bikes");

      setBikes(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load bikes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const getBatteryColor = (level) => {
    if (level >= 70) return "text-green-600";
    if (level >= 30) return "text-yellow-500";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-green-600 text-xl">
        Loading bikes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        🚲 Admin Bike Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bikes.map((bike) => (
          <div
            key={bike.bike_id}
            className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">
                Bike #{bike.bike_id}
              </h2>

              <span
                className={`text-sm font-medium ${
                  bike.status === "AVAILABLE"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {bike.status}
              </span>
            </div>

            {/* Battery */}
            <p className={`mb-2 font-medium ${getBatteryColor(bike.battery_level)}`}>
              🔋 Battery: {bike.battery_level}%
            </p>

            {/* Dock Info */}
            {bike.dock && (
              <div className="text-sm text-gray-600 mb-3">
                <p>Dock: {bike.dock.dock_number}</p>
                <p>
                  Status:{" "}
                  <span
                    className={
                      bike.dock.is_occupied
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {bike.dock.is_occupied ? "Occupied" : "Free"}
                  </span>
                </p>
              </div>
            )}

            {/* QR CODE (NOW 100% WORKING) */}
            {bike.qr_image && (
              <div className="flex flex-col items-center mt-4">
                <img
                  src={bike.qr_image}
                  alt="QR Code"
                  className="w-32 h-32 border rounded-lg p-1 bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {bike.qr_code_identifier}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}