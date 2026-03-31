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
      <div style={{ padding: "20px" }}>
        <h2>Not logged in ❌</h2>
        <p>Please sign in first.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Profile ✅</h2>

      <p><strong>First Name:</strong> {user.first_name}</p>
      <p><strong>Father Name:</strong> {user.father_name}</p>
      <p><strong>Email:</strong> {user.email || "N/A"}</p>
      <p><strong>Role:</strong> {user.role || "user"}</p>

      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}