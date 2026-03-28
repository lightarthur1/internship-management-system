const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  startInternship,
  getAcademicSupervisors,
} = require('../controllers/studentController');
const { protect, authorise } = require('../middleware/auth');

// All routes require login + student role
router.use(protect, authorise('student'));

// GET  /api/student/profile
router.get('/profile', getProfile);

// PUT  /api/student/profile  (wizard setup + edit)
router.put('/profile', updateProfile);

// POST /api/student/start-internship  (toggle started + link workplace supervisor)
router.post('/start-internship', startInternship);

// GET  /api/student/academic-supervisors  (for supervisor dropdown in wizard)
router.get('/academic-supervisors', getAcademicSupervisors);

module.exports = router;
