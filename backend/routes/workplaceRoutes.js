const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  getAssignedStudents,
  submitWorkplaceReport,
  getReportsBySupervisorEmail,
} = require("../controllers/workplaceController");

const router = express.Router();

router.get("/me/students", requireAuth, requireRole("workplace-supervisor"), getAssignedStudents);
router.post("/reports", requireAuth, requireRole("workplace-supervisor"), submitWorkplaceReport);
router.get(
  "/reports",
  requireAuth,
  requireRole("workplace-supervisor"),
  getReportsBySupervisorEmail
);

module.exports = router;

