const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  mail: { type: String },
  number: { type: String},
  location: { type: String }, // plain text
  qualifications: [{ type: String }], // list of qualifications like ["B.Tech", "M.Tech"]
  subjects: [{ type: String }], // list of subjects like ["C", "Python", "Java"]
  imagePath: { type: String } // NEW field for image

});

module.exports = mongoose.model("Faculty", facultySchema);
