const express = require("express");
const router = express.Router();
const News = require("../models/news");

// Get all news
router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).send("❌ Error fetching news");
  }
});

// Add a news item
router.post("/", async (req, res) => {
  try {
    let newsData = { ...req.body };
    
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
      newsData.imageUrl = req.body.image; // Store Base64 as imageUrl
      newsData.imageName = req.body.imageName || 'uploaded-image';
      delete newsData.image; // Remove the image field
    }
    
    const news = new News(newsData);
    await news.save();
    res.send("✅ News saved");
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).send("❌ Error saving news");
  }
});

// Bulk upload news
router.post("/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).send("❌ Request body must be an array");
    }
    
    // Validate images in bulk data
    for (let i = 0; i < req.body.length; i++) {
      const newsItem = req.body[i];
      if (newsItem.image) {
        const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
        if (!base64Pattern.test(newsItem.image)) {
          return res.status(400).send(`❌ Invalid image format in item ${i + 1}. Only JPEG, PNG, GIF, and WebP are allowed`);
        }
        
        const imageSizeInBytes = (newsItem.image.length * 3) / 4;
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (imageSizeInBytes > maxSize) {
          return res.status(400).send(`❌ Image size too large in item ${i + 1}. Maximum 5MB allowed`);
        }
      }
    }
    
    await News.insertMany(req.body);
    res.send("✅ News bulk uploaded");
  } catch (err) {
    res.status(500).send("❌ Error in bulk upload");
  }
});

// Edit (update) a news item by ID
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
    const updatedNews = await News.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedNews) {
      return res.status(404).send("❌ News item not found");
    }
    res.send("✅ News updated");
  } catch (err) {
    res.status(500).send("❌ Error updating news");
  }
});

// Delete a news item by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).send("❌ News item not found");
    }
    res.send("✅ News deleted");
  } catch (err) {
    res.status(500).send("❌ Error deleting news");
  }
});

module.exports = router;
