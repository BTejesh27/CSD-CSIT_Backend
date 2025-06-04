const mongoose = require("mongoose");

const internshipsSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  stipend: { type: Number }, // optional
  description: { type: String },
  imagePath: { type: String } // NEW field for image
});

module.exports = mongoose.model("Internship", internshipsSchema);
