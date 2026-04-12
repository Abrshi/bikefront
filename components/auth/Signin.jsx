"use client";

import React, { useState } from "react";
import { axiosbaseurl } from "../../axios/axios";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Bike } from "lucide-react";
import Alert from "../Alert";

function Signin() {
  const { login } = useAuth();
  const router = useRouter();
 const [alert, setAlert] = useState(null);

  const [form, setForm] = useState({
    phone_number: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosbaseurl.post("/auth/signin", form);
      const data = res.data;
      console.log(data);

      // ✅ save user globally (context)
      if (data.user) {
        login(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      
      setAlert({ message: "Login successful", type: "success" })

      // ✅ role-based redirect
       setTimeout(() => {
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 1500);

    } catch (err) {
      console.error(err);

      if (err) {
        setAlert({ message: "Login failed", type: "error" })
      } else {
        setAlert({ message: "Server error", type: "error" });
      }
    }
  };

  return (
    <div className="flex  items-center justify-center px-4">

      {alert && (
        <Alert message={alert.message} type={alert.type} />
      )}
      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-green-500">
            <Bike className="h-7 w-7" />
            RideFlow
          </Link>
          <p className="mt-2 text-gray-500">Welcome back</p>
        </div>

        {/* CARD */}
        <div className="">

          

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded mt-1"
              />
            </div>

            <button
              type="submit"
              className="button"
            >
              Log In
            </button>

          </form>

          {/* <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p> */}

        </div>
      </div>
    </div>
  );
}

export default Signin;