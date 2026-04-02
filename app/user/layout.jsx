"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Bike,
  MapPin,
  Home,
  User,
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
    { name: "Home", href: "/user", icon: Home },
    { name: "My Rides", href: "/user/rides", icon: Bike },
    { name: "Map", href: "/user/map", icon: MapPin },
    { name: "Me", href: "/user/profile", icon: User },
  ];

  return (
    
      <div className="h-[100vh] max-w-[100vw] min-w-[100vw] bg-white/80 backdrop-blur-xl border-r border-slate-200 shadow-lg mx-auto ">
        
<nav className="fixed bottom-0 left-0 w-full max-w-[640px] mx-auto bg-white border-t px-3 py-3 flex justify-around shadow-lg">          {navItems.map((item, i) => {
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

      

      {/* Main */}
      <main className="flex-1 flex flex-col">
        
        <div className="p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}