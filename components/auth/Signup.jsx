"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bike, AlertCircle } from "lucide-react";
import { axiosbaseurl } from "../../axios/axios";

export default function Signup({ setToggle }) {
  const [form, setForm] = useState({
    first_name: "",
    father_name: "",
    phone_number: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const res = await axiosbaseurl.post("/auth/signup", form);

      setMessage("Account created successfully ✅");
      setIsError(false);

      console.log(res.data);

      // reset form
      setForm({
        first_name: "",
        father_name: "",
        phone_number: "",
        password: "",
      });

      // switch to Signin after short delay
      setTimeout(() => {
        setToggle(false);
      }, 1500);

    } catch (err) {
      setIsError(true);

      if (err.response && err.response.data) {
        setMessage(err.response.data.error || "Signup failed");
      } else {
        setMessage("Server error");
      }
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full animate-fade-in max-w-lg">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-green-500"
          >
            <Bike className="h-7 w-7" />
            RideFlow
          </Link>
          <p className="mt-2 text-muted-foreground">
            Create your account
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
              isError
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Father Name
            </label>
            <input
              type="text"
              name="father_name"
              value={form.father_name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Phone Number
            </label>
            <input
              type="text"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none"
            />
          </div>

          <button type="submit" className="button w-full">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}