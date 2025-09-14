import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import Footer from "../components/Footer";

const BookingPage = () => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/trips/${id}`);
      setTrip(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching trip details:", err);
      setError("Failed to load trip details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat before proceeding.");
      return;
    }

    navigate("/checkout", {
      state: {
        trip,
        selectedSeats,
      },
    });
  };

  const generateSeats = (totalSeats, seatsPerRow = 6) => {
    const seats = [];
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < totalSeats; i++) {
      const row = Math.floor(i / seatsPerRow);
      const col = (i % seatsPerRow) + 1;
      seats.push(`${alphabet[row]}${col}`);
    }
    return seats;
  };

  const allSeats = trip ? generateSeats(trip.totalSeats) : [];
  const bookedSeats = trip?.bookedSeats || [];

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  if (loading) return <p className="text-center mt-10">Loading trip details...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!trip) return null;

  return (
    <>
      <div className="max-w-[1600px] mt-5 mb-20 mx-auto overflow-hidden">
        <div className="p-6 border bg-white rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad"
            alt="Trip Banner"
            className="w-full h-[600px] object-cover mb-6 rounded"
          />

          <h3 className="text-2xl font-bold">Trip Details</h3>
          <div className="flex mt-4 justify-between items-center">
            <div>
              <p className="text-gray-600">From</p>
              <h3 className="font-semibold">{trip.from}</h3>
            </div>
            <div className="text-right">
              <p className="text-gray-600">To</p>
              <h3 className="font-semibold">{trip.to}</h3>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-gray-600">Date</p>
              <h3 className="font-medium">{new Date(trip.date).toLocaleDateString()}</h3>
            </div>
            <div>
              <p className="text-gray-600">Departure</p>
              <h3 className="font-medium text-right">{trip.time}</h3>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-600">Fare per seat</p>
            <h3 className="text-blue-600 font-bold text-lg">${trip.price}</h3>
          </div>
        </div>

        <div className="p-6 border mt-6 rounded-lg bg-white">
          <h3 className="font-semibold mb-4">Select Your Seat</h3>
          <div className="bg-gray-100 py-6 rounded">
            <h3 className="w-full text-center mb-6 font-medium">Cabin Layout</h3>

            <div className="flex justify-center">
              <div className="flex w-[250px] flex-wrap gap-2">
                {allSeats.map((seat) => {
                  const isBooked = bookedSeats.includes(seat);
                  const isSelected = selectedSeats.includes(seat);

                  return (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      disabled={isBooked}
                      className={`w-10 h-10 rounded text-sm font-medium transition
                      ${isBooked ? "bg-orange-300 cursor-not-allowed" : ""}
                      ${isSelected ? "bg-blue-500 text-white" : ""}
                      ${!isBooked && !isSelected ? "bg-gray-200 hover:bg-gray-300" : ""}
                    `}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-gray-300 rounded"></div> Available
              </div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-orange-300 rounded"></div> Booked
              </div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-blue-500 rounded"></div> Selected
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border mt-6">
          <h3 className="font-semibold mb-2">Selected Seats</h3>
          <p className="text-gray-700">
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "No seats selected"}
          </p>
        </div>

        <div className="p-6 text-center">
          <button
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded disabled:bg-gray-400"
            disabled={selectedSeats.length === 0}
          >
            Confirm Booking
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingPage;
