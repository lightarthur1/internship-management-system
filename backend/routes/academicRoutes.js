const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  getAssignedStudents,
  getStudentLogs,
  reviewLog,
  getWorkplaceReportsForStudent,
} = require("../controllers/academicController");

const router = express.Router();

router.get("/me/students", requireAuth, requireRole("academic-supervisor"), getAssignedStudents);
router.get(
  "/students/:studentId/logs",
  requireAuth,
  requireRole("academic-supervisor"),
  getStudentLogs
);
router.patch("/logs/:logId/review", requireAuth, requireRole("academic-supervisor"), reviewLog);
router.get(
  "/students/:studentId/workplace-reports",
  requireAuth,
  requireRole("academic-supervisor"),
  getWorkplaceReportsForStudent
);

module.exports = router;

