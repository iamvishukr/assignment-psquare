"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../utils/api"
import SeatSelection from "../components/SeatSelection"
import Footer from "../components/Footer"

const TripDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedSeats, setSelectedSeats] = useState([])

  useEffect(() => {
    fetchTripDetails()
  }, [id])

  const fetchTripDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/trips/${id}`)
      console.log(response)
      setTrip(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching trip details:", error)
      setError("Failed to load trip details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    return timeString
  }

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((seat) => seat !== seatNumber)
      } else {
        return [...prev, seatNumber]
      }
    })
  }

  const handleConfirmBooking = () => {
    if (!user) {
      navigate("/login")
      return
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat")
      return
    }

    navigate("/checkout", {
      state: {
        trip,
        selectedSeats,
        totalAmount: trip.price * selectedSeats.length,
      },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4">{error || "Trip not found"}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600">
        <img
          src={`/abstract-geometric-shapes.png?height=400&width=1200&query=${encodeURIComponent(
            `${trip.to} city skyline travel destination`,
          )}`}
          alt={`${trip.from} to ${trip.to}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">Trip Details</h1>
            <p className="text-lg md:text-xl text-blue-100">
              {trip.from} to {trip.to}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">From</h3>
                  <p className="text-2xl font-bold text-blue-600">{trip.from}</p>
                  <p className="text-sm text-gray-600">({trip.from.substring(0, 3).toUpperCase()})</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">To</h3>
                  <p className="text-2xl font-bold text-purple-600">{trip.to}</p>
                  <p className="text-sm text-gray-600">({trip.to.substring(0, 3).toUpperCase()})</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="h-5 w-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Date</h3>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{formatDate(trip.date)}</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="h-5 w-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Time</h3>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{formatTime(trip.time)}</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="h-5 w-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Price</h3>
                  </div>
                  <p className="text-lg font-bold text-green-600">${trip.price}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Seat</h2>
              <SeatSelection
                totalSeats={trip.totalSeats}
                bookedSeats={trip.bookedSeats}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Selected Seats</h3>

              {selectedSeats.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((seat) => (
                      <span
                        key={seat}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {seat}
                        <button
                          onClick={() => handleSeatSelect(seat)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Seats ({selectedSeats.length})</span>
                      <span className="font-medium">
                        ${trip.price} × {selectedSeats.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">₹{trip.price * selectedSeats.length}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmBooking}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm">No seats selected</p>
                  <p className="text-gray-400 text-xs mt-1">Choose your preferred seats above</p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">Trip Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route</span>
                    <span className="font-medium">
                      {trip.from} → {trip.to}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{new Date(trip.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{trip.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Seats</span>
                    <span className="font-medium">{trip.availableSeats}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default TripDetails
