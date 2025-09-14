"use client"

import { useState } from "react"

const BookingCard = ({ booking, onCancel, showCancelButton = false }) => {
  const [showDetails, setShowDetails] = useState(false)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    return timeString
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Confirmed"
      case "pending":
        return "Pending"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const isUpcoming = () => {
    const tripDate = new Date(booking.trip.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return tripDate >= today && booking.status !== "cancelled"
  }

  const handleViewTicket = () => {
    console.log("Viewing ticket for booking:", booking.bookingId)
    alert("Ticket viewer would open here")
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-bold text-gray-900">Booking ID: {booking.bookingId}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {getStatusText(booking.status)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Booked on {formatDate(booking.createdAt)} • {booking.seats.length} seat
              {booking.seats.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">${booking.totalAmount}</p>
            <p className="text-sm text-gray-500">Total paid</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{booking.trip.from}</p>
            <p className="text-sm text-gray-600">{formatTime(booking.trip.time)}</p>
          </div>

          <div className="flex-1 flex items-center justify-center mx-4">
            <div className="flex items-center space-x-2">
              <div className="h-px bg-gray-300 flex-1 w-16"></div>
              <div className="text-center">
                <svg className="h-5 w-5 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                <p className="text-xs text-gray-500 mt-1">{isUpcoming() ? "Upcoming" : "Completed"}</p>
              </div>
              <div className="h-px bg-gray-300 flex-1 w-16"></div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{booking.trip.to}</p>
            <p className="text-sm text-gray-600">Arrival</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-medium">{formatDate(booking.trip.date)}</p>
          </div>
          <div>
            <p className="text-gray-500">Time</p>
            <p className="font-medium">{formatTime(booking.trip.time)}</p>
          </div>
          <div>
            <p className="text-gray-500">Seats</p>
            <p className="font-medium">{booking.seats.join(", ")}</p>
          </div>
          <div>
            <p className="text-gray-500">Passenger</p>
            <p className="font-medium">{booking.passengerInfo.name}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleViewTicket}
            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            View Ticket
          </button>

          {showCancelButton && booking.status === "confirmed" && (
            <button
              onClick={() => onCancel(booking._id)}
              className="flex-1 sm:flex-none bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Cancel Booking
            </button>
          )}

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 sm:flex-none border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Passenger Information</h4>
                <div className="space-y-1">
                  <p>
                    <span className="text-gray-500">Name:</span> {booking.passengerInfo.name}
                  </p>
                  <p>
                    <span className="text-gray-500">Email:</span> {booking.passengerInfo.email}
                  </p>
                  <p>
                    <span className="text-gray-500">Phone:</span> {booking.passengerInfo.phone}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Booking Information</h4>
                <div className="space-y-1">
                  <p>
                    <span className="text-gray-500">Booking ID:</span> {booking.bookingId}
                  </p>
                  <p>
                    <span className="text-gray-500">Status:</span> {getStatusText(booking.status)}
                  </p>
                  <p>
                    <span className="text-gray-500">Booked on:</span> {formatDate(booking.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingCard
