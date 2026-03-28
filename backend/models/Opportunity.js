const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    // Added by admin
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyEmoji: {
      type: String,
      default: '🏢',
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    positions: {
      type: Number,
      default: 1,
    },
    duration: {
      type: String, // e.g. "3 months", "6 months"
      required: true,
    },
    roles: [String], // e.g. ["Software Eng", "Frontend Dev"]
    skills: [String], // e.g. ["React", "Node.js"]
    stipend: String, // e.g. "₦150k/mo"
    deadline: Date,
    type: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      default: 'On-site',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);
