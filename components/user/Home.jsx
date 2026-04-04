"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="p-5 flex flex-col gap-6">
      
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold">
          Welcome {user?.first_name || "Rider"} 🚴‍♂️
        </h2>
        <p className="text-sm opacity-90 mt-1">
          Find and ride bikes easily around your city.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/station" className="bg-green-100 p-5 rounded-2xl shadow border border-green-500">
          <h3 className="font-semibold text-slate-700">Nearby station</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">12</p>
        </Link>

        <div className="bg-green-100 p-5 rounded-2xl shadow border border-green-500">
          <h3 className="font-semibold text-slate-700">Active Ride</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">0</p>
        </div>
      </div>

      <button className="bg-green-600 text-white py-3 rounded-xl shadow hover:bg-green-700 transition">
        🔍 Find Bikes on Map
      </button>
    </div>
  );
}