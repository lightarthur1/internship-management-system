const mongoose = require("mongoose");

const workplaceReportSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workplaceSupervisor: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, default: "" },
    },
    period: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    summary: { type: String, required: true, trim: true },
    recommendation: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkplaceReport", workplaceReportSchema);

