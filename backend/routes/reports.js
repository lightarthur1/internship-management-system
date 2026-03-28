const express = require('express');
const router = express.Router();
const {
  submitReport,
  getMyReports,
  getSupervisorReports,
  reviewReport,
} = require('../controllers/reportController');
const { protect, authorise } = require('../middleware/auth');

// Student: submit & view own reports
router.post('/',    protect, authorise('student'), submitReport);
router.get('/my',   protect, authorise('student'), getMyReports);

// Academic Supervisor: view all reports from their students + review/give feedback
router.get('/supervisor',        protect, authorise('academic-supervisor'), getSupervisorReports);
router.put('/:id/review',        protect, authorise('academic-supervisor'), reviewReport);

module.exports = router;
