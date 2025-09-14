"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plane } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { trip, selectedSeats } = location.state || {};
  const totalAmount = trip && selectedSeats ? trip.price * selectedSeats.length : 0;

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    paymentMethod: "credit-card",
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!trip || !selectedSeats || selectedSeats.length === 0) {
      navigate("/");
    }
  }, [trip, selectedSeats, navigate]);

  const formatDate = (dateString) => new Date(dateString).toISOString().split("T")[0];

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      let val = value.replace(/\D/g, "").slice(0, 16);
      val = val.replace(/(.{4})/g, "$1 ").trim();
      setFormData({ ...formData, [name]: val });
    } else if (name === "cvv") {
      setFormData({ ...formData, [name]: value.replace(/\D/g, "").slice(0, 3) });
    } else if (name === "expiryDate") {
      let val = value.replace(/\D/g, "").slice(0, 4);
      if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
      setFormData({ ...formData, [name]: val });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return setError("Full name is required"), false;
    if (!formData.email.trim()) return setError("Email is required"), false;
    if (!formData.phone.trim()) return setError("Phone number is required"), false;

    if (formData.paymentMethod === "credit-card") {
      if (!formData.cardholderName.trim()) return setError("Cardholder name is required"), false;
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length !== 16)
        return setError("Valid card number is required"), false;
      if (!formData.expiryDate || formData.expiryDate.length !== 5)
        return setError("Expiry date is required"), false;
      if (!formData.cvv || formData.cvv.length !== 3) return setError("CVV is required"), false;
    }

    setError("");
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const bookingData = {
        tripId: trip._id,
        seats: selectedSeats,
        passengerInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
      };

      const response = await api.post("/bookings", bookingData);

      navigate("/booking-confirmation", {
        state: {
          booking: response.data,
          trip,
          paymentInfo: {
            method: formData.paymentMethod,
            amount: totalAmount,
          },
        },
      });
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!trip || !selectedSeats) return null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Checkout & Payment</h1>

        {error && <p className="text-red-600 mb-4 text-center font-medium">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Information</h2>
              <p className="text-sm text-gray-600 mb-6">Enter your contact details</p>
              <div className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h2>
              <div className="space-y-3 mb-6">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer bg-blue-50 border-blue-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === "credit-card"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-3">Credit/Debit Card</span>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="digital-wallet"
                    checked={formData.paymentMethod === "digital-wallet"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-3">Digital Wallet (PayPal, Apple Pay)</span>
                </label>
              </div>

              {formData.paymentMethod === "credit-card" && (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Booking Summary</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-slate-800 p-6 flex justify-center">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span>Route:</span>
                  <span>
                    {capitalize(trip.from)} to {capitalize(trip.to)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formatDate(trip.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{trip.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seats:</span>
                  <span>{selectedSeats.join(", ")}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-semibold">Total Fare:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    INR {totalAmount.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Complete Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
