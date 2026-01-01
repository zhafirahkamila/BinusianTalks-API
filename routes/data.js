const express = require("express");
const router = express.Router();
const Rules = require("../models/Rules");
const About = require("../models/About");
const authMiddleware = require("../middleware/authMiddleware");

// GET all Rules
router.get("/rules", async (req, res) => {
  try {
    const rules = await Rules.find({});
    res.json(rules);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// GET all About
router.get("/about", async (req, res) => {
  try {
    const about = await About.find({});
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;