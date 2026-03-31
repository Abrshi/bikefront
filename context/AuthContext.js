"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ LOGIN
  const login = (userData) => {
    setUser(userData);

    // 🔥 save to browser
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ✅ LOAD FROM STORAGE ON REFRESH
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);