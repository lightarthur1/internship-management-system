const StudentProfile = require('../models/StudentProfile');
const InternshipReport = require('../models/InternshipReport');
const SupervisorEvaluation = require('../models/SupervisorEvaluation');

// ── @GET /api/academic-supervisor/students ────────────────────────────────
// Returns all students assigned to this academic supervisor
const getAssignedStudents = async (req, res, next) => {
  try {
    const students = await StudentProfile.find({ academicSupervisor: req.user.id })
      .populate('user', 'name email')
      .populate('workplaceSupervisor', 'name email')
      .populate('chosenOpportunity', 'companyName location duration');

    res.status(200).json({ success: true, count: students.length, students });
  } catch (err) { next(err); }
};

// ── @GET /api/academic-supervisor/reports ────────────────────────────────
// Returns all reports submitted to this supervisor (optionally filtered)
const getReports = async (req, res, next) => {
  try {
    const { status, studentId } = req.query;
    const filter = { academicSupervisor: req.user.id };
    if (status) filter.status = status;
    if (studentId) filter.student = studentId;

    const reports = await InternshipReport.find(filter)
      .populate('student', 'name email')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (err) { next(err); }
};

// ── @GET /api/academic-supervisor/evaluations ─────────────────────────────
// Returns all workplace supervisor evaluations for this supervisor's students
const getStudentEvaluations = async (req, res, next) => {
  try {
    const evaluations = await SupervisorEvaluation.find({ academicSupervisor: req.user.id })
      .populate('student', 'name email')
      .populate('workplaceSupervisor', 'name email')
      .sort('-updatedAt');

    res.status(200).json({ success: true, count: evaluations.length, evaluations });
  } catch (err) { next(err); }
};

module.exports = { getAssignedStudents, getReports, getStudentEvaluations };
