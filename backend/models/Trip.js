const mongoose = require("mongoose")

const tripSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    bookedSeats: [
      {
        type: String,
      },
    ],
    type: {
      type: String,
      default: "Flight",
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Trip", tripSchema)
