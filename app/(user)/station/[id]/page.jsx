"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Bike, ArrowLeft } from "lucide-react";
import { axiosbaseurl } from "@/axios/axios";

export default function StationBikesPage() {
  const { id } = useParams(); // station id from URL
  const router = useRouter();

  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchBikes = async () => {
      try {
        const res = await axiosbaseurl.get(`/bikes/${id}`);
        setBikes(res.data);
      } catch (err) {
        setError("Failed to load bikes");
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, [id]);

  // ⏳ Loading UI
  if (loading) {
    return (
      <div className="p-4 flex flex-col gap-3 animate-pulse">
        <div className="w-32 h-4 bg-slate-200 rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-slate-200 rounded-xl" />
        ))}
      </div>
    );
  }

  // ❌ Error UI
  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* 🔙 Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-green-600"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* 🏷 Title */}
      <h1 className="text-xl font-bold text-slate-800">
        Station #{id} Bikes 🚴
      </h1>

      {/* 🚲 Bikes List */}
      {bikes.length > 0 ? (
        <div className="flex flex-col gap-3">
          {bikes.map((bike) => (
            <div
              key={bike.bike_id}
              onClick={() => router.push(`/bike/${bike.bike_id}`)}
              className="p-4 bg-white border rounded-xl shadow flex justify-between items-center cursor-pointer hover:bg-green-50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Bike size={18} />
                </div>

                <div>
                  <p className="font-semibold">
                    Bike #{bike.bike_id}
                  </p>
                  <p className="text-xs text-slate-500">
                    Battery: {bike.battery_level ?? "N/A"}%
                  </p>
                </div>
              </div>

              <span className="text-sm text-green-600 font-medium">
                View →
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-sm">
          No bikes available at this station
        </p>
      )}
    </div>
  );
}