const mongoose = require("mongoose");

const letterRequestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity", required: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

letterRequestSchema.index({ student: 1, opportunity: 1, status: 1 });

module.exports = mongoose.model("LetterRequest", letterRequestSchema);

