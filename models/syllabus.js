const mongoose = require("mongoose");

const syllabusSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  unit: { type: String, required: true },
  year: { type: Number, required: true },
  branch: { type: String, required: true },
  department: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Syllabus", syllabusSchema);