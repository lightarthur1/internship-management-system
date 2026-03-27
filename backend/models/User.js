const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "academic-supervisor", "workplace-supervisor", "admin"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profile: {
      studentId: String,
      department: String,
      level: String,
      phone: String,
      stateOfOrigin: String,
      preferredAcademicSupervisorName: String,
      academicSupervisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      workplaceSupervisorName: String,
      workplaceSupervisorEmail: String,
      workplaceSupervisorPhone: String,
      companyName: String,
      workEmail: String,
      title: String,
      internshipStatus: {
        type: String,
        enum: ["not_started", "active", "completed"],
        default: "not_started",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
