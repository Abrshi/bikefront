import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Bike",
  description: "Bike application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
           <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
