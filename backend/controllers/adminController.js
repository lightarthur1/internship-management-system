const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Opportunity = require('../models/Opportunity');
const InternshipLetter = require('../models/InternshipLetter');

// ── OPPORTUNITIES ──────────────────────────────────────────────────────────

// @GET /api/admin/opportunities
const getOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find()
    .select('-logo')
    .sort('-createdAt');
    res.status(200).json({ success: true, count: opportunities.length, opportunities });
  } catch (err) { next(err); }
};

// @POST /api/admin/opportunities
const createOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.create({ ...req.body, addedBy: req.user.id });
    res.status(201).json({ success: true, opportunity });
  } catch (err) { next(err); }
};

// @PUT /api/admin/opportunities/:id
const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });
    if (!opportunity) return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    res.status(200).json({ success: true, opportunity });
  } catch (err) { next(err); }
};

// @DELETE /api/admin/opportunities/:id
const deleteOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(req.params.id, { isActive: false }, {
      returnDocument: 'after',
    });
    if (!opportunity) return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    res.status(200).json({ success: true, message: 'Opportunity deactivated.' });
  } catch (err) { next(err); }
};

// ── ASSIGN ACADEMIC SUPERVISOR ─────────────────────────────────────────────

// @PUT /api/admin/assign-supervisor
// Admin assigns an academic supervisor to a student
const assignSupervisor = async (req, res, next) => {
  try {
    const { studentUserId, supervisorUserId } = req.body;

    const supervisor = await User.findOne({ _id: supervisorUserId, role: 'academic-supervisor' });
    if (!supervisor) return res.status(404).json({ success: false, message: 'Academic supervisor not found.' });

    const profile = await StudentProfile.findOneAndUpdate(
      { user: studentUserId },
      { academicSupervisor: supervisorUserId },
      { returnDocument: 'after' }
    ).populate('user', 'name email').populate('academicSupervisor', 'name email');

    if (!profile) return res.status(404).json({ success: false, message: 'Student profile not found.' });

    res.status(200).json({ success: true, message: 'Supervisor assigned successfully.', profile });
  } catch (err) { next(err); }
};

// ── USERS ──────────────────────────────────────────────────────────────────

// @GET /api/admin/students
const getAllStudents = async (req, res, next) => {
  try {
    const profiles = await StudentProfile.find()
      .populate('user', 'name email createdAt')
      .populate('academicSupervisor', 'name email')
      .populate('workplaceSupervisor', 'name email')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: profiles.length, students: profiles });
  } catch (err) { next(err); }
};

// @GET /api/admin/supervisors
const getAllSupervisors = async (req, res, next) => {
  try {
    const { role } = req.query; // ?role=academic-supervisor
    const filter = role ? { role } : { role: { $in: ['academic-supervisor', 'workplace-supervisor'] } };

    const supervisors = await User.find(filter).select('name email role isActive createdAt');
    res.status(200).json({ success: true, count: supervisors.length, supervisors });
  } catch (err) { next(err); }
};

// ── DASHBOARD STATS ────────────────────────────────────────────────────────

// @GET /api/admin/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      activeStudents,
      totalOpportunities,
      pendingLetters,
      academicSupervisors,
      workplaceSupervisors,
    ] = await Promise.all([
      StudentProfile.countDocuments(),
      StudentProfile.countDocuments({ internshipStarted: true }),
      Opportunity.countDocuments({ isActive: true }),
      InternshipLetter.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'academic-supervisor' }),
      User.countDocuments({ role: 'workplace-supervisor' }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        totalOpportunities,
        pendingLetters,
        academicSupervisors,
        workplaceSupervisors,
      },
    });
  } catch (err) { next(err); }
};

module.exports = {
  getOpportunities, createOpportunity, updateOpportunity, deleteOpportunity,
  assignSupervisor,
  getAllStudents, getAllSupervisors,
  getDashboardStats,
};
