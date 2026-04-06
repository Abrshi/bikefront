"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosbaseurl } from "@/axios/axios";
import { Battery, MapPin, Lock, CheckCircle } from "lucide-react";
import QrScanner from "qr-scanner";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function ScanToStart() {
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

  // 🚲 OPTIONAL: fetch bike preview (can be removed if not needed)
  useEffect(() => {
    const fetchBike = async () => {
      try {
        setLoading(true);
        setBike(null);
      } catch (err) {
        toast.error("Failed to load bike");
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, []);

  // 📦 Extract bike_id from QR
  const extractBikeId = (qrText) => {
    if (!qrText) return null;

    const parts = qrText.split("-");

    // BIKE-2-4587 → ["BIKE", "2", "4587"]
    if (parts.length >= 3) {
      return Number(parts[1]);
    }

    return null;
  };

  // 📷 QR Scanner
  useEffect(() => {
    if (scanning && videoRef.current) {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      }

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          const scannedText = result.data;

          setDockCode(scannedText);
          setScanning(false);

          toast.success("QR scanned ✅");

          setTimeout(() => handleUnlock(scannedText), 500);
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
      toast.error("Scan or enter QR code");
      return;
    }

    if (!user) {
      toast.error("Login required");
      return;
    }

    const bikeIdFromQR = extractBikeId(code);

    if (!bikeIdFromQR) {
      toast.error("Invalid QR code");
      return;
    }

    try {
      setActionLoading(true);

      const response = await axiosbaseurl.post(`/unlock`, {
        dock_code: code,
        user: user.id,
        bike_id: bikeIdFromQR,
      });

      toast.success(response.data?.message || "Bike unlocked 🚲");

      setSuccess(true);

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

  return (
    <div className="p-4 max-w-md mx-auto flex flex-col gap-4">
      {/* 🎉 SUCCESS */}
      {success && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl flex flex-col items-center gap-3 animate-bounce">
            <CheckCircle className="text-green-600 w-12 h-12" />
            <p className="font-semibold text-lg">Bike Unlocked!</p>
          </div>
        </div>
      )}

      {/* 🚲 INFO CARD (optional UI) */}
      {bike && (
        <div className="bg-white rounded-3xl shadow-lg p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Bike #{bike.bike_id}</h1>
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
              {bike.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Battery />
            <span>{bike.battery_level}%</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <MapPin size={16} />
            {bike.current_latitude
              ? `${bike.current_latitude}, ${bike.current_longitude}`
              : "Location not available"}
          </div>
        </div>
      )}

      {/* 🔓 UNLOCK */}
      <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3">
        <h2 className="font-semibold flex items-center gap-2">
          <Lock size={16} /> Scan QR to Unlock
        </h2>

        <input
          type="text"
          placeholder="QR Code (BIKE-2-4587)"
          value={dockCode}
          onChange={(e) => setDockCode(e.target.value)}
          className="border rounded-xl px-3 py-2"
        />

        <button
          onClick={() => handleUnlock()}
          disabled={actionLoading}
          className="bg-green-600 text-white py-2 rounded-xl disabled:opacity-50"
        >
          {actionLoading ? "Unlocking..." : "Unlock Bike"}
        </button>

        <button
          onClick={() => setScanning(!scanning)}
          className="border py-2 rounded-xl"
        >
          {scanning ? "Stop Scanner" : "Scan QR Code"}
        </button>

        {scanning && (
          <div className="relative rounded-xl overflow-hidden">
            <video ref={videoRef} className="w-full rounded-xl" />
            <div className="absolute inset-0 border-4 border-green-500 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
}