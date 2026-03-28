require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ── Connect to MongoDB ──────────────────────────────────────────
connectDB();

const app = express();

// ── Middleware ──────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ── Health check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'IMS Backend is running ✅' });
});

// ── Routes ──────────────────────────────────────────────────────
app.use('/api/auth',                 require('./routes/auth'));
app.use('/api/student',              require('./routes/student'));
app.use('/api/letters',              require('./routes/letters'));
app.use('/api/reports',              require('./routes/reports'));
app.use('/api/evaluations',          require('./routes/evaluations'));
app.use('/api/opportunities',        require('./routes/opportunities'));
app.use('/api/admin',                require('./routes/admin'));
app.use('/api/academic-supervisor',  require('./routes/academicSupervisor'));
app.use('/api/workplace-supervisor', require('./routes/workplaceSupervisor'));

// ── Global error handler ────────────────────────────────────────
app.use(errorHandler);

// ── Start server ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 IMS Server running on port ${PORT} [${process.env.NODE_ENV}]`);
});