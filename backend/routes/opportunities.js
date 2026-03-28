const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const { protect, authorise } = require('../middleware/auth');

// GET /api/opportunities  — any logged-in user can browse
router.get('/', protect, async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({ isActive: true }).sort('-createdAt');
    res.status(200).json({ success: true, count: opportunities.length, opportunities });
  } catch (err) { next(err); }
});

// GET /api/opportunities/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity || !opportunity.isActive) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }
    res.status(200).json({ success: true, opportunity });
  } catch (err) { next(err); }
});

module.exports = router;
