const mongoose = require("mongoose");

const internshipsSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  stipend: { type: Number }, // optional
  description: { type: String },
  imageUrl: { type: String }, // File path or URL to image
  imageName: { type: String } // Original filename
});

module.exports = mongoose.model("Internship", internshipsSchema);
