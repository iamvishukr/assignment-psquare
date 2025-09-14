const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    seats: [
      {
        type: String,
        required: true,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    passengerInfo: {
      name: String,
      email: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Booking", bookingSchema)
