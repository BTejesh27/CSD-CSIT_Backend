const express = require("express");
const router = express.Router();
const Startup = require("../models/startups");

// Get all startups
router.get("/", async (req, res) => {
  try {
    const startups = await Startup.find().sort({ year: -1 });
    res.json(startups);
  } catch (err) {
    res.status(500).send("❌ Error fetching startups");
  }
});

// Add a startup
router.post("/", async (req, res) => {
  try {
    const startup = new Startup(req.body);
    await startup.save();
    res.send("✅ Startup saved");
  } catch (err) {
    res.status(500).send("❌ Error saving startup");
  }
});

// Edit (update) a startup by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedStartup = await Startup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStartup) {
      return res.status(404).send("❌ Startup not found");
    }
    res.send("✅ Startup updated");
  } catch (err) {
    res.status(500).send("❌ Error updating startup");
  }
});

// Delete a startup by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedStartup = await Startup.findByIdAndDelete(req.params.id);
    if (!deletedStartup) {
      return res.status(404).send("❌ Startup not found");
    }
    res.send("✅ Startup deleted");
  } catch (err) {
    res.status(500).send("❌ Error deleting startup");
  }
});

module.exports = router;
