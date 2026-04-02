"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  if (!user) {
    return (
      <div className="p-5">
        <div className="bg-red-100 text-red-600 p-4 rounded-xl text-center">
          Not logged in ❌
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-5">
      
      <div className="bg-white p-6 rounded-2xl shadow border text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-500 text-white flex items-center justify-center text-2xl font-bold">
          {user.first_name[0]}
        </div>

        <h2 className="mt-3 text-lg font-bold text-slate-800">
          {user.first_name} {user.father_name}
        </h2>

        <p className="text-sm text-slate-500">{user.email || "No email"}</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow border">
        <p><strong>Role:</strong> {user.role || "User"}</p>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-3 rounded-xl shadow hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}