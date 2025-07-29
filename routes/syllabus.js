const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Syllabus = require("../models/syllabus");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, fileFilter: (req, file, cb) => {
  // Accept only PDF or DOC/DOCX
  if (!file.originalname.match(/\.(pdf|doc|docx)$/i)) {
    return cb(new Error("Only PDF and DOC/DOCX files are allowed!"), false);
  }
  cb(null, true);
}});

// Upload endpoint
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { subject, unit, year, branch, department } = req.body;
    if (!req.file) return res.status(400).send("No file uploaded");

    const syllabus = new Syllabus({
      subject,
      unit,
      year,
      branch,
      department,
      fileName: req.file.originalname,
      filePath: req.file.path
    });
    await syllabus.save();
    res.send("✅ Syllabus uploaded");
  } catch (err) {
    res.status(500).send("❌ Error uploading syllabus");
  }
});

// Get syllabi with optional filters: year, branch, subject
// Get syllabi with optional filters: year, branch, department, subject
router.get("/", async (req, res) => {
  try {
    const { year, branch, department, subject } = req.query;
    let match = {};
    if (year) match.year = Number(year);
    if (branch) match.branch = branch;
    if (department) match.department = department;
    if (subject) match.subject = subject;

    // If any filter is provided, return grouped, else return flat list
    const anyFilter = year || branch || department || subject;
    if (anyFilter) {
      const grouped = await Syllabus.aggregate([
        { $match: match },
        { $sort: { year: 1, unit: 1 } },
        {
          $group: {
            _id: { branch: "$branch", subject: "$subject" },
            syllabi: { $push: "$$ROOT" }
          }
        },
        { $sort: { "_id.branch": 1, "_id.subject": 1 } }
      ]);
      res.json(grouped);
    } else {
      const syllabi = await Syllabus.find().sort({ year: 1, unit: 1 });
      res.json(syllabi);
    }
  } catch (err) {
    res.status(500).send("❌ Error fetching syllabi");
  }
});



module.exports = router;

// Edit (update) a syllabus by ID
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    let updateData = { ...req.body };
    // If a new file is uploaded, update fileName and filePath
    if (req.file) {
      updateData.fileName = req.file.originalname;
      updateData.filePath = req.file.path;
    }
    const updatedSyllabus = await Syllabus.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedSyllabus) {
      return res.status(404).send('❌ Syllabus not found');
    }
    res.send('✅ Syllabus updated');
  } catch (err) {
    res.status(500).send('❌ Error updating syllabus');
  }
});

// Delete a syllabus by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedSyllabus = await Syllabus.findByIdAndDelete(req.params.id);
    if (!deletedSyllabus) {
      return res.status(404).send('❌ Syllabus not found');
    }
    res.send('✅ Syllabus deleted');
  } catch (err) {
    res.status(500).send('❌ Error deleting syllabus');
  }
});