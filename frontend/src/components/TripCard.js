"use client";

import { FaCalendarAlt, FaClock, FaStar, FaUsers } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  const handleBook = () => {
    navigate(`booking/${trip._id}`)
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={trip.image || "/place-image.jpg"}
        alt={`${trip.from} to ${trip.to}`}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">
        <div className="flex items-center text-yellow-500 text-sm mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`mr-1 ${i < (trip.rating ?? 4) ? "fill-current" : "text-gray-300"}`}
            />
          ))}
          <span className="ml-2 text-gray-500">({trip.reviews ?? 156} reviews)</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {trip.from} → {trip.to}
        </h3>
        <div className="flex items-center text-gray-600 text-sm mb-1">
          <FaClock className="mr-2" />
          {trip.duration || "2h 15min"}
        </div>
        <div className="flex items-center text-gray-600 text-sm mb-1">
          <FaUsers className="mr-2" />
          {trip.availableSeats} seats available
        </div>
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <FaCalendarAlt className="mr-2" />
          {new Date(trip.date).toLocaleDateString()}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${trip.price}</span>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={handleBook}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
