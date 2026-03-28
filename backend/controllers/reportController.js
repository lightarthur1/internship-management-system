const InternshipReport = require('../models/InternshipReport');
const StudentProfile = require('../models/StudentProfile');

// ── @POST /api/reports ────────────────────────────────────────────────────
// Student submits a report (goes to their academic supervisor)
const submitReport = async (req, res, next) => {
  try {
    const { reportType, content, weekNumber } = req.body;

    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile?.academicSupervisor) {
      return res.status(400).json({ success: false, message: 'You need an academic supervisor assigned before submitting reports.' });
    }

    const report = await InternshipReport.create({
      student: req.user.id,
      academicSupervisor: profile.academicSupervisor,
      reportType,
      content,
      weekNumber: weekNumber || null,
    });

    res.status(201).json({ success: true, report });
  } catch (err) {
    next(err);
  }
};

// ── @GET /api/reports/my ──────────────────────────────────────────────────
// Student sees all their own reports + supervisor feedback
const getMyReports = async (req, res, next) => {
  try {
    const reports = await InternshipReport.find({ student: req.user.id })
      .populate('academicSupervisor', 'name email')
      .sort('-createdAt');

    res.status(200).json({ success: true, reports });
  } catch (err) {
    next(err);
  }
};

// ── @GET /api/reports/supervisor ──────────────────────────────────────────
// Academic supervisor sees all reports from their assigned students
const getSupervisorReports = async (req, res, next) => {
  try {
    const { status } = req.query; // ?status=pending
    const filter = { academicSupervisor: req.user.id };
    if (status) filter.status = status;

    const reports = await InternshipReport.find(filter)
      .populate('student', 'name email')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (err) {
    next(err);
  }
};

// ── @PUT /api/reports/:id/review ──────────────────────────────────────────
// Academic supervisor reviews a report and adds feedback
const reviewReport = async (req, res, next) => {
  try {
    const { feedback } = req.body;

    const report = await InternshipReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found.' });

    // Make sure this report belongs to this supervisor
    if (report.academicSupervisor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    report.status = 'reviewed';
    report.feedback = feedback || '';
    report.reviewedAt = new Date();
    await report.save();

    res.status(200).json({ success: true, report });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitReport, getMyReports, getSupervisorReports, reviewReport };
