const mongoose = require('mongoose');

// Student submits these to their academic supervisor
const internshipReportSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    academicSupervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    reportType: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly', 'incident', 'final'],
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Report content is required'],
    },
    weekNumber: Number, // optional, for weekly reports

    // ── Status lifecycle: pending → reviewed ──
    status: {
      type: String,
      enum: ['pending', 'reviewed'],
      default: 'pending',
    },

    // Academic supervisor feedback
    feedback: {
      type: String,
      default: '',
    },
    reviewedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('InternshipReport', internshipReportSchema);
