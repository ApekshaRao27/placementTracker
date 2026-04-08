const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  name: String, // Aptitude, Coding, Technical, HR
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  cleared: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  rejected: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const placementDriveSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  date: { type: Date, required: true },
  eligibility: String,
  rounds: [roundSchema]
});

module.exports = mongoose.model("PlacementDrive", placementDriveSchema);