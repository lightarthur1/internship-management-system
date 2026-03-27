const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const letterRoutes = require("./routes/letterRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const academicRoutes = require("./routes/academicRoutes");
const workplaceRoutes = require("./routes/workplaceRoutes");
const { ensureAdminAccount } = require("./utils/seedAdmin");

const app = express();

// 1. MIDDLEWARE 
// This allows your React app (on port 5173/3000) to talk to this server
app.use(cors());
// This allows your server to read JSON data sent in a request body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 2. DATABASE CONNECTION
// We use a variable from your .env file to keep your credentials secret
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected... 🍃");
    await ensureAdminAccount();
  })
  .catch((err) => console.error("❌ Database Connection Error:", err));

// 3. ROUTE REDIRECTS (The "Traffic Controller")
// We will create these files in your /routes folder next.
// This keeps your 4 dashboards separated and organized.
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/letters", letterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/workplace", workplaceRoutes);

// 4. BASE TEST ROUTE
app.get('/', (req, res) => {
  res.send('IMS Backend API is live! 🚀');
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 5. START THE SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});