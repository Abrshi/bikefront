import React from 'react'

function ProtectedRoute() {
  return (
    <div>ProtectedRoute</div>
  )
}

export default ProtectedRoute



// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { Bike } from "lucide-react";

// export default function ProtectedRoute({ children }) {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/login");
//     }
//   }, [user, loading]);

//   if (loading) {
//     return (
//       <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-green-50">
        
//         {/* Loader Container */}
//         <div className="flex flex-col items-center gap-6">
          
//           {/* Animated Icon */}
//           <div className="relative">
//             <div className="absolute inset-0 rounded-full bg-green-400 blur-2xl opacity-30 animate-pulse"></div>
            
//             <div className="relative bg-white p-6 rounded-2xl shadow-lg animate-bounce">
//               <Bike className="text-green-600" size={36} />
//             </div>
//           </div>

//           {/* Animated Text */}
//           <div className="text-center">
//             <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
//               Preparing your dashboard
//             </h2>

//             <p className="text-sm text-slate-500 mt-1">
//               Syncing bikes, docks & stations...
//             </p>
//           </div>

//           {/* Progress Bar */}
//           <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
//             <div className="h-full bg-green-600 rounded-full animate-[loading_1.2s_ease-in-out_infinite]"></div>
//           </div>
//         </div>

//         {/* Custom Animation */}
//         <style jsx>{`
//           @keyframes loading {
//             0% { width: 0%; }
//             50% { width: 70%; }
//             100% { width: 100%; }
//           }
//         `}</style>
//       </div>
//     );
//   }

//   if (!user) return null;

//   return children;
// }