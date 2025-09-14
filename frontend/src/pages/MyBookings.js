import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendar, FaClock, FaLocationArrow, FaPlane, FaTrain } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card.js";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.js";

export default function BookingDashboard({ py = 20 }) {
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { upcoming, past } = res.data;
      setBookings({ upcoming, past });
    } catch (err) {
      console.error(err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };
  fetchBookings();
}, []);


  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatSeats = (seats) => (Array.isArray(seats) ? seats.join(", ") : seats);

  if (loading) return <p className="text-center py-10">Loading bookings...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <>
      <div className={`px-40 py-${py} space-y-8 bg-gray-50 min-h-screen`}>
        <div>
          <h3 className="text-xl font-semibold mb-4">Upcoming Bookings</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {bookings?.upcoming?.length > 0 ? (
              bookings.upcoming.map((booking) => (
                <Card key={booking._id || booking.bookingId} className="p-4">
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>Booking ID: {booking.bookingId || booking._id}</CardTitle>
                    {booking.trip.type === "Flight" ? (
                      <FaPlane size={18} color="blue" />
                    ) : (
                      <FaTrain size={18} color="green" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-xl">
                      Upcoming
                    </span>
                    <div className="flex text-sm items-center mt-2">
                      <FaLocationArrow size={16} className="mr-2" />
                      {booking.trip.from} → {booking.trip.to}
                    </div>
                    <div className="flex text-sm text-gray-500 items-center">
                      <FaCalendar size={16} className="mr-2" />
                      {formatDate(booking.trip.date)}
                    </div>
                    <div className="flex text-sm text-gray-500 items-center">
                      <FaClock size={16} className="mr-2" />
                      {booking.trip.time}
                    </div>
                    <p className="text-sm mt-2">Seats: {formatSeats(booking.seats)}</p>
                    <button
                      onClick={() =>
                        navigate("/booking-confirmation", {
                          state: { booking, trip: booking.trip },
                        })
                      }
                      className="w-full py-5 flex justify-center rounded text-white font-semibold bg-gradient-to-r from-blue-100 to-blue-200"
                    >
                      {booking.trip.type === "Flight" ? (
                        <FaPlane size={18} color="blue" />
                      ) : (
                        <FaTrain size={18} color="green" />
                      )}
                    </button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">No upcoming bookings found.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Past Bookings</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {bookings?.past?.length > 0 ? (
              bookings.past.map((booking) => (
                <Card key={booking._id || booking.bookingId} className="p-4">
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>Booking ID: {booking.bookingId || booking._id}</CardTitle>
                    {booking.trip.type === "Flight" ? (
                      <FaPlane size={18} color="blue" />
                    ) : (
                      <FaTrain size={18} color="green" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-xl">
                      Completed
                    </span>
                    <div className="flex text-sm items-center mt-2">
                      <FaLocationArrow size={16} className="mr-2" />
                      {booking.trip.from} → {booking.trip.to}
                    </div>
                    <div className="flex text-sm text-gray-500 items-center">
                      <FaCalendar size={16} className="mr-2" />
                      {formatDate(booking.trip.date)}
                    </div>
                    <div className="flex text-sm text-gray-500 items-center">
                      <FaClock size={16} className="mr-2" />
                      {booking.trip.time}
                    </div>
                    <p className="text-sm mt-2">Seats: {formatSeats(booking.seats)}</p>
                    <button
                      onClick={() =>
                        navigate("/booking-confirmation", {
                          state: { booking, trip: booking.trip },
                        })
                      }
                      className="w-full py-5 flex justify-center rounded text-white font-semibold bg-gradient-to-r from-blue-100 to-blue-200"
                    >
                      {booking.trip.type === "Flight" ? (
                        <FaPlane size={18} color="blue" />
                      ) : (
                        <FaTrain size={18} color="green" />
                      )}
                    </button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">No past bookings found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
