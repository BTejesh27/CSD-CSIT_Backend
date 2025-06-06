require('dotenv').config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const newsRoutes = require("./routes/news");
const eventRoutes = require("./routes/events");
const facultyRoutes = require("./routes/faculty");
const placementRoutes = require("./routes/placements");
const internshipRoutes = require("./routes/internships");

const app = express();
app.use(cors());
// Increase JSON body size limit to 10mb (adjust as needed)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB Error:", err));

app.use("/news", newsRoutes);
app.use("/events", eventRoutes);
app.use("/faculty", facultyRoutes);
app.use("/placements", placementRoutes);
app.use("/internships", internshipRoutes);

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});