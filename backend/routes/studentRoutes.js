// backend/routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/authMiddleware"); // We can create a verifyStudent middleware later

// For now, use the same auth middleware but check for student role
router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({
    msg: "Welcome to Student Dashboard",
    placements: [
      "TCS - Placement Confirmed",
      "Infosys - Interview Scheduled"
    ]
  });
});

module.exports = router;
