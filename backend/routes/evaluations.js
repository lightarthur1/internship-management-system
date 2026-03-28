const express = require('express');
const router = express.Router();
const {
  upsertEvaluation,
  getMyEvaluations,
  getStudentEvaluation,
  getSupervisorStudentEvaluations,
} = require('../controllers/evaluationController');
const { protect, authorise } = require('../middleware/auth');

// Workplace supervisor: write/update an evaluation, view their own evaluations
router.post('/',             protect, authorise('workplace-supervisor'), upsertEvaluation);
router.get('/my-interns',    protect, authorise('workplace-supervisor'), getMyEvaluations);

// Academic supervisor: view evaluations for all their assigned students
router.get('/supervisor-students', protect, authorise('academic-supervisor'), getSupervisorStudentEvaluations);

// Student, academic supervisor, workplace supervisor, admin: view one student's evaluation
router.get('/student/:studentId', protect, authorise('student', 'academic-supervisor', 'workplace-supervisor', 'admin'), getStudentEvaluation);

module.exports = router;
