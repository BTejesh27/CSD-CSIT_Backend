const express = require("express");
const router = express.Router();
const Faculty = require("../models/faculty");

// Get all faculty
router.get("/", async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (err) {
    res.status(500).send("❌ Error fetching faculty");
  }
});

// Add a faculty member
router.post("/", async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.send("✅ Faculty saved");
  } catch (err) {
    res.status(500).send("❌ Error saving faculty");
  }
});

// Bulk upload faculty
router.post("/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).send("❌ Request body must be an array");
    }
    await Faculty.insertMany(req.body);
    res.send("✅ Faculty bulk uploaded");
  } catch (err) {
    res.status(500).send("❌ Error in bulk upload");
  }
});

module.exports = router;
