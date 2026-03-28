const InternshipLetter = require('../models/InternshipLetter');
const StudentProfile = require('../models/StudentProfile');
const Opportunity = require('../models/Opportunity');

// ── @POST /api/letters/request ────────────────────────────────────────────
// Student requests an internship letter for a chosen opportunity
const requestLetter = async (req, res, next) => {
  try {
    const { opportunityId } = req.body;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity || !opportunity.isActive) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile || !profile.isProfileComplete) {
      return res.status(400).json({ success: false, message: 'Please complete your profile first.' });
    }

    // Check for existing PENDING or APPROVED request — block duplicate
    // But allow re-request if previous was REJECTED
     const existing = await InternshipLetter.findOne({
      student: req.user.id,
      opportunity: opportunityId,
      status: { $in: ['pending', 'approved'] },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have an active request for this opportunity.' });
    }

    const letter = await InternshipLetter.create({
      student: req.user.id,
      studentProfile: profile._id,
      opportunity: opportunityId,
      status: 'pending',
    });

    // Update student profile with chosen company
    profile.chosenOpportunity = opportunityId;
    profile.companyName = opportunity.companyName;
    profile.companyLocation = opportunity.location;
    await profile.save();

    res.status(201).json({ success: true, letter });
  } catch (err) {
    next(err);
  }
};

// ── @GET /api/letters/my ──────────────────────────────────────────────────
// Student sees their own letter request(s)
const getMyLetters = async (req, res, next) => {
  try {
    const letters = await InternshipLetter.find({ student: req.user.id })
      .populate('opportunity')
      .sort('-createdAt');

    res.status(200).json({ success: true, letters });
  } catch (err) {
    next(err);
  }
};

// ── @GET /api/letters (admin) ─────────────────────────────────────────────
// Admin sees all letter requests with optional filter
const getAllLetters = async (req, res, next) => {
  try {
    const { status } = req.query; // ?status=pending
    const filter = status ? { status } : {};

    const letters = await InternshipLetter.find(filter)
      .populate('student', 'name email')
      .populate({ path: 'studentProfile', select: 'studentId department level' })
      .populate('opportunity', 'companyName location duration')
      .populate('reviewedBy', 'name')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: letters.length, letters });
  } catch (err) {
    next(err);
  }
};

// ── @PUT /api/letters/:id/approve (admin) ─────────────────────────────────
const approveLetter = async (req, res, next) => {
  try {
    const { adminNote } = req.body || {};
 
    const letter = await InternshipLetter.findById(req.params.id);
    if (!letter) {
      return res.status(404).json({ success: false, message: 'Letter not found.' });
    }
 
    letter.status     = 'approved';
    letter.adminNote  = adminNote || '';
    letter.reviewedBy = req.user.id;
    letter.reviewedAt = new Date();
    await letter.save();
 
    res.status(200).json({ success: true, message: 'Letter approved.', letter });
  } catch (err) {
    next(err);
  }
};

// ── @PUT /api/letters/:id/reject (admin) ──────────────────────────────────
const rejectLetter = async (req, res, next) => {
  try {
    const { adminNote } = req.body || {};
 
    const letter = await InternshipLetter.findById(req.params.id);
    if (!letter) {
      return res.status(404).json({ success: false, message: 'Letter not found.' });
    }
 
    letter.status     = 'rejected';
    letter.adminNote  = adminNote || 'Your letter request was not approved.';
    letter.reviewedBy = req.user.id;
    letter.reviewedAt = new Date();
    await letter.save();
 
    res.status(200).json({ success: true, message: 'Letter rejected.', letter });
  } catch (err) {
    next(err);
  }
};

// ── @GET /api/letters/:id/download ────────────────────────────────────────
// Student downloads their approved letter
// Returns letter data for frontend to render as PDF/HTML
const downloadLetter = async (req, res, next) => {
  try {
    const letter = await InternshipLetter.findById(req.params.id)
      .populate('student', 'name email')
      .populate({
        path: 'studentProfile',
        populate: { path: 'academicSupervisor', select: 'name email' },
      })
      .populate('opportunity');
 
    if (!letter) {
      return res.status(404).json({ success: false, message: 'Letter not found.' });
    }
 
    if (
      letter.student._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
 
    if (letter.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Letter has not been approved yet.' });
    }
 
    letter.downloadedAt = new Date();
    await letter.save();
 
    res.status(200).json({ success: true, letter });
  } catch (err) {
    next(err);
  }
};
 
module.exports = {
  requestLetter,
  getMyLetters,
  getAllLetters,
  approveLetter,
  rejectLetter,
  downloadLetter,
};