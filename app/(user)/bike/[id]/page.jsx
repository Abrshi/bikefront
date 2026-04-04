"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { axiosbaseurl } from "@/axios/axios";
import { Battery, MapPin, Lock, QrCode } from "lucide-react";

export default function BikeDetail() {
  const { id } = useParams();

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dockCode, setDockCode] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const res = await axiosbaseurl.get(`/bike/${id}`);
        setBike(res.data);
      } catch (err) {
        console.error("Failed to load bike");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBike();
  }, [id]);

  // 🚲 Unlock bike using dock code
  const handleUnlock = async () => {
    if (!dockCode) return alert("Enter dock code");

    try {
      setActionLoading(true);

      await axiosbaseurl.post(`/bike/unlock`, {
        bike_id: bike.bike_id,
        dock_code: dockCode,
      });

      alert("Bike Unlocked 🚀");
      setDockCode("");
    } catch (err) {
      alert("Invalid dock code ❌");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!bike) return <p className="text-center mt-10">Bike not found</p>;

  const batteryColor =
    bike.battery_level > 70
      ? "text-green-600"
      : bike.battery_level > 40
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col gap-4">

      {/* 🚲 BIKE CARD */}
      <div className="bg-white rounded-3xl shadow-lg p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Bike #{bike.bike_id}</h1>
          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
            {bike.status}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Battery className={batteryColor} />
          <span className={`font-semibold ${batteryColor}`}>
            {bike.battery_level}%
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <MapPin size={16} />
          {bike.current_latitude
            ? `${bike.current_latitude}, ${bike.current_longitude}`
            : "Location not available"}
        </div>
      </div>

      {/* 🔓 DOCK UNLOCK SECTION */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
        <h2 className="font-semibold flex items-center gap-2">
          <Lock size={16} /> Unlock Dock / Bike
        </h2>

        <input
          type="text"
          placeholder="Scan or enter dock code"
          value={dockCode}
          onChange={(e) => setDockCode(e.target.value)}
          className="border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={handleUnlock}
          disabled={actionLoading}
          className="bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
        >
          {actionLoading ? "Unlocking..." : "Unlock Bike"}
        </button>
      </div>

      {/* 📷 QR INFO */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3 items-center">
        <QrCode size={40} className="text-green-600" />
        <p className="text-sm text-slate-500 text-center">
          Scan dock QR or enter code under it to unlock bike
        </p>
      </div>

    </div>
  );
}