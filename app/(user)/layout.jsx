"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Bike, MapPin, Home, User } from "lucide-react";
import Loading from "@/components/Loading";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading]);

  if (loading) return <Loading />;
  if (!user) return null;

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Station", href: "/station", icon: MapPin },
    { name: "Rides", href: "/rides", icon: Bike },
    { name: "Map", href: "/map", icon: MapPin },
    { name: "Me", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">

      {/* CONTENT */}
      <main className="max-w-[640px] mx-auto px-4 pt-6 pb-24">
        {children}
      </main>

      {/* FLOATING NAV */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[640px] z-50">
        <div className="flex justify-between items-center px-4 py-2 rounded-2xl 
                        bg-white/70 backdrop-blur-xl shadow-xl border border-gray-200">

          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={i}
                href={item.href}
                className="relative flex flex-col items-center justify-center flex-1 py-2"
              >
                {/* ACTIVE INDICATOR (pill glow) */}
                {isActive && (
                  <div className="absolute inset-0 mx-2 rounded-xl bg-green-100 scale-105 transition-all duration-300" />
                )}

                {/* ICON */}
                <Icon
                  size={24}
                  className={`relative z-10 transition-all duration-300
                  ${
                    isActive
                      ? "text-green-600 scale-110"
                      : "text-gray-500 group-hover:text-green-500"
                  }`}
                />

                {/* LABEL (only strong when active) */}
                <span
                  className={`text-[10px] mt-1 relative z-10 transition-all duration-300
                  ${
                    isActive
                      ? "text-green-600 font-semibold opacity-100"
                      : "text-gray-400 opacity-70"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}