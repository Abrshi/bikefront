"use client";

import React, { useEffect, useState } from "react";
import { axiosbaseurl } from "@/axios/axios";
import { useRouter } from "next/navigation";

export default function Dock() {
  const [stations, setStations] = useState([]);
  const router = useRouter();

  const fetchStations = async () => {
    const res = await axiosbaseurl.get("/admin/stations");
    setStations(res.data);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Stations</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>City</th>
            <th>Area</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {stations.map((s) => (
            <tr key={s.station_id} className="border-t text-center">
              <td>{s.station_id}</td>
              <td>{s.city}</td>
              <td>{s.area_name}</td>

              <td className="space-x-2">
                <button
                  onClick={() =>
                    router.push(`/admin/dock/${s.station_id}`)
                  }
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Manage Docks
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}