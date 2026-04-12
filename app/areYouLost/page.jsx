"use client";

import Link from "next/link";
import { Home, LogIn } from "lucide-react";

export default function page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-md w-full text-center border border-green-100">
        
        {/* 🌿 Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <span className="text-4xl">🌱</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          You’re a bit lost…
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mb-8">
          This page wandered off into the forest 🌳  
          Let’s guide you back.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          
          {/* Home */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition font-medium"
          >
            <Home size={18} />
            Go Home
          </Link>

          {/* Auth */}
          <Link
            href="/auth"
            className="flex items-center justify-center gap-2 border border-green-600 text-green-700 hover:bg-green-50 py-3 rounded-xl transition font-medium"
          >
            <LogIn size={18} />
            Go to Login
          </Link>

        </div>
      </div>
    </div>
  );
}