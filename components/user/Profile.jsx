"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";
import { useState, useRef, useEffect } from "react";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  const startScan = () => {
    if (scanning) return;
    setResult(""); // clear old result
    setScanning(true);
  };

  useEffect(() => {
    if (!scanning || !videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (scanResult) => {
        // ✅ AUTO display result
        setResult(scanResult.data);

        // ✅ stop camera immediately after success
        setScanning(false);
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scannerRef.current = scanner;

    scanner.start().catch(() => {
      setResult("Camera error or permission denied");
      setScanning(false);
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  if (!user) {
    return (
      <div className="p-5 text-center text-red-600">
        Not logged in
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-5">

      {/* PROFILE */}
      <div className="bg-white p-6 rounded-2xl shadow text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-500 text-white flex items-center justify-center text-2xl font-bold">
          {user.first_name?.[0]}
        </div>

        <h2 className="mt-3 font-bold">
          {user.first_name} {user.father_name}
        </h2>

        <p className="text-sm text-gray-500">
          {user.email || "No email"}
        </p>
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 rounded-xl"
      >
        Logout
      </button>

      {/* SCANNER */}
      <div className="p-4 border rounded-xl text-center bg-white">

        <button
          onClick={startScan}
          className="bg-green-600 text-white py-2 px-4 rounded-xl"
        >
          Scan QR
        </button>

        {/* CAMERA */}
        {scanning && (
          <video
            ref={videoRef}
            className="w-full mt-4 rounded-xl border"
          />
        )}

        {/* RESULT (AUTO SHOW) */}
        {result && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-xl break-all">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}