const mongoose = require('mongoose');

// Workplace supervisor writes this about an intern
// Viewable by: the student (can download) + the academic supervisor
const supervisorEvaluationSchema = new mongoose.Schema(
  {
    workplaceSupervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    academicSupervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // populated from student's profile
    },

    // Report fields (from WorkplaceSupervisorDashboard)
    period: String,           // "February – March 2026"
    attendance: String,
    performance: String,
    skills: String,
    attitude: String,
    achievements: String,
    challenges: String,       // areas for improvement
    recommendation: String,
    comments: String,

    // Overall rating 1-5
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

// One evaluation per supervisor-student pair (can be updated)
supervisorEvaluationSchema.index({ workplaceSupervisor: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('SupervisorEvaluation', supervisorEvaluationSchema);
