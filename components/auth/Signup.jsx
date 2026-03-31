import React, { useState } from 'react';
import { axiosbaseurl } from '../../axios/axios';

function Signup() {
  const [form, setForm] = useState({
    first_name: '',
    father_name: '',
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
      const res = await axiosbaseurl.post("/auth/signup", form);
      const data = res.data;

      setMessage("Account created successfully ✅");
      console.log(data);

    } catch (err) {
      console.error(err);

      if (err.response && err.response.data) {
        setMessage(err.response.data.error || "Signup failed");
      } else {
        setMessage("Server error");
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="text"
          name="father_name"
          placeholder="Father Name"
          value={form.father_name}
          onChange={handleChange}
          required
        />

       

        <br /><br />

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

        <button type="submit">Sign Up</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Signup;