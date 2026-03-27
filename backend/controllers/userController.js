const User = require("../models/User");

async function getMe(req, res) {
  try {
    const userId = req.user?.sub;
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load user", error: error.message });
  }
}

async function updateMyProfile(req, res) {
  try {
    const userId = req.user?.sub;
    const updates = req.body || {};

    const allowed = [
      "studentId",
      "department",
      "level",
      "phone",
      "stateOfOrigin",
      "preferredAcademicSupervisorName",
      "academicSupervisorId",
      "workplaceSupervisorName",
      "workplaceSupervisorEmail",
      "workplaceSupervisorPhone",
      "companyName",
      "workEmail",
      "title",
      "internshipStatus",
    ];

    const profile = {};
    for (const key of allowed) {
      if (typeof updates[key] !== "undefined") profile[key] = updates[key];
    }

    const existing = await User.findById(userId).select("profile");
    if (!existing) return res.status(404).json({ message: "User not found" });
    const merged = { ...(existing.profile || {}), ...profile };

    const user = await User.findByIdAndUpdate(userId, { $set: { profile: merged } }, { new: true }).select("-passwordHash");

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
}

module.exports = { getMe, updateMyProfile };

