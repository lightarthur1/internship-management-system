const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { getMe, updateMyProfile } = require("../controllers/userController");

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.patch("/me/profile", requireAuth, updateMyProfile);

module.exports = router;

