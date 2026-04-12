"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function Alert({ message, type = "success", duration = 3000 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!show) return null;

  // 🎨 Styles based on type
  const styles = {
    success: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <CheckCircle size={20} />,
    },
    error: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: <XCircle size={20} />,
    },
    warning: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: <AlertTriangle size={20} />,
    },
  };

  const current = styles[type] || styles.success;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`
          flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg
          ${current.bg} ${current.text}
          animate-slideIn
        `}
      >
        {current.icon}
        <span className="font-medium">{message}</span>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.4s ease forwards;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  );
}