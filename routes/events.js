const express = require("express");
const router = express.Router();
const Event = require("../models/events");

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).send("❌ Error fetching events");
  }
});

// Add an event
router.post("/", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.send("✅ Event saved");
  } catch (err) {
    res.status(500).send("❌ Error saving event");
  }
});

module.exports = router;
