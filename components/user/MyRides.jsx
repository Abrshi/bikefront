"use client";

import { useEffect, useState } from "react";
import { axiosbaseurl } from "@/axios/axios";
import { Bike, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import EndRide from "./StopRide";

export default function MyRides() {
  const { user } = useAuth();

  const [rides, setRides] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEndRide, setShowEndRide] = useState(false);

  // 🎯 Handle result from EndRide
  const handleEndRideResult = (result) => {
    setShowEndRide(false);

    if (result.success) {
      alert("Ride ended 🚲");

      // 🔥 Refresh rides without reload
      fetchRides();
    } else {
      alert("Failed ❌");
    }
  };

  // ⏱️ Format duration
  const getDuration = (start, end) => {
    const s = new Date(start);
    const e = end ? new Date(end) : new Date();

    const diff = Math.floor((e - s) / 1000);
    const min = Math.floor(diff / 60);
    const sec = diff % 60;

    return `${min}m ${sec}s`;
  };

  // 🎨 Status UI
  const getStatusUI = (status) => {
    switch (status) {
      case "ONGOING":
        return {
          color: "bg-green-100 text-green-600",
          icon: <Clock size={14} />,
        };
      case "COMPLETED":
        return {
          color: "bg-blue-100 text-blue-600",
          icon: <CheckCircle size={14} />,
        };
      case "CANCELLED":
        return {
          color: "bg-red-100 text-red-600",
          icon: <XCircle size={14} />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-600",
          icon: null,
        };
    }
  };

  // 📡 Fetch rides
  const fetchRides = async () => {
    try {
      if (!user) return;

      setLoading(true);

      const [historyRes, currentRes] = await Promise.all([
        axiosbaseurl.get(`/rides?user_id=${user.id}`),
        axiosbaseurl.get(`/ride/?user_id=${user.id}`),
      ]);

      setRides(historyRes.data || []);
      setCurrentRide(currentRes.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, [user]);

  // ⏳ Loading UI
  if (loading) {
    return (
      <div className="p-5 space-y-3">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-5 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-slate-800">My Rides 🚴</h2>

      {/* 🔥 CURRENT RIDE */}
      {currentRide && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-2xl shadow flex flex-col gap-2">
          <p className="text-sm text-green-600 font-semibold">
            Ongoing Ride
          </p>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bike size={18} />
              <p className="font-bold">
                Bike #{currentRide.bike?.bike_id}
              </p>
            </div>

            <span className="text-xs px-2 py-1 rounded-full bg-green-200 text-green-700 flex items-center gap-1">
              <Clock size={12} />
              Live
            </span>
          </div>

          <p className="text-sm text-slate-600">
            Duration:{" "}
            <span className="font-semibold">
              {getDuration(currentRide.start_time)}
            </span>
          </p>

          {/* 🚀 End Ride Button */}
          <button
            onClick={() => setShowEndRide(true)}
            className="bg-red-500 text-white px-3 py-2 rounded-xl mt-2"
          >
            End Ride
          </button>
        </div>
      )}

      {/* 📜 HISTORY */}
      {rides.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow border text-center">
          <p className="text-slate-500">No rides yet</p>
        </div>
      ) : (
        rides.map((ride) => {
          const statusUI = getStatusUI(ride.status);

          return (
            <div
              key={ride.ride_id}
              className="bg-white p-4 rounded-2xl shadow border flex flex-col gap-2 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bike size={18} />
                  <p className="font-semibold">
                    Bike #{ride.bike?.bike_id}
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusUI.color}`}
                >
                  {statusUI.icon}
                  {ride.status}
                </span>
              </div>

              <div className="text-sm text-slate-600 flex justify-between">
                <p>
                  Duration:{" "}
                  <span className="font-semibold">
                    {getDuration(ride.start_time, ride.end_time)}
                  </span>
                </p>

                <p className="text-xs">
                  {new Date(ride.start_time).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })
      )}

      {/* 🧠 MODAL */}
      {showEndRide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-2xl w-full max-w-sm">
            <EndRide
                bike_id={currentRide.bike?.bike_id}
                onResult={handleEndRideResult}
              />
            <button
              onClick={() => setShowEndRide(false)}
              className="mt-3 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}