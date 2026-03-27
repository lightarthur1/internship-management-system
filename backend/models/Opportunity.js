const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    logo: { type: String, default: null }, // data URL for now
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    positions: { type: Number, required: true, min: 1 },
    duration: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);

