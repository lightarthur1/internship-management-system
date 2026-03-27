const LetterRequest = require("../models/LetterRequest");
const Opportunity = require("../models/Opportunity");
const User = require("../models/User");

async function requestLetter(req, res) {
  try {
    const userId = req.user?.sub;
    const { opportunityId } = req.body || {};

    if (!opportunityId) {
      return res.status(400).json({ message: "opportunityId is required" });
    }

    const student = await User.findById(userId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) return res.status(404).json({ message: "Opportunity not found" });

    const existingPending = await LetterRequest.findOne({
      student: userId,
      opportunity: opportunityId,
      status: "pending",
    });
    if (existingPending) {
      return res.status(409).json({ message: "Letter request already pending for this opportunity" });
    }

    const request = await LetterRequest.create({
      student: userId,
      opportunity: opportunityId,
      company: opportunity.company,
      location: opportunity.location,
      status: "pending",
    });

    return res.status(201).json({ letter: request });
  } catch (error) {
    return res.status(500).json({ message: "Failed to request letter", error: error.message });
  }
}

async function getMyLetters(req, res) {
  try {
    const userId = req.user?.sub;
    const letters = await LetterRequest.find({ student: userId })
      .populate("opportunity", "company location duration")
      .sort({ createdAt: -1 });
    return res.status(200).json({ letters });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load letters", error: error.message });
  }
}

async function getAllLetters(req, res) {
  try {
    const letters = await LetterRequest.find({})
      .populate("student", "fullName email profile")
      .populate("opportunity", "company location")
      .sort({ createdAt: -1 });
    return res.status(200).json({ letters });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load letters", error: error.message });
  }
}

async function updateLetterStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body || {};
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const letter = await LetterRequest.findById(id);
    if (!letter) return res.status(404).json({ message: "Letter request not found" });

    letter.status = status;
    letter.reviewedBy = req.user?.sub || null;
    letter.reviewedAt = new Date();
    letter.rejectionReason = status === "rejected" ? rejectionReason || "" : "";
    await letter.save();

    return res.status(200).json({ letter });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update letter status", error: error.message });
  }
}

module.exports = {
  requestLetter,
  getMyLetters,
  getAllLetters,
  updateLetterStatus,
};

