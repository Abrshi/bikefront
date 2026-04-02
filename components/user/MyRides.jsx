"use client";

export default function MyRides() {
  const rides = []; // later from backend

  return (
    <div className="p-5 flex flex-col gap-4">
      
      <h2 className="text-xl font-bold text-slate-800">My Rides 🚴</h2>

      {rides.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow border text-center">
          <p className="text-slate-500">No rides yet</p>
        </div>
      ) : (
        rides.map((ride, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow border">
            <p className="font-semibold">Bike #{ride.bike_id}</p>
            <p className="text-sm text-slate-500">Duration: 10 min</p>
          </div>
        ))
      )}

    </div>
  );
}