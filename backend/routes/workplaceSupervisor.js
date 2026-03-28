const express = require('express');
const router = express.Router();
const {
  getAssignedInterns,
  getInternReports,
} = require('../controllers/workplaceSupervisorController');
const { protect, authorise } = require('../middleware/auth');

router.use(protect, authorise('workplace-supervisor'));

// GET /api/workplace-supervisor/interns
router.get('/interns', getAssignedInterns);

// GET /api/workplace-supervisor/interns/:studentId/reports
router.get('/interns/:studentId/reports', getInternReports);

module.exports = router;
