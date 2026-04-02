"use client";

export default function MapPage() {
  return (
    <div className="p-5 flex flex-col gap-4">
      
      <h2 className="text-xl font-bold text-slate-800">Map 🗺️</h2>

      <div className="h-[400px] bg-slate-200 rounded-2xl flex items-center justify-center shadow">
        <p className="text-slate-600">Map will appear here</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow border">
        <h3 className="font-semibold text-slate-700">Nearby Station</h3>
        <p className="text-sm text-slate-500">Bole - 5 bikes available</p>
      </div>

    </div>
  );
}