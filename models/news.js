const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  updatedOn: { type: Date, default: Date.now },
  imageUrl: { type: String }, // File path or URL to image
  imageName: { type: String } // Original filename
});

module.exports = mongoose.model("News", newsSchema);
