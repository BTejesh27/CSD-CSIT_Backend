const express = require("express");
const router = express.Router();
const Event = require("../models/events");

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 }); // -1 for descending order (most recent first)
    res.json(events);
  } catch (err) {
    res.status(500).send("❌ Error fetching events");
  }
});

// Add an event
router.post("/", async (req, res) => {
  try {
    let eventData = { ...req.body };
    
    // Handle image data if present
    if (req.body.image) {
      // Check if it's a valid base64 image
      const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
      if (!base64Pattern.test(req.body.image)) {
        return res.status(400).send("❌ Invalid image format. Only JPEG, PNG, GIF, and WebP are allowed");
      }
      
      // Check image size (limit to 5MB)
      const imageSizeInBytes = (req.body.image.length * 3) / 4;
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageSizeInBytes > maxSize) {
        return res.status(400).send("❌ Image size too large. Maximum 5MB allowed");
      }
      
      // Map image data to schema fields
      eventData.imageUrl = req.body.image; // Store Base64 as imageUrl
      eventData.imageName = req.body.imageName || 'uploaded-image';
      delete eventData.image; // Remove the image field
    }
    
    const event = new Event(eventData);
    await event.save();
    res.send("✅ Event saved");
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).send("❌ Error saving event");
  }
});

// Bulk upload events
router.post("/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).send("❌ Request body must be an array");
    }
    
    // Validate images in bulk data
    for (let i = 0; i < req.body.length; i++) {
      const event = req.body[i];
      if (event.image) {
        const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
        if (!base64Pattern.test(event.image)) {
          return res.status(400).send(`❌ Invalid image format in item ${i + 1}. Only JPEG, PNG, GIF, and WebP are allowed`);
        }
        
        const imageSizeInBytes = (event.image.length * 3) / 4;
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (imageSizeInBytes > maxSize) {
          return res.status(400).send(`❌ Image size too large in item ${i + 1}. Maximum 5MB allowed`);
        }
      }
    }
    
    await Event.insertMany(req.body);
    res.send("✅ Events bulk uploaded");
  } catch (err) {
    res.status(500).send("❌ Error in bulk upload");
  }
});

module.exports = router;
