"use client"

const SeatSelection = ({ totalSeats, bookedSeats = [], selectedSeats = [], onSeatSelect }) => {
  const seatsPerRow = 4
  const rows = Math.ceil(totalSeats / seatsPerRow)
  const seatLabels = ["A", "B", "C", "D", "E", "F"]

  const generateSeatNumber = (row, seatIndex) => {
    return `${seatLabels[seatIndex]}${row + 1}`
  }

  const getSeatStatus = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return "booked"
    if (selectedSeats.includes(seatNumber)) return "selected"
    return "available"
  }

  const getSeatClass = (status) => {
    switch (status) {
      case "booked":
        return "bg-red-500 text-white cursor-not-allowed"
      case "selected":
        return "bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
      case "available":
        return "bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300 border-2 border-gray-300 hover:border-blue-400"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }

  const handleSeatClick = (seatNumber, status) => {
    if (status === "booked") return
    onSeatSelect(seatNumber)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-center space-x-6 mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-200 border-2 border-gray-300 rounded"></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded"></div>
          <span className="text-sm text-gray-600">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600">Booked</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="text-sm font-medium text-blue-800">Front of Aircraft</span>
          </div>
        </div>

        <div className="space-y-3">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex justify-center items-center space-x-2">
              <div className="w-8 text-center text-sm font-medium text-gray-500">{rowIndex + 1}</div>

              <div className="flex space-x-1">
                {[0, 1].map((seatIndex) => {
                  const seatNumber = generateSeatNumber(rowIndex, seatIndex)
                  const seatExists = rowIndex * seatsPerRow + seatIndex < totalSeats
                  if (!seatExists) return <div key={seatIndex} className="w-8 h-8"></div>

                  const status = getSeatStatus(seatNumber)
                  return (
                    <button
                      key={seatNumber}
                      onClick={() => handleSeatClick(seatNumber, status)}
                      disabled={status === "booked"}
                      className={`w-8 h-8 rounded text-xs font-medium transition-colors ${getSeatClass(status)}`}
                      title={`Seat ${seatNumber} - ${status}`}
                    >
                      {seatNumber}
                    </button>
                  )
                })}
              </div>

              <div className="w-8 flex justify-center">
                <div className="w-1 h-6 bg-gray-300 rounded"></div>
              </div>

              <div className="flex space-x-1">
                {[2, 3].map((seatIndex) => {
                  const seatNumber = generateSeatNumber(rowIndex, seatIndex)
                  const seatExists = rowIndex * seatsPerRow + seatIndex < totalSeats
                  if (!seatExists) return <div key={seatIndex} className="w-8 h-8"></div>

                  const status = getSeatStatus(seatNumber)
                  return (
                    <button
                      key={seatNumber}
                      onClick={() => handleSeatClick(seatNumber, status)}
                      disabled={status === "booked"}
                      className={`w-8 h-8 rounded text-xs font-medium transition-colors ${getSeatClass(status)}`}
                      title={`Seat ${seatNumber} - ${status}`}
                    >
                      {seatNumber}
                    </button>
                  )
                })}
              </div>

              <div className="w-8 text-center text-sm font-medium text-gray-500">{rowIndex + 1}</div>
            </div>
          ))}
        </div>

        {selectedSeats.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected
                </p>
                <p className="text-xs text-blue-700">Seats: {selectedSeats.join(", ")}</p>
              </div>
              <button
                onClick={() => selectedSeats.forEach((seat) => onSeatSelect(seat))}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">Click on available seats to select them for booking</p>
      </div>
    </div>
  )
}

export default SeatSelection
