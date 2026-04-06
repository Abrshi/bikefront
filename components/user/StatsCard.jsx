"use client";

import { useEffect, useState } from "react";
import { axiosbaseurl } from "@/axios/axios";
import { Bike, CheckCircle, MapPin } from "lucide-react";

export default function StatsCard() {
  const [stats, setStats] = useState({
    totalBikes: 0,
    availableBikes: 0,
    totalStations: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosbaseurl.get("/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="h-16 rounded-full bg-gray-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-md shadow-md rounded-full px-6 py-3">

        {/* Total Bikes */}
        <div className="flex items-center gap-2">
          <Bike size={20} className="text-gray-700" />
          <span className="font-semibold text-gray-800">
            {stats.totalBikes}
          </span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* Available Bikes */}
        <div className="flex items-center gap-2">
          <CheckCircle size={20} className="text-green-600" />
          <span className="font-semibold text-green-600">
            {stats.availableBikes}
          </span>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* Stations */}
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-blue-600" />
          <span className="font-semibold text-blue-600">
            {stats.totalStations}
          </span>
        </div>

      </div>
    </div>
  );
}