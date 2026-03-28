const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  assignSupervisor,
  getAllStudents,
  getAllSupervisors,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, authorise } = require('../middleware/auth');

// All admin routes require login + admin role
router.use(protect, authorise('admin'));

// Dashboard stats
router.get('/stats', getDashboardStats);

// Opportunities
router.get('/opportunities',        getOpportunities);
router.post('/opportunities',       createOpportunity);
router.put('/opportunities/:id',    updateOpportunity);
router.delete('/opportunities/:id', deleteOpportunity);

// Supervisor assignment
router.put('/assign-supervisor', assignSupervisor);

// Users
router.get('/students',    getAllStudents);
router.get('/supervisors', getAllSupervisors);

module.exports = router;
