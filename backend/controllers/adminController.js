const User = require("../models/User");

async function getAcademicSupervisors(req, res) {
  try {
    const supervisors = await User.find({ role: "academic-supervisor", isActive: true })
      .select("fullName email profile")
      .sort({ fullName: 1 });
    return res.status(200).json({ supervisors });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load supervisors", error: error.message });
  }
}

async function getStudents(req, res) {
  try {
    const students = await User.find({ role: "student", isActive: true })
      .populate("profile.academicSupervisorId", "fullName email")
      .select("fullName email profile")
      .sort({ createdAt: -1 });
    return res.status(200).json({ students });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load students", error: error.message });
  }
}

async function assignAcademicSupervisor(req, res) {
  try {
    const { studentId } = req.params;
    const { academicSupervisorId } = req.body || {};
    if (!academicSupervisorId) {
      return res.status(400).json({ message: "academicSupervisorId is required" });
    }

    const supervisor = await User.findOne({
      _id: academicSupervisorId,
      role: "academic-supervisor",
      isActive: true,
    }).select("fullName");
    if (!supervisor) return res.status(404).json({ message: "Academic supervisor not found" });

    const student = await User.findOne({ _id: studentId, role: "student" }).select("profile");
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.profile = {
      ...(student.profile || {}),
      academicSupervisorId,
      preferredAcademicSupervisorName: supervisor.fullName,
    };
    await student.save();

    const updated = await User.findById(studentId)
      .populate("profile.academicSupervisorId", "fullName email")
      .select("fullName email profile");
    return res.status(200).json({ student: updated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to assign supervisor", error: error.message });
  }
}

module.exports = {
  getAcademicSupervisors,
  getStudents,
  assignAcademicSupervisor,
};

