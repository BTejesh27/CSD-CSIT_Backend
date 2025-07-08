const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  mail: { type: String },
  number: { type: String},
  location: { type: String }, // plain text
  qualifications: [{ type: String }], // list of qualifications like ["B.Tech", "M.Tech"]
  subjects: [{ type: String }], // list of subjects like ["C", "Python", "Java"]
  imageUrl: { type: String }, // File path or URL to image
  imageName: { type: String } // Original filename
});

module.exports = mongoose.model("Faculty", facultySchema);
