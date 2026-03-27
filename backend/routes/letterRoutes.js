const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  requestLetter,
  getMyLetters,
  getAllLetters,
  updateLetterStatus,
} = require("../controllers/letterController");

const router = express.Router();

router.post("/request", requireAuth, requireRole("student"), requestLetter);
router.get("/mine", requireAuth, requireRole("student"), getMyLetters);
router.get("/admin/all", requireAuth, requireRole("admin"), getAllLetters);
router.patch("/admin/:id/status", requireAuth, requireRole("admin"), updateLetterStatus);

module.exports = router;

