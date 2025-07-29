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
    let placementData = { ...req.body };
    
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
      placementData.imageUrl = req.body.image; // Store Base64 as imageUrl
      placementData.imageName = req.body.imageName || 'uploaded-image';
      delete placementData.image; // Remove the image field
    }
    
    const placement = new Placement(placementData);
    await placement.save();
    res.send("✅ Placement saved");
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).send("❌ Error saving placement");
  }
});

// Bulk upload placements
router.post("/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).send("❌ Request body must be an array");
    }
    
    // Validate images in bulk data
    for (let i = 0; i < req.body.length; i++) {
      const placement = req.body[i];
      if (placement.image) {
        const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
        if (!base64Pattern.test(placement.image)) {
          return res.status(400).send(`❌ Invalid image format in item ${i + 1}. Only JPEG, PNG, GIF, and WebP are allowed`);
        }
        
        const imageSizeInBytes = (placement.image.length * 3) / 4;
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (imageSizeInBytes > maxSize) {
          return res.status(400).send(`❌ Image size too large in item ${i + 1}. Maximum 5MB allowed`);
        }
      }
    }
    
    await Placement.insertMany(req.body);
    res.send("✅ Placements bulk uploaded");
  } catch (err) {
    res.status(500).send("❌ Error in bulk upload");
  }
});

// Edit (update) a placement by ID
router.put("/:id", async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.body.image) {
      const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
      if (!base64Pattern.test(req.body.image)) {
        return res.status(400).send("❌ Invalid image format. Only JPEG, PNG, GIF, and WebP are allowed");
      }
      const imageSizeInBytes = (req.body.image.length * 3) / 4;
      const maxSize = 5 * 1024 * 1024;
      if (imageSizeInBytes > maxSize) {
        return res.status(400).send("❌ Image size too large. Maximum 5MB allowed");
      }
      updateData.imageUrl = req.body.image;
      updateData.imageName = req.body.imageName || 'uploaded-image';
      delete updateData.image;
    }
    const updatedPlacement = await Placement.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedPlacement) {
      return res.status(404).send("❌ Placement not found");
    }
    res.send("✅ Placement updated");
  } catch (err) {
    res.status(500).send("❌ Error updating placement");
  }
});

// Delete a placement by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedPlacement = await Placement.findByIdAndDelete(req.params.id);
    if (!deletedPlacement) {
      return res.status(404).send("❌ Placement not found");
    }
    res.send("✅ Placement deleted");
  } catch (err) {
    res.status(500).send("❌ Error deleting placement");
  }
});

module.exports = router;
