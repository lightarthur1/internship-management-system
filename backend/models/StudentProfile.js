const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // ── Academic Details (Wizard Step 1) ──
    studentId: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
    },
    level: {
      type: String,
    },

    // ── Contact Details (Wizard Step 2) ──
    phone: {
      type: String,
    },
    location: {
      type: String,
    },

    // ── Supervisor Assignment ──
    academicSupervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // ── Internship Company ──
    chosenOpportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      default: null,
    },
    companyName: String,
    companyLocation: String,

    // ── Workplace Supervisor ──
    workplaceSupervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    workplaceSupervisorEmail: String,

    // ── Internship Status ──
    internshipStarted: {
      type: Boolean,
      default: false,
    },
    internshipStartDate: Date,
    internshipEndDate: Date,

    // ── Profile completion ──
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentProfile', studentProfileSchema);