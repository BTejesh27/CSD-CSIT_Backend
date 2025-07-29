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
    let facultyData = { ...req.body };
    
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
      facultyData.imageUrl = req.body.image; // Store Base64 as imageUrl
      facultyData.imageName = req.body.imageName || 'uploaded-image';
      delete facultyData.image; // Remove the image field
    }
    
    const faculty = new Faculty(facultyData);
    await faculty.save();
    res.send("✅ Faculty saved");
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).send("❌ Error saving faculty");
  }
});

// Bulk upload faculty
router.post("/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).send("❌ Request body must be an array");
    }
    
    // Validate images in bulk data
    for (let i = 0; i < req.body.length; i++) {
      const faculty = req.body[i];
      if (faculty.image) {
        const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
        if (!base64Pattern.test(faculty.image)) {
          return res.status(400).send(`❌ Invalid image format in item ${i + 1}. Only JPEG, PNG, GIF, and WebP are allowed`);
        }
        
        const imageSizeInBytes = (faculty.image.length * 3) / 4;
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (imageSizeInBytes > maxSize) {
          return res.status(400).send(`❌ Image size too large in item ${i + 1}. Maximum 5MB allowed`);
        }
      }
    }
    
    await Faculty.insertMany(req.body);
    res.send("✅ Faculty bulk uploaded");
  } catch (err) {
    res.status(500).send("❌ Error in bulk upload");
  }
});

// Edit (update) a faculty member by ID
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
    const updatedFaculty = await Faculty.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedFaculty) {
      return res.status(404).send("❌ Faculty not found");
    }
    res.send("✅ Faculty updated");
  } catch (err) {
    res.status(500).send("❌ Error updating faculty");
  }
});

// Delete a faculty member by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedFaculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!deletedFaculty) {
      return res.status(404).send("❌ Faculty not found");
    }
    res.send("✅ Faculty deleted");
  } catch (err) {
    res.status(500).send("❌ Error deleting faculty");
  }
});

module.exports = router;
