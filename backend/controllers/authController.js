const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ── Generate JWT ───────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// ── @POST /api/auth/register ───────────────────────────────────────────────
// Roles allowed on signup form: student | academic-supervisor | workplace-supervisor
// Admin cannot self-register — they use the secret login below.
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Block any attempt to self-register as admin
    if (role === 'admin') {
      return res.status(403).json({ success: false, message: 'Admin registration is not permitted.' });
    }

    const allowed = ['student', 'academic-supervisor', 'workplace-supervisor'];
    if (!allowed.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password, role });

    // Auto-create empty student profile so wizard can populate it
    if (role === 'student') {
      await StudentProfile.create({ user: user._id });
    }

    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// ── @POST /api/auth/login ─────────────────────────────────────────────────
// Regular login for student, academic-supervisor, workplace-supervisor
// ALSO handles admin secret login: if email+password match .env creds → admin token
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required.' });
    }

    // ── Secret Admin Login ──
    // If the credentials exactly match the hardcoded .env admin credentials,
    // we issue an admin token without needing a DB record.
    // (The admin account IS also seeded in DB on first run — see index.js)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      let adminUser = await User.findOne({ role: 'admin' }).select('+password');

      // If admin doesn't exist in DB yet, create them now (first run)
      if (!adminUser) {
        adminUser = await User.create({
          name: 'System Admin',
          email: process.env.ADMIN_EMAIL,
          password: process.env.ADMIN_PASSWORD,
          role: 'admin',
        });
      }

      return sendToken(adminUser, 200, res);
    }

    // ── Normal User Login ──
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// ── @GET /api/auth/me ─────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ── @POST /api/auth/accept-invite ─────────────────────────────────────────
// Workplace supervisor clicks invite link → sets password and activates account
const acceptInvite = async (req, res, next) => {
  try {
    const { token, password, name } = req.body;

    const user = await User.findOne({
      inviteToken: token,
      inviteTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invite link is invalid or expired.' });
    }

    user.password = password;
    if (name) user.name = name; // Update "Pending Supervisor" to their real name

    user.inviteToken = undefined;
    user.inviteTokenExpiry = undefined;
    user.isInviteAccepted = true;
    await user.save();

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, acceptInvite };
