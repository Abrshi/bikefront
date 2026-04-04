"use client";

import { useEffect, useState } from "react";
import { MapPin, Bike, ChevronDown } from "lucide-react";
import { axiosbaseurl } from "@/axios/axios";
import { useRouter } from "next/navigation";

export default function NearbyStations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openStationId, setOpenStationId] = useState(null);
  const [bikes, setBikes] = useState({});
  const router = useRouter();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await axiosbaseurl.get(
            `/nearbyStations/nearby?lat=${lat}&lng=${lng}`
          );

          // ✅ DO NOT sort again (backend already smart sorts)
          setStations(res.data);
          setLoading(false);
        } catch (err) {
          setError("Failed to load stations");
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  }, []);

  // 🔽 Toggle + fetch bikes
  const handleToggle = async (stationId) => {
    if (openStationId === stationId) {
      setOpenStationId(null);
      return;
    }

    setOpenStationId(stationId);

    if (!bikes[stationId]) {
      try {
        const res = await axiosbaseurl.get(`/bikes/${stationId}`);
        setBikes((prev) => ({
          ...prev,
          [stationId]: res.data,
        }));
      } catch (err) {
        console.error("Failed to load bikes");
      }
    }
  };

  // ✅ LOADING UI (FIXED)
  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <h2 className="text-lg font-bold text-slate-800">
          Nearby Stations
        </h2>

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl shadow border flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl" />
              <div className="flex flex-col gap-2">
                <div className="w-32 h-3 bg-slate-200 rounded" />
                <div className="w-20 h-3 bg-slate-200 rounded" />
              </div>
            </div>

            <div className="w-10 h-4 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // ❌ ERROR UI
  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-2xl border">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-slate-800">
        Nearby Stations
      </h2>

      {stations.map((station, index) => {
        const isOpen = openStationId === station.station_id;
        const isClosest = index === 0;

        return (
          <div
            key={station.station_id}
            className="bg-white rounded-2xl shadow border overflow-hidden transition-all"
          >
            {/* HEADER */}
            <div
              onClick={() => handleToggle(station.station_id)}
              className={`p-4 flex justify-between items-center cursor-pointer hover:bg-green-50 ${
                isClosest ? "bg-green-100" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-xl">
                  <MapPin size={18} />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800 flex gap-2 items-center">
                    {station.area_name}
                    {isClosest && (
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                        Closest
                      </span>
                    )}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {station.distance?.toFixed(2)} km away
                  </p>

                  {/* ✅ NEW: bike count */}
                  <p className="text-xs text-green-600 font-medium">
                    🚴 {station.available_bikes} bikes available
                  </p>
                </div>
              </div>

              <ChevronDown
                className={`transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* EXPAND CONTENT */}
            <div
              className={`transition-all duration-300 px-4 ${
                isOpen ? "max-h-[500px] py-4" : "max-h-0 overflow-hidden"
              }`}
            >
              {bikes[station.station_id] ? (
                bikes[station.station_id].length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {bikes[station.station_id].map((bike) => (
                      <div
                        key={bike.bike_id}
                        onClick={() =>
                          router.push(`/bike/${bike.bike_id}`)
                        }
                        className="flex justify-between items-center p-3 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100 transition"
                      >
                        <div className="flex items-center gap-2">
                          <Bike size={16} />
                          <span className="text-sm font-medium">
                            Bike #{bike.bike_id}
                          </span>
                        </div>

                        <span className="text-xs text-green-700 font-semibold">
                          View →
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No bikes available
                  </p>
                )
              ) : (
                <div className="flex gap-2 items-center text-sm text-slate-400 animate-pulse">
                  <Bike size={14} />
                  Loading bikes...
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}