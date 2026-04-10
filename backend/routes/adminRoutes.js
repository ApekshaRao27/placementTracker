const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/authMiddleware");
const PlacementDrive = require("../models/PlacementDrive");

// Create a new placement drive
router.post("/drives", verifyAdmin, async (req, res) => {
  try {
    const drive = new PlacementDrive(req.body);
    await drive.save();
    res.status(201).json(drive);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all drives
router.get("/drives", verifyAdmin, async (req, res) => {
  try {
    const drives = await PlacementDrive.find();
    res.json(drives);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a specific round
router.put("/drives/:id/rounds/:roundIndex", verifyAdmin, async (req, res) => {
  try {
    const { id, roundIndex } = req.params;
    const { attendees, cleared, rejected } = req.body;

    const drive = await PlacementDrive.findById(id);
    if (!drive) return res.status(404).json({ msg: "Drive not found" });

    if (!drive.rounds[roundIndex]) {
      return res.status(400).json({ msg: "Round not found" });
    }

    if (attendees) drive.rounds[roundIndex].attendees = attendees;
    if (cleared) drive.rounds[roundIndex].cleared = cleared;
    if (rejected) drive.rounds[roundIndex].rejected = rejected;

    await drive.save();
    res.json(drive);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats
router.get("/dashboard", verifyAdmin, async (req, res) => {
  try {
    const drives = await PlacementDrive.find();
    let stats = {
      totalApplied: 0,
      attendedRound1: 0,
      clearedRound1: 0,
      clearedRound2: 0,
      finalSelected: 0
    };

    drives.forEach(drive => {
      if (drive.rounds[0]) {
        stats.attendedRound1 += drive.rounds[0].attendees.length;
        stats.clearedRound1 += drive.rounds[0].cleared.length;
        stats.totalApplied += drive.rounds[0].attendees.length;
      }
      if (drive.rounds[1]) {
        stats.clearedRound2 += drive.rounds[1].cleared.length;
      }
      if (drive.rounds[drive.rounds.length - 1]) {
        stats.finalSelected += drive.rounds[drive.rounds.length - 1].cleared.length;
      }
    });

    res.json({ msg: "Welcome Admin Dashboard", stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single drive with full student details
router.get("/drives/:id", verifyAdmin, async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id)
      // This is the "magic" that fetches the student names and emails
      .populate("rounds.attendees", "name email")
      .populate("rounds.cleared", "name email")
      .populate("rounds.rejected", "name email");

    if (!drive) {
      return res.status(404).json({ msg: "Placement drive not found" });
    }

    res.json(drive);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: "Invalid Drive ID format" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
