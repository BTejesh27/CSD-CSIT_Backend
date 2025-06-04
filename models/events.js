const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  updatedOn: { type: Date, default: Date.now },
  imagePath: { type: String }
});

module.exports = mongoose.model("Event", eventsSchema);
