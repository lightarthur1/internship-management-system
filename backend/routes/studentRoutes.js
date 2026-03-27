const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  startInternship,
  submitLog,
  getMyLogs,
  getMyWorkplaceReports,
} = require("../controllers/studentController");

const router = express.Router();

router.patch("/me/internship/start", requireAuth, requireRole("student"), startInternship);
router.post("/me/logs", requireAuth, requireRole("student"), submitLog);
router.get("/me/logs", requireAuth, requireRole("student"), getMyLogs);
router.get("/me/workplace-reports", requireAuth, requireRole("student"), getMyWorkplaceReports);

module.exports = router;

