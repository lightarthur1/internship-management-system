const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  listOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require("../controllers/opportunityController");

const router = express.Router();

router.get("/", listOpportunities);
router.post("/", requireAuth, requireRole("admin"), createOpportunity);
router.patch("/:id", requireAuth, requireRole("admin"), updateOpportunity);
router.delete("/:id", requireAuth, requireRole("admin"), deleteOpportunity);

module.exports = router;

