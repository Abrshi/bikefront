"use client";

import React, { useState } from 'react';
import { axiosbaseurl } from '../../axios/axios';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

function Signin() {
  const { login } = useAuth(); // ✅ global state
  const router = useRouter();

  const [form, setForm] = useState({
    phone_number: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axiosbaseurl.post("/auth/signin", form); // ✅ FIXED endpoint
      const data = res.data;
       
      // ✅ SAVE USER TO GLOBAL + localStorage
      if (data.user) {
        login(data.user);
      }

      setMessage("Login successful ✅");
      console.log(data);

      // ✅ redirect to profile
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/profile");
      }

    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        setMessage(err.response.data.error || "Login failed");
      } else {
        setMessage("Server error");
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Signin</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={form.phone_number}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <br /><br />

        <button type="submit">Sign In</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Signin;