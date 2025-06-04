const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  updatedOn: { type: Date, default: Date.now },
  imagePath: { type: String } // store image path, not the image itself
});

module.exports = mongoose.model("News", newsSchema);
