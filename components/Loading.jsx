"use client";

import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-50 to-white">
      
      {/* Animated Ring */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-20 h-20 border-4 border-green-200 rounded-full animate-ping"></div>

        <LoaderCircle
          className="animate-spin text-green-600"
          size={50}
          strokeWidth={3}
        />
      </div>

      {/* Text */}
      <p className="mt-6 text-green-700 text-base font-semibold tracking-wide">
        Please wait...
      </p>
    </div>
  );
}