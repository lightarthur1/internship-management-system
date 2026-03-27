const Opportunity = require("../models/Opportunity");

async function listOpportunities(req, res) {
  try {
    const { active } = req.query;
    const filter = {};
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;

    const items = await Opportunity.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({ opportunities: items });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to load opportunities", error: error.message });
  }
}

async function createOpportunity(req, res) {
  try {
    const { company, logo, location, description, positions, duration, isActive } =
      req.body || {};

    if (!company || !location || !description || !positions || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const opp = await Opportunity.create({
      company,
      logo: logo || null,
      location,
      description,
      positions: Number(positions),
      duration,
      isActive: typeof isActive === "boolean" ? isActive : true,
      createdBy: req.user?.sub || null,
    });

    return res.status(201).json({ opportunity: opp });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create opportunity", error: error.message });
  }
}

async function updateOpportunity(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    const allowed = [
      "company",
      "logo",
      "location",
      "description",
      "positions",
      "duration",
      "isActive",
    ];

    const set = {};
    for (const key of allowed) {
      if (typeof updates[key] !== "undefined") {
        set[key] = key === "positions" ? Number(updates[key]) : updates[key];
      }
    }

    const opp = await Opportunity.findByIdAndUpdate(id, { $set: set }, { new: true });
    if (!opp) return res.status(404).json({ message: "Opportunity not found" });
    return res.status(200).json({ opportunity: opp });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update opportunity", error: error.message });
  }
}

async function deleteOpportunity(req, res) {
  try {
    const { id } = req.params;
    const opp = await Opportunity.findByIdAndDelete(id);
    if (!opp) return res.status(404).json({ message: "Opportunity not found" });
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete opportunity", error: error.message });
  }
}

module.exports = {
  listOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};

