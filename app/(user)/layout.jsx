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

  if (loading) return <><Loading /></>;
  if (!user) return null;

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Station", href: "/station", icon: MapPin },
    { name: "Rides", href: "/rides", icon: Bike },
    { name: "Map", href: "/map", icon: MapPin },
    { name: "Me", href: "/profile", icon: User },
  ];

  return (
    <div className="h-[100vh] max-w-[100vw] bg-white">
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[640px] bg-white border-t px-3 py-3 flex justify-around shadow-lg">        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={i}
              href={item.href}
              className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl text-sm w-32 h-17
              ${
                isActive
                  ? "text-green-600/85 underline underline-offset-8 bg-green-100 border border-green-500 shadow"
                  : "text-slate-600 hover:bg-green-50"
              }`}
            >
              <Icon size={28} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <main className="max-w-[640px] mx-auto p-6">
        {children}
      </main>
    </div>
  );
}