const User = require("../models/User");
const StudentLog = require("../models/StudentLog");
const WorkplaceReport = require("../models/WorkplaceReport");

async function getAssignedStudents(req, res) {
  try {
    const academicId = req.user?.sub;
    const students = await User.find({
      role: "student",
      "profile.academicSupervisorId": academicId,
      isActive: true,
    }).select("fullName email profile");
    return res.status(200).json({ students });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load assigned students", error: error.message });
  }
}

async function getStudentLogs(req, res) {
  try {
    const academicId = req.user?.sub;
    const { studentId } = req.params;
    const student = await User.findOne({
      _id: studentId,
      role: "student",
      "profile.academicSupervisorId": academicId,
    }).select("_id");
    if (!student) return res.status(404).json({ message: "Student not found under your supervision" });

    const logs = await StudentLog.find({ student: studentId }).sort({ createdAt: -1 });
    return res.status(200).json({ logs });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load student logs", error: error.message });
  }
}

async function reviewLog(req, res) {
  try {
    const academicId = req.user?.sub;
    const { logId } = req.params;
    const { feedback, status } = req.body || {};
    const log = await StudentLog.findById(logId).populate("student", "profile.academicSupervisorId");
    if (!log) return res.status(404).json({ message: "Log not found" });
    if (String(log.student.profile?.academicSupervisorId || "") !== String(academicId)) {
      return res.status(403).json({ message: "You are not assigned to this student" });
    }

    log.feedback = feedback || "";
    log.status = status === "reviewed" ? "reviewed" : log.status;
    log.reviewedBy = academicId;
    log.reviewedAt = new Date();
    await log.save();
    return res.status(200).json({ log });
  } catch (error) {
    return res.status(500).json({ message: "Failed to review log", error: error.message });
  }
}

async function getWorkplaceReportsForStudent(req, res) {
  try {
    const academicId = req.user?.sub;
    const { studentId } = req.params;
    const student = await User.findOne({
      _id: studentId,
      role: "student",
      "profile.academicSupervisorId": academicId,
    }).select("_id");
    if (!student) return res.status(404).json({ message: "Student not found under your supervision" });

    const reports = await WorkplaceReport.find({ student: studentId }).sort({ createdAt: -1 });
    return res.status(200).json({ reports });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load workplace reports", error: error.message });
  }
}

module.exports = {
  getAssignedStudents,
  getStudentLogs,
  reviewLog,
  getWorkplaceReportsForStudent,
};

