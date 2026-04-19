"use client";

import React, { useEffect, useState } from "react";
import { axiosbaseurl } from "@/axios/axios";
import {
  Users,
  Bike,
  Activity,
  BarChart3,
} from "lucide-react";

export default function Data() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      const res = await axiosbaseurl.get("/admin/data");
      setStats(res.data);
    } catch (error) {
      console.log("Failed to get dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = stats
    ? [
        {
          title: "Total Users",
          value: stats.totalUsers,
          icon: <Users size={20} />,
        },
        {
          title: "Active Rides",
          value: stats.activeRides,
          icon: <Activity size={20} />,
        },
        {
          title: "Total Rides",
          value: stats.totalRides,
          icon: <BarChart3 size={20} />,
        },
        {
          title: "Total Bikes",
          value: stats.totalBikes,
          icon: <Bike size={20} />,
        },
        {
          title: "Available Bikes",
          value: stats.totalAvailableBikes,
          icon: <Bike size={20} />,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
     

      {/* MAIN */}
      <main className="flex-1 p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          <div className="bg-white px-4 py-2 rounded-lg shadow text-sm">
            Admin
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 text-sm">
                  {card.title}
                </span>
                <div className="text-green-500">{card.icon}</div>
              </div>

              <div className="text-3xl font-bold text-gray-800">
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* SIMPLE ANALYTICS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Ride Overview
            </h2>
            <div className="text-gray-400">
              (Chart goes here — use Recharts or Chart.js)
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Recent Activity
            </h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>User joined</li>
              <li>Bike rented</li>
              <li>Ride completed</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}