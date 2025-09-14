"use client";

const FlightTicketCard = ({ booking = {}, trip = {}, onDownload }) => {
  const passengerName = booking?.passengerInfo?.name || "John Doe";
  const seatNumber = booking?.seats?.[0] || "N/A";
  const bookingId = booking?.bookingId || "000000";

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";
  };

  const formatTime = (timeString) => timeString || "00:00";

  const calculateArrivalTime = (departureTime) => {
    if (!departureTime) return "00:00";
    const [time, period] = departureTime.split(" ");
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours);

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    hour += 2; 
    let newMinutes = parseInt(minutes) + 30; 
    if (newMinutes >= 60) {
      hour += 1;
      newMinutes -= 60;
    }

    const finalHour = hour > 12 ? hour - 12 : hour;
    const finalPeriod = hour >= 12 ? "PM" : "AM";
    return `${finalHour}:${newMinutes.toString().padStart(2, "0")} ${finalPeriod}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-blue-500 p-6 text-white relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{passengerName.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{passengerName}</h2>
              <p className="text-blue-100 text-sm">Boarding Pass N°{bookingId}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Business Class</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">📅</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-semibold text-sm">{formatDate(trip?.date)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">🕐</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Flight Time</p>
              <p className="font-semibold text-sm">{formatTime(trip?.time)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">🚪</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Gate</p>
              <p className="font-semibold text-sm">A02</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">💺</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Seat</p>
              <p className="font-semibold text-sm">{seatNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <div className="text-3xl font-bold text-gray-800">{formatTime(trip?.time)}</div>
            <div className="text-gray-500 text-sm">{trip?.from || "From"}</div>
          </div>

          <div className="flex-1 mx-8 relative">
            <svg className="w-full h-24" viewBox="0 0 300 100">
              <path
                d="M 20 80 Q 150 20 280 80"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
              />
              <circle cx="20" cy="80" r="4" fill="#3b82f6" />
              <circle cx="280" cy="80" r="4" fill="#3b82f6" />
            </svg>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-gray-800">
              {calculateArrivalTime(trip?.time)}
            </div>
            <div className="text-gray-500 text-sm">{trip?.to || "To"}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div>
            <div className="text-4xl font-bold text-gray-800">EK</div>
            <div className="text-gray-500 text-sm">ABC{bookingId}</div>
          </div>
          <div className="flex items-center space-x-1">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="bg-black"
                style={{ width: Math.random() > 0.5 ? "2px" : "1px", height: "40px" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightTicketCard;
