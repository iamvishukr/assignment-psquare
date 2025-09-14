const express = require("express")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const { auth } = require("../middleware/auth")

const router = express.Router()

const sendTokenResponse = (user, res) => {
  const payload = { id: user._id }
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, 
    })
    .json({
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
}

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password } = req.body

      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ message: "User already exists" })
      }

      user = new User({ name, email, password })
      await user.save()

      sendTokenResponse(user, res)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  }
)

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" })
      }

      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" })
      }

      sendTokenResponse(user, res)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  }
)

router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        address: req.user.address,
        dateOfBirth: req.user.dateOfBirth,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
