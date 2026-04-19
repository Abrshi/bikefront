"use client";

import React, { useEffect, useState } from "react";
import { axiosbaseurl } from "@/axios/axios";

function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await axiosbaseurl.get("/admin/alluser");
      setUsers(res.data);
      console.log(res.data);
    } catch (error) {
      console.log("Failed to get users", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-green-500 mb-6">
          List of Users
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Role ID</th>
                <th className="p-3 text-left">Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.user_id}
                  className={`border-b hover:bg-green-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-3">{user.user_id}</td>

                  <td className="p-3">
                    {user.first_name} {user.father_name}{" "}
                    {user.grandfather_name}
                  </td>

                  <td className="p-3">{user.email}</td>

                  <td className="p-3">{user.phone_number}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.account_status === "ACTIVE"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.account_status}
                    </span>
                  </td>

                  <td className="p-3">{user.role_id}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role_id === 2
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {user.role_id === 1 ? "Admin" : "User"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No users found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;