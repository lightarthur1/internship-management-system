const User = require("../models/User");
const StudentLog = require("../models/StudentLog");
const WorkplaceReport = require("../models/WorkplaceReport");

async function startInternship(req, res) {
  try {
    const userId = req.user?.sub;
    const { workplaceSupervisorName, workplaceSupervisorEmail, workplaceSupervisorPhone, companyName } =
      req.body || {};

    if (!workplaceSupervisorName || !workplaceSupervisorEmail) {
      return res
        .status(400)
        .json({ message: "workplaceSupervisorName and workplaceSupervisorEmail are required" });
    }

    const user = await User.findById(userId).select("profile");
    if (!user) return res.status(404).json({ message: "Student not found" });

    user.profile = {
      ...(user.profile || {}),
      internshipStatus: "active",
      workplaceSupervisorName,
      workplaceSupervisorEmail,
      workplaceSupervisorPhone: workplaceSupervisorPhone || "",
      companyName: companyName || user.profile?.companyName || "",
    };
    await user.save();

    return res.status(200).json({ profile: user.profile });
  } catch (error) {
    return res.status(500).json({ message: "Failed to start internship", error: error.message });
  }
}

async function submitLog(req, res) {
  try {
    const userId = req.user?.sub;
    const { periodType, content } = req.body || {};
    if (!periodType || !content) {
      return res.status(400).json({ message: "periodType and content are required" });
    }
    const log = await StudentLog.create({ student: userId, periodType, content });
    return res.status(201).json({ log });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit log", error: error.message });
  }
}

async function getMyLogs(req, res) {
  try {
    const userId = req.user?.sub;
    const logs = await StudentLog.find({ student: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ logs });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load logs", error: error.message });
  }
}

async function getMyWorkplaceReports(req, res) {
  try {
    const userId = req.user?.sub;
    const reports = await WorkplaceReport.find({ student: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ reports });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load workplace reports", error: error.message });
  }
}

module.exports = { startInternship, submitLog, getMyLogs, getMyWorkplaceReports };

