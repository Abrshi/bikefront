"use client";

import React, { useState } from "react";
import CreateBikeStation from "@/components/admin/station/CreateBikeStation";
import StationList from "@/components/admin/station/EditStation";

export default function Page() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="p-4">
      {/* Header Nav */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded ${
            activeTab === "create"
              ? "bg-green-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Create Station
        </button>

        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded ${
            activeTab === "list"
              ? "bg-green-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Station List
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "create" && <CreateBikeStation />}
        {activeTab === "list" && <StationList />}
      </div>
    </div>
  );
}