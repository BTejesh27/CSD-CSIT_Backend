const express = require("express");
const router = express.Router();
const Internship = require("../models/internships");

// Get all internships
router.get("/", async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (err) {
    res.status(500).send("❌ Error fetching internships");
  }
});

// Add an internship
router.post("/", async (req, res) => {
  try {
    const internship = new Internship(req.body);
    await internship.save();
    res.send("✅ Internship saved");
  } catch (err) {
    res.status(500).send("❌ Error saving internship");
  }
});

// Bulk upload internships
router.post("/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).send("❌ Request body must be an array");
    }
    await Internship.insertMany(req.body);
    res.send("✅ Internships bulk uploaded");
  } catch (err) {
    res.status(500).send("❌ Error in bulk upload");
  }
});

module.exports = router;
