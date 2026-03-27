const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  getAcademicSupervisors,
  getStudents,
  assignAcademicSupervisor,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/academic-supervisors", requireAuth, requireRole("admin"), getAcademicSupervisors);
router.get("/students", requireAuth, requireRole("admin"), getStudents);
router.patch(
  "/students/:studentId/academic-supervisor",
  requireAuth,
  requireRole("admin"),
  assignAcademicSupervisor
);

module.exports = router;

