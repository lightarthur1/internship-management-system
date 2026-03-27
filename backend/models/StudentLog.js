const mongoose = require("mongoose");

const studentLogSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    periodType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },
    content: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
    feedback: { type: String, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentLog", studentLogSchema);

