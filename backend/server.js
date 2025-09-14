const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser");
const path = require("path")



dotenv.config()

const app = express()
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3000";

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

app.options("*", cors({
  origin: allowedOrigin,
  credentials: true,
}));

app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")))


app.use(express.json())

app.use("/api/auth", require("./routes/auth"))
app.use("/api/trips", require("./routes/trips"))
app.use("/api/bookings", require("./routes/bookings"))
app.use("/api/users", require("./routes/users"))

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
