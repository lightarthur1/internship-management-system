const SupervisorEvaluation = require('../models/SupervisorEvaluation');
const StudentProfile = require('../models/StudentProfile');

// ── @POST /api/evaluations ────────────────────────────────────────────────
// Workplace supervisor writes or updates evaluation for a student
const upsertEvaluation = async (req, res, next) => {
  try {
    const { studentId, period, attendance, performance, skills, attitude, achievements, challenges, recommendation, comments, rating } = req.body;

    // Get student's academic supervisor so evaluation is routed correctly
    const studentProfile = await StudentProfile.findOne({ user: studentId });
    if (!studentProfile) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Make sure this workplace supervisor is actually assigned to this student
    if (
      studentProfile.workplaceSupervisor?.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this student.' });
    }

    const evalData = {
      workplaceSupervisor: req.user.id,
      student: studentId,
      academicSupervisor: studentProfile.academicSupervisor || null,
      period, attendance, performance, skills, attitude,
      achievements, challenges, recommendation, comments,
      rating: Number(rating),
    };

    // Upsert — create if doesn't exist, update if it does
    const evaluation = await SupervisorEvaluation.findOneAndUpdate(
      { workplaceSupervisor: req.user.id, student: studentId },
      evalData,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, evaluation });
  } catch (err) {
    next(err);
  }
};

// ── @GET /api/evaluations/my-interns ─────────────────────────────────────
// Workplace supervisor sees all evaluations they've written
const getMyEvaluations = async (req, res, next) => {
  try {
    const evaluations = await SupervisorEvaluation.find({ workplaceSupervisor: req.user.id })
      .populate('student', 'name email')
      .sort('-updatedAt');

    res.status(200).json({ success: true, evaluations });
  } catch (err) {
    next(err);
  }
};

// ── @GET /api/evaluations/student/:studentId ──────────────────────────────
// Student views their own evaluation (for download)
// Academic supervisor views evaluation for their student
const getStudentEvaluation = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const evaluation = await SupervisorEvaluation.findOne({ student: studentId })
      .populate('workplaceSupervisor', 'name email')
      .populate('student', 'name email');

    if (!evaluation) {
      return res.status(404).json({ success: false, message: 'No evaluation found for this student.' });
    }

    // Access control:
    // - Student can only see their own evaluation
    // - Academic supervisor can only see evaluations of their assigned students
    const isOwner = req.user.id === studentId;
    const isAcademicSupervisor = req.user.role === 'academic-supervisor' &&
      evaluation.academicSupervisor?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isWorkplaceSupervisor = req.user.role === 'workplace-supervisor' &&
      evaluation.workplaceSupervisor._id.toString() === req.user.id;

    if (!isOwner && !isAcademicSupervisor && !isAdmin && !isWorkplaceSupervisor) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.status(200).json({ success: true, evaluation });
  } catch (err) {
    next(err);
  }
};

// ── @GET /api/evaluations/supervisor-students ─────────────────────────────
// Academic supervisor gets evaluations for ALL their assigned students
const getSupervisorStudentEvaluations = async (req, res, next) => {
  try {
    const evaluations = await SupervisorEvaluation.find({ academicSupervisor: req.user.id })
      .populate('student', 'name email')
      .populate('workplaceSupervisor', 'name email')
      .sort('-updatedAt');

    res.status(200).json({ success: true, evaluations });
  } catch (err) {
    next(err);
  }
};

module.exports = { upsertEvaluation, getMyEvaluations, getStudentEvaluation, getSupervisorStudentEvaluations };
