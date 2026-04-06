"use client";

import { useState } from "react";
import { axiosbaseurl } from "@/axios/axios";

export default function AdminPricingPromo() {
  // 🔹 Pricing state
  const [pricing, setPricing] = useState({
    base_fare: "",
    rate_per_minute: "",
    rate_per_km: "",
    minimum_fare: "",
    pause_rate: "",
    penalty_fee: "",
    currency: "ETB",
  });

  // 🔹 Promo state
  const [promo, setPromo] = useState({
    code: "",
    discount_type: "PERCENTAGE",
    value: "",
    expiry_date: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle pricing submit
  const handlePricingSubmit = async () => {
    try {
      setLoading(true);

      await axiosbaseurl.post("/admin/pricing", pricing);

      alert("Pricing added ✅");

      setPricing({
        base_fare: "",
        rate_per_minute: "",
        rate_per_km: "",
        minimum_fare: "",
        pause_rate: "",
        penalty_fee: "",
        currency: "ETB",
      });
    } catch (err) {
      console.error(err);
      alert("Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle promo submit
  const handlePromoSubmit = async () => {
    try {
      setLoading(true);

      await axiosbaseurl.post("/admin/promocode", promo);

      alert("Promo created ✅");

      setPromo({
        code: "",
        discount_type: "PERCENTAGE",
        value: "",
        expiry_date: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">⚙️ Admin Panel</h1>

      {/* 🔥 PRICING SECTION */}
      <div className="bg-white p-5 rounded-2xl shadow space-y-4">
        <h2 className="text-lg font-semibold">Add Pricing Rule</h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="Base Fare"
            value={pricing.base_fare}
            onChange={(e) =>
              setPricing({ ...pricing, base_fare: e.target.value })
            }
            className="input"
          />

          <input
            placeholder="Rate / Min"
            value={pricing.rate_per_minute}
            onChange={(e) =>
              setPricing({
                ...pricing,
                rate_per_minute: e.target.value,
              })
            }
            className="input"
          />

          <input
            placeholder="Rate / KM"
            value={pricing.rate_per_km}
            onChange={(e) =>
              setPricing({
                ...pricing,
                rate_per_km: e.target.value,
              })
            }
            className="input"
          />

          <input
            placeholder="Minimum Fare"
            value={pricing.minimum_fare}
            onChange={(e) =>
              setPricing({
                ...pricing,
                minimum_fare: e.target.value,
              })
            }
            className="input"
          />

          <input
            placeholder="Pause Rate"
            value={pricing.pause_rate}
            onChange={(e) =>
              setPricing({
                ...pricing,
                pause_rate: e.target.value,
              })
            }
            className="input"
          />

          <input
            placeholder="Penalty Fee"
            value={pricing.penalty_fee}
            onChange={(e) =>
              setPricing({
                ...pricing,
                penalty_fee: e.target.value,
              })
            }
            className="input"
          />
        </div>

        <button
          onClick={handlePricingSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          {loading ? "Saving..." : "Add Pricing"}
        </button>
      </div>

      {/* 🎁 PROMO SECTION */}
      <div className="bg-white p-5 rounded-2xl shadow space-y-4">
        <h2 className="text-lg font-semibold">Create Promo Code</h2>

        <input
          placeholder="Code (e.g FREE10)"
          value={promo.code}
          onChange={(e) =>
            setPromo({ ...promo, code: e.target.value })
          }
          className="input w-full"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            value={promo.discount_type}
            onChange={(e) =>
              setPromo({
                ...promo,
                discount_type: e.target.value,
              })
            }
            className="input"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed</option>
          </select>

          <input
            placeholder="Value"
            value={promo.value}
            onChange={(e) =>
              setPromo({ ...promo, value: e.target.value })
            }
            className="input"
          />
        </div>

        <input
          type="date"
          value={promo.expiry_date}
          onChange={(e) =>
            setPromo({ ...promo, expiry_date: e.target.value })
          }
          className="input w-full"
        />

        <button
          onClick={handlePromoSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-xl"
        >
          {loading ? "Saving..." : "Create Promo"}
        </button>
      </div>
    </div>
  );
}