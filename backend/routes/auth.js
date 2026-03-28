const express = require('express');
const router = express.Router();
const { register, login, getMe, acceptInvite } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me  (requires valid token)
router.get('/me', protect, getMe);

// POST /api/auth/accept-invite  (workplace supervisor sets password)
router.post('/accept-invite', acceptInvite);

module.exports = router;
