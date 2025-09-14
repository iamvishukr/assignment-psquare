const express = require("express");
const { body, validationResult } = require("express-validator");
const Trip = require("../models/Trip");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const filter = {};

    if (from) filter.from = new RegExp(from, "i");
    if (to) filter.to = new RegExp(to, "i");
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: searchDate, $lt: nextDay };
    }

    const trips = await Trip.find(filter).sort({ date: 1 });
    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/",
  adminAuth,
  [
    body("from").notEmpty().withMessage("From location is required"),
    body("to").notEmpty().withMessage("To location is required"),
    body("date").isISO8601().withMessage("Valid date is required"),
    body("time").notEmpty().withMessage("Time is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("totalSeats")
      .isInt({ min: 1 })
      .withMessage("Total seats must be a positive integer"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { from, to, date, time, price, totalSeats, type } = req.body;

      const trip = new Trip({
        from,
        to,
        date,
        time,
        price: Number(price),
        totalSeats: Number(totalSeats),
        availableSeats: Number(totalSeats),
        type: type || "Flight",
      });

      await trip.save();
      res.status(201).json(trip);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put("/:id", adminAuth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const { from, to, date, time, price, totalSeats, type } = req.body;

    if (from) trip.from = from;
    if (to) trip.to = to;
    if (date) trip.date = date;
    if (time) trip.time = time;
    if (price) trip.price = Number(price);

    if (totalSeats) {
      const bookedSeats = trip.totalSeats - trip.availableSeats;
      trip.totalSeats = Number(totalSeats);
      trip.availableSeats = trip.totalSeats - bookedSeats;
    }

    if (type) trip.type = type;

    await trip.save();
    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
