const express = require("express");
const router = express.Router();
const Placement = require("../models/placements");

// Get all placements
router.get("/", async (req, res) => {
  try {
    const placements = await Placement.find();
    res.json(placements);
  } catch (err) {
    res.status(500).send("❌ Error fetching placements");
  }
});

// Add a placement
router.post("/", async (req, res) => {
  try {
    const placement = new Placement(req.body);
    await placement.save();
    res.send("✅ Placement saved");
  } catch (err) {
    res.status(500).send("❌ Error saving placement");
  }
});

// Bulk upload placements
router.post("/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).send("❌ Request body must be an array");
    }
    await Placement.insertMany(req.body);
    res.send("✅ Placements bulk uploaded");
  } catch (err) {
    res.status(500).send("❌ Error in bulk upload");
  }
});

module.exports = router;
