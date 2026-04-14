// backend/routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware"); // We can create a verifyStudent middleware later
const PlacementDrive = require("../models/PlacementDrive");
const Student = require("../models/User");
const Notification = require("../models/Notification");
router.get("/drives", verifyToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    // 1. Fetch the Student data AND the Drives data at the same time
    const [student, drives] = await Promise.all([
      Student.findById(studentId).select("cgpa name"), // Fetch only needed fields
      PlacementDrive.find()
        .populate("rounds.attendees", "name email")
        .populate("rounds.cleared", "name email")
        .populate("rounds.rejected", "name email")
    ]);

    // 2. Your existing logic to map through drives
    const result = drives.map(drive => {
      let applied = false;
      let currentRound = null;
      let status = "Not Applied";

      drive.rounds.forEach((round, index) => {
        // Use s._id to check since it's populated as an object
        if (round.attendees.some(s => s._id.toString() === studentId)) {
          applied = true;
          currentRound = round.name;
          status = "In Progress";
        }
        if (round.cleared.some(s => s._id.toString() === studentId)) {
          applied = true;
          currentRound = drive.rounds[index + 1]?.name || "Completed";
          status = "Cleared";
        }
        if (round.rejected.some(s => s._id.toString() === studentId)) {
          applied = true;
          currentRound = round.name;
          status = "Rejected";
        }
      });

      return {
        _id: drive._id,
        companyName: drive.companyName,
        role: drive.role,
        date: drive.date,
        eligibility: drive.eligibility, // The threshold number
        applied,
        currentRound,
        status
      };
    });

    // 3. CHANGE: Return an object, not just the array
    res.json({
      studentCgpa: student?.cgpa || 0,
      studentName: student?.name || "Student",
      drives: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/apply/:driveId", verifyToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    // Fetch student profile (to get CGPA) and the drive (to get required CGPA)
    const [student, drive] = await Promise.all([
      Student.findById(studentId),
      PlacementDrive.findById(req.params.driveId)
    ]);

    if (!drive) return res.status(404).json({ msg: "Drive not found" });

    // ELIGIBILITY CHECK: Compare numerical CGPA
    if (student.cgpa < drive.eligibility) {
      return res.status(403).json({ 
        msg: `Eligibility failed. Required: ${drive.eligibility}, Your CGPA: ${student.cgpa}` 
      });
    }

    if (drive.rounds[0].attendees.includes(studentId)) {
      return res.status(400).json({ msg: "Already applied" });
    }

    drive.rounds[0].attendees.push(studentId);
    await drive.save();

    res.json({ msg: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/notifications", verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ student: req.user.id })
      .sort({ createdAt: -1 }); // Newest first
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
