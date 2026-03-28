const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// ── @GET /api/student/profile ─────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user.id })
      .populate('user', 'name email')
      .populate('academicSupervisor', 'name email')
      .populate('workplaceSupervisor', 'name email')
      .populate('chosenOpportunity');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// ── @PUT /api/student/profile ─────────────────────────────────────────────
// Called from the Profile Wizard (steps 1 & 2) and Edit button
const updateProfile = async (req, res, next) => {
  try {
    const { studentId, department, level, phone, location, academicSupervisorId } = req.body;

    const updateData = {
      ...(studentId   && { studentId }),
      ...(department  && { department }),
      ...(level       && { level }),
      ...(phone       && { phone }),
      ...(location    && { location }),
    };

    // Validate and assign academic supervisor if provided
    if (academicSupervisorId) {
      const supervisor = await User.findOne({ _id: academicSupervisorId, role: 'academic-supervisor' });
      if (!supervisor) {
        return res.status(400).json({ success: false, message: 'Academic supervisor not found.' });
      }
      updateData.academicSupervisor = academicSupervisorId;
    }

    // Mark profile complete if all required fields are present
    if (studentId && department && level && phone && location) {
      updateData.isProfileComplete = true;
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('academicSupervisor', 'name email')
      .populate('workplaceSupervisor', 'name email');

    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// ── @POST /api/student/start-internship ───────────────────────────────────
// Student toggles "I've started my internship"
// Requires: workplaceSupervisorEmail, internshipStartDate, (optional) internshipEndDate
// This triggers an invite email to the workplace supervisor
const startInternship = async (req, res, next) => {
  try {
    const { workplaceSupervisorEmail, internshipStartDate, internshipEndDate } = req.body;

    if (!workplaceSupervisorEmail) {
      return res.status(400).json({ success: false, message: 'Workplace supervisor email is required.' });
    }

    const profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    if (!profile.academicSupervisor) {
      return res.status(400).json({ success: false, message: 'You must have an academic supervisor assigned before starting.' });
    }

    // Check if this workplace supervisor email already has an account
    let wsSupervisor = await User.findOne({ email: workplaceSupervisorEmail, role: 'workplace-supervisor' });

    if (!wsSupervisor) {
      // Create a placeholder account and send invite email
      const inviteToken = crypto.randomBytes(32).toString('hex');
      const inviteExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

      wsSupervisor = await User.create({
        name: 'Pending Supervisor',
        email: workplaceSupervisorEmail,
        password: crypto.randomBytes(16).toString('hex'), // temp password (overwritten on invite accept)
        role: 'workplace-supervisor',
        inviteToken,
        inviteTokenExpiry: inviteExpiry,
        isInviteAccepted: false,
      });

      // Send invite email
      const inviteUrl = `${process.env.CLIENT_URL}/accept-invite?token=${inviteToken}`;
      const studentUser = await User.findById(req.user.id);

      await sendEmail({
        to: workplaceSupervisorEmail,
        subject: 'You have been added as a Workplace Supervisor — IMS Portal',
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto">
            <h2 style="color:#0d3b2e">IMS Portal — Workplace Supervisor Invitation</h2>
            <p>Hello,</p>
            <p><strong>${studentUser.name}</strong> has listed you as their workplace supervisor on the IMS Portal.</p>
            <p>Please click the button below to set up your account and begin monitoring your intern(s).</p>
            <a href="${inviteUrl}" style="display:inline-block;padding:12px 24px;background:#15653a;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
              Accept Invitation & Set Up Account
            </a>
            <p style="color:#666;font-size:12px">This link expires in 7 days.</p>
          </div>
        `,
      });
    }

    // Link workplace supervisor to student's profile
    profile.workplaceSupervisor = wsSupervisor._id;
    profile.workplaceSupervisorEmail = workplaceSupervisorEmail;
    profile.internshipStarted = true;
    profile.internshipStartDate = internshipStartDate || new Date();
    if (internshipEndDate) profile.internshipEndDate = internshipEndDate;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Internship started. Supervisor invite sent.',
      profile,
    });
  } catch (err) {
    next(err);
  }
};

// ── @GET /api/student/academic-supervisors ────────────────────────────────
// Returns list of all academic supervisors for student dropdown selection
const getAcademicSupervisors = async (req, res, next) => {
  try {
    const supervisors = await User.find({ role: 'academic-supervisor', isActive: true })
      .select('name email');

    res.status(200).json({ success: true, supervisors });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, startInternship, getAcademicSupervisors };
