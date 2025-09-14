const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    let token = req.cookies?.token

    if (!token && req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "")
    }

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth error:", error.message)
    res.status(401).json({ message: "Token is not valid" })
  }
}

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, async () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." })
      }
      next()
    })
  } catch (error) {
    console.error("AdminAuth error:", error.message)
    res.status(401).json({ message: "Authorization failed" })
  }
}

module.exports = { auth, adminAuth }
