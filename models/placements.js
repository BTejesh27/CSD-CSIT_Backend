const mongoose = require("mongoose");

const placementsSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  year: { type: Number, required: true },
  package: { type: Number, required: true }, // salary/package offered
  description: { type: String },
  updatedOn: { type: Date, default: Date.now },
  imagePath: { type: String } // NEW field for image
});

module.exports = mongoose.model("Placement", placementsSchema);
