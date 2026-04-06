"use client";

import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { axiosbaseurl } from "@/axios/axios";
import { useAuth } from "@/context/AuthContext";

function EndRide({ onResult, bike_id }) {
  const { user } = useAuth();

  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);

  const [manualCode, setManualCode] = useState("");
  const [scannedCode, setScannedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("scanning");

  // 🎥 Start scanner
  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        if (hasScannedRef.current) return;

        hasScannedRef.current = true;

        const code = result.data;
        setScannedCode(code);
        setStatus("scanned");

        handleSubmit(code);
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
      }
    );

    scanner
      .start()
      .then(() => setStatus("scanning"))
      .catch((err) => {
        console.error(err);
        setStatus("error");
      });

    scannerRef.current = scanner;

    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, []);

  // 🚀 Submit
  const handleSubmit = async (autoCode) => {
    const dock_code = autoCode || scannedCode || manualCode;

    if (!dock_code || !user || !bike_id) {
      setStatus("error");
      return;
    }

    hasScannedRef.current = true;
    setLoading(true);
    setStatus("processing");

    try {
      const res = await axiosbaseurl.post("/lockbike", {
        dock_code,
        user: user.id,      // ✅ important
        bike_id: bike_id,   // ✅ important
      });

      if (res.status === 200 || res.status === 201) {
        setStatus("success");

        // 🛑 stop camera
        scannerRef.current?.stop();

        setTimeout(() => {
          onResult({ success: true, data: res.data });
        }, 1200);
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      console.error(err);

      setStatus("error");
      hasScannedRef.current = false;

      onResult({ success: false });
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-3xl shadow-2xl max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        🔒 Lock Your Bike
      </h2>

      {/* 📷 Camera */}
      <div className="relative w-full rounded-2xl overflow-hidden border">
        <video ref={videoRef} className="w-full h-64 object-cover" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-52 h-52 border-4 border-green-500 rounded-2xl animate-pulse" />
        </div>
      </div>

      {/* 📊 Status */}
      <div className="mt-4 text-sm font-medium">
        {status === "scanning" && "Scanning dock QR... 📷"}
        {status === "scanned" && "Dock detected ✔️"}
        {status === "processing" && "Locking bike... ⏳"}
        {status === "success" && "Bike locked successfully 🔒"}
        {status === "error" && "Failed to lock ❌"}
      </div>

      {/* Code preview */}
      {(scannedCode || manualCode) && (
        <p className="mt-2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
          Code: {scannedCode || manualCode}
        </p>
      )}

      {/* Manual input */}
      <input
        type="text"
        placeholder="Enter dock code manually"
        value={manualCode}
        onChange={(e) => setManualCode(e.target.value)}
        disabled={status === "processing" || status === "success"}
        className="mt-4 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {/* Submit */}
      <button
        onClick={() => handleSubmit()}
        disabled={loading || status === "success"}
        className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition disabled:opacity-50"
      >
        {loading ? "Processing..." : "Lock Bike"}
      </button>
    </div>
  );
}

export default EndRide;