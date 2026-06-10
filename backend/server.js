const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const dotenvResult = require("dotenv").config();
if (dotenvResult.error) {
  console.warn("No .env file found in backend. Set MONGO_URI in environment or create backend/.env.");
}

if (!process.env.MONGO_URI) {
  console.error("Missing MONGO_URI. Please set it in backend/.env or the environment.");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Ensure even error responses include CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Debug
console.log("MONGO_URI is configured");

mongoose.set("strictQuery", false);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log(" MongoDB Connected");
})
.catch((err) => {
    console.log(" MongoDB Error:");
    console.log(err);
});

// Routes
app.use("/api/contact", require("./routes/contacts"));
app.use("/api/admin", require("./routes/admin"));

// Test Route
app.get("/", (req, res) => {
    res.send("Backend Working");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(` Server Running on Port ${PORT}`);
});