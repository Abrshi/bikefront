"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosbaseurl } from "@/axios/axios";
import { Battery, MapPin, Lock, CheckCircle } from "lucide-react";
import QrScanner from "qr-scanner";
import { useAuth } from "../../../../context/AuthContext";
import toast from "react-hot-toast";

export default function BikeDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dockCode, setDockCode] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);

  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  const { user } = useAuth();

  // 🚲 Fetch bike
  useEffect(() => {
    const fetchBike = async () => {
      try {
        const res = await axiosbaseurl.get(`/bike/${id}`);
        setBike(res.data);
      } catch (err) {
        toast.error("Failed to load bike");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBike();
  }, [id]);

  // 📷 QR Scanner logic (AUTO UNLOCK)
  useEffect(() => {
    if (scanning && videoRef.current) {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      }

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          setDockCode(result.data);
          setScanning(false);
          toast.success("QR scanned ✅");

          // 🔥 AUTO UNLOCK AFTER SCAN
          setTimeout(() => handleUnlock(result.data), 500);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current.start();
    }

    return () => {
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
    };
  }, [scanning]);

  // 🔓 Unlock bike
  const handleUnlock = async (codeOverride) => {
    const code = codeOverride || dockCode;

    if (!code) {
      toast.error("Enter or scan dock code");
      return;
    }

    if (!user) {
      toast.error("Login required");
      return;
    }

    try {
      setActionLoading(true);

      const response = await axiosbaseurl.post(`/unlock`, {
        dock_code: code,
        user: user.id,
        bike_id: bike.bike_id,
      });

      toast.success(response.data?.message || "Bike unlocked 🚲");

      // 🎉 SUCCESS ANIMATION
      setSuccess(true);

      // 🚀 Redirect after 2s
      setTimeout(() => {
        router.push("/rides");
      }, 2000);

      setDockCode("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unlock failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 animate-pulse text-gray-500">
        Loading...
      </p>
    );

  if (!bike)
    return <p className="text-center mt-10">Bike not found</p>;

  const batteryColor =
    bike.battery_level > 70
      ? "text-green-600"
      : bike.battery_level > 40
      ? "text-yellow-500"
      : "text-red-500";

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col gap-4">
      
      {/* 🎉 SUCCESS OVERLAY */}
      {success && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl flex flex-col items-center gap-3 animate-bounce">
            <CheckCircle className="text-green-600 w-12 h-12" />
            <p className="font-semibold text-lg">Bike Unlocked!</p>
          </div>
        </div>
      )}

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

      {/* 🔓 UNLOCK SECTION */}
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
          onClick={() => handleUnlock()}
          disabled={actionLoading}
          className="bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition disabled:opacity-50"
        >
          {actionLoading ? "Unlocking..." : "Unlock Bike"}
        </button>

        {/* 🎥 Scan Button */}
        <button
          onClick={() => setScanning(!scanning)}
          className="border py-2 rounded-xl text-sm hover:bg-gray-100 transition"
        >
          {scanning ? "Stop Scanner" : "Scan QR Code"}
        </button>

        {/* 📷 CAMERA */}
        {scanning && (
          <div className="relative rounded-xl overflow-hidden">
            <video ref={videoRef} className="w-full rounded-xl" />

            <div className="absolute inset-0 border-4 border-green-500 rounded-xl animate-pulse pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
}