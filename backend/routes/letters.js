const express = require('express');
const router = express.Router();
const {
  requestLetter,
  getMyLetters,
  getAllLetters,
  approveLetter,
  rejectLetter,
  downloadLetter,
} = require('../controllers/letterController');
const { protect, authorise } = require('../middleware/auth');

// Student: request a letter & view their own requests
router.post('/request',  protect, authorise('student'), requestLetter);
router.get('/my',        protect, authorise('student'), getMyLetters);

// Student OR Admin: download an approved letter
router.get('/:id/download', protect, authorise('student', 'admin'), downloadLetter);

// Admin only: see all requests, approve, reject
router.get('/',              protect, authorise('admin'), getAllLetters);
router.put('/:id/approve',   protect, authorise('admin'), approveLetter);
router.put('/:id/reject',    protect, authorise('admin'), rejectLetter);

module.exports = router;
