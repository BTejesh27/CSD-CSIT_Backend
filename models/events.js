const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    organizer: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String, // Base64 image data
      required: false,
    },
    imageName: {
      type: String, // Original filename
      required: false,
    },
    updatedOn: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Event", eventSchema);
