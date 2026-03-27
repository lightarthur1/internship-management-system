const User = require("../models/User");
const WorkplaceReport = require("../models/WorkplaceReport");

async function getAssignedStudents(req, res) {
  try {
    const supervisorEmail = (req.user?.email || "").toLowerCase();
    if (!supervisorEmail) {
      return res.status(400).json({ message: "Supervisor email missing from token" });
    }

    const students = await User.find({
      role: "student",
      isActive: true,
      "profile.workplaceSupervisorEmail": supervisorEmail,
    })
      .select("fullName email profile createdAt")
      .sort({ fullName: 1 });

    return res.status(200).json({ students });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to load assigned students", error: error.message });
  }
}

async function submitWorkplaceReport(req, res) {
  try {
    const requesterEmail = (req.user?.email || "").toLowerCase();
    const { studentId, period, rating, summary, recommendation } = req.body || {};
    if (!studentId || !period || !summary) {
      return res.status(400).json({ message: "studentId, period and summary are required" });
    }

    const student = await User.findOne({ _id: studentId, role: "student", isActive: true });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const supName = student.profile?.workplaceSupervisorName;
    const supEmail = student.profile?.workplaceSupervisorEmail;
    const supPhone = student.profile?.workplaceSupervisorPhone || "";
    if (!supName || !supEmail) {
      return res.status(400).json({ message: "Student has no assigned workplace supervisor details" });
    }

    if (!requesterEmail || requesterEmail !== String(supEmail).toLowerCase()) {
      return res.status(403).json({ message: "You are not assigned to this student" });
    }

    const report = await WorkplaceReport.create({
      student: studentId,
      workplaceSupervisor: { name: supName, email: supEmail, phone: supPhone },
      period,
      rating: rating ? Number(rating) : 3,
      summary,
      recommendation: recommendation || "",
    });
    return res.status(201).json({ report });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit workplace report", error: error.message });
  }
}

async function getReportsBySupervisorEmail(req, res) {
  try {
    const queryEmail = typeof req.query?.email === "string" ? req.query.email : "";
    const tokenEmail = typeof req.user?.email === "string" ? req.user.email : "";
    const email = (queryEmail || tokenEmail).toLowerCase();

    if (!email) return res.status(400).json({ message: "Unable to resolve supervisor email" });

    if (queryEmail && queryEmail.toLowerCase() !== tokenEmail.toLowerCase()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const reports = await WorkplaceReport.find({ "workplaceSupervisor.email": email })
      .populate("student", "fullName email profile")
      .sort({ createdAt: -1 });
    return res.status(200).json({ reports });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load reports", error: error.message });
  }
}

module.exports = { submitWorkplaceReport, getReportsBySupervisorEmail, getAssignedStudents };

