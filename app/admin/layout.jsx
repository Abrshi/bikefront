"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Bike,
  LayoutDashboard,
  MapPin,
  Boxes,
  Plus,
  PlusCircle,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  // 🔐 Protect here directly
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading]);

  if (loading) return <p><ProtectedRoute/></p>;
  if (!user) return null;

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Bikes", href: "/admin/bike", icon: Bike },
    { name: "Docks", href: "/admin/dock", icon: Boxes },
    { name: "Stations", href: "/admin/station", icon: MapPin },
    { name: "Pricing", href: "/admin/pricing", icon: PlusCircle },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-green-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200 shadow-lg">
        <div className="p-6 text-2xl font-extrabold tracking-tight">
          <span className="text-slate-800">Admin</span>{" "}
          <span className="text-green-600">Panel</span>
        </div>

        <nav className="flex flex-col gap-2 px-3">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={i}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-green-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-green-50 hover:text-green-600"
                  }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4">
          <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-4 text-white text-sm shadow-md">
            🚴 System Active
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        <div className="h-16 bg-white/70 backdrop-blur-lg border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
            Admin Dashboard
          </h1>

          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow hover:bg-green-700 transition-all duration-200">
            <Plus size={16} />
            Add New
          </button>
        </div>

        <div className="p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}