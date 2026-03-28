const mongoose = require('mongoose');

const internshipLetterSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile',
      required: true,
    },
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: true,
    },

    // ── Status lifecycle: pending → approved | rejected ──
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    // Admin notes (optional rejection reason or note)
    adminNote: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: Date,

    // Track if student has downloaded the letter
    downloadedAt: Date,
  },
  { timestamps: true }
);

// Prevent a student from requesting two letters for the same opportunity
internshipLetterSchema.index({ student: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model('InternshipLetter', internshipLetterSchema);
