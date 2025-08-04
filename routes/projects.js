const express = require("express");
const router = express.Router();
const Project = require("../models/projects");

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ year: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).send("❌ Error fetching projects");
  }
});

// Add a project
router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.send("✅ Project saved");
  } catch (err) {
    res.status(500).send("❌ Error saving project");
  }
});

// Edit (update) a project by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProject) {
      return res.status(404).send("❌ Project not found");
    }
    res.send("✅ Project updated");
  } catch (err) {
    res.status(500).send("❌ Error updating project");
  }
});

// Delete a project by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).send("❌ Project not found");
    }
    res.send("✅ Project deleted");
  } catch (err) {
    res.status(500).send("❌ Error deleting project");
  }
});

module.exports = router;
