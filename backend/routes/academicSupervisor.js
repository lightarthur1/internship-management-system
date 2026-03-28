const express = require('express');
const router = express.Router();
const {
  getAssignedStudents,
  getReports,
  getStudentEvaluations,
} = require('../controllers/academicSupervisorController');
const { protect, authorise } = require('../middleware/auth');

router.use(protect, authorise('academic-supervisor'));

// GET /api/academic-supervisor/students
router.get('/students', getAssignedStudents);

// GET /api/academic-supervisor/reports  (with optional ?status=pending&studentId=xxx)
router.get('/reports', getReports);

// GET /api/academic-supervisor/evaluations
router.get('/evaluations', getStudentEvaluations);

module.exports = router;
