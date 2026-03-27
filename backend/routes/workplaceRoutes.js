const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  submitWorkplaceReport,
  getReportsBySupervisorEmail,
} = require("../controllers/workplaceController");

const router = express.Router();

router.post("/reports", requireAuth, requireRole("workplace-supervisor"), submitWorkplaceReport);
router.get(
  "/reports",
  requireAuth,
  requireRole("workplace-supervisor"),
  getReportsBySupervisorEmail
);

module.exports = router;

