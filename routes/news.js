const express = require("express");
const router = express.Router();
const News = require("../models/news");

// Get all news
router.get("/", async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (err) {
    res.status(500).send("❌ Error fetching news");
  }
});

// Add a news item
router.post("/", async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.send("✅ News saved");
  } catch (err) {
    res.status(500).send("❌ Error saving news");
  }
});

module.exports = router;
