const StudentProfile = require('../models/StudentProfile');
const InternshipReport = require('../models/InternshipReport');

// ── @GET /api/workplace-supervisor/interns ────────────────────────────────
// Returns all students assigned to this workplace supervisor
const getAssignedInterns = async (req, res, next) => {
  try {
    const interns = await StudentProfile.find({ workplaceSupervisor: req.user.id })
      .populate('user', 'name email')
      .populate('academicSupervisor', 'name email')
      .populate('chosenOpportunity', 'companyName location duration roles');

    res.status(200).json({ success: true, count: interns.length, interns });
  } catch (err) { next(err); }
};

// ── @GET /api/workplace-supervisor/interns/:studentId/reports ─────────────
// Workplace supervisor can view an intern's submitted reports (read-only)
const getInternReports = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Confirm this student is actually assigned to this supervisor
    const profile = await StudentProfile.findOne({
      user: studentId,
      workplaceSupervisor: req.user.id,
    });

    if (!profile) {
      return res.status(403).json({ success: false, message: 'This intern is not assigned to you.' });
    }

    const reports = await InternshipReport.find({ student: studentId })
      .populate('academicSupervisor', 'name email')
      .sort('-createdAt');

    res.status(200).json({ success: true, reports });
  } catch (err) { next(err); }
};

module.exports = { getAssignedInterns, getInternReports };
