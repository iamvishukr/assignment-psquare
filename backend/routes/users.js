const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { auth, adminAuth } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png) are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

router.put(
  "/profile",
  auth,
  upload.single("profileImage"),
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Please enter a valid email"),
    body("phone").optional(),
    body("address").optional(),
    body("dateOfBirth").optional().isISO8601().withMessage("Please enter a valid date"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, phone, address, dateOfBirth } = req.body;

      if (email && email !== req.user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "Email is already taken" });
        }
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;
      if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
      if (req.file) updateData.profileImage = `/uploads/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(req.user._id, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");

      res.json({ user });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/change-password",
  auth,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/stats", adminAuth, async (req, res) => {
  try {
    const Trip = require("../models/Trip");
    const Booking = require("../models/Booking");

    const totalUsers = await User.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const upcomingTrips = await Trip.find({
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(5);

    res.json({
      totalUsers,
      totalTrips,
      totalBookings,
      upcomingDepartures: upcomingTrips.length,
      upcomingTrips,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
