const express = require("express");
const { body, validationResult } = require("express-validator");
const Booking = require("../models/Booking");
const Trip = require("../models/Trip");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

const generateBookingId = () => {
  return (
    "B" + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
  );
};

router.post(
  "/",
  auth,
  [
    body("tripId").notEmpty().withMessage("Trip ID is required"),
    body("seats")
      .isArray({ min: 1 })
      .withMessage("At least one seat must be selected"),
    body("passengerInfo.name")
      .notEmpty()
      .withMessage("Passenger name is required"),
    body("passengerInfo.email")
      .isEmail()
      .withMessage("Valid email is required"),
    body("passengerInfo.phone")
      .notEmpty()
      .withMessage("Phone number is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { tripId, seats, passengerInfo } = req.body;

      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      const unavailableSeats = seats.filter((seat) =>
        trip.bookedSeats.includes(seat)
      );
      if (unavailableSeats.length > 0) {
        return res.status(400).json({
          message: `Seats ${unavailableSeats.join(", ")} are already booked,
        `,
        });
      }

      if (trip.availableSeats < seats.length) {
        return res.status(400).json({ message: "Not enough available seats" });
      }

      const totalAmount = trip.price * seats.length;

      const booking = new Booking({
        user: req.user._id,
        trip: tripId,
        seats,
        totalAmount,
        bookingId: generateBookingId(),
        passengerInfo,
      });

      await booking.save();

      trip.bookedSeats.push(...seats);
      trip.availableSeats -= seats.length;
      await trip.save();

      await booking.populate("trip");

      res.status(201).json(booking);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/my-bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "trip"
    );

    const now = new Date();
    const upcoming = bookings.filter((b) => new Date(b.trip.date) >= now);
    const past = bookings.filter((b) => new Date(b.trip.date) < now);

    res.json({ upcoming, past }); 
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("trip")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("trip")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("trip");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    const trip = booking.trip;
    trip.bookedSeats = trip.bookedSeats.filter(
      (seat) => !booking.seats.includes(seat)
    );
    trip.availableSeats += booking.seats.length;
    await trip.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
