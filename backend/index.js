const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. MIDDLEWARE 
// This allows your React app (on port 5173/3000) to talk to this server
app.use(cors());
// This allows your server to read JSON data sent in a request body
app.use(express.json()); 

// 2. DATABASE CONNECTION
// We use a variable from your .env file to keep your credentials secret
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected... 🍃'))
  .catch(err => console.error('❌ Database Connection Error:', err));

// 3. ROUTE REDIRECTS (The "Traffic Controller")
// We will create these files in your /routes folder next.
// This keeps your 4 dashboards separated and organized.
//app.use('/api/auth', require('./routes/authRoutes')); // For Login/Signup
//app.use('/api/admin', require('./routes/adminRoutes')); 
//app.use('/api/student', require('./routes/studentRoutes'));
//app.use('/api/academic', require('./routes/academicRoutes'));
//app.use('/api/workplace', require('./routes/workplaceRoutes'));

// 4. BASE TEST ROUTE
app.get('/', (req, res) => {
  res.send('IMS Backend API is live! 🚀');
});

// 5. START THE SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});