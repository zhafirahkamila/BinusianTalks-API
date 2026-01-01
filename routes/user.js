const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// GET PROFILE
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "email username bio profileImage"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT PROFILE
router.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      console.log("REQ FILE:", req.file);
      console.log("FILENAME:", req.file?.filename);
      const { username, bio, password } = req.body;

      const updateData = {
        username,
        bio,
      };

      if (password) {
        const hashedPass = await bcrypt.hash(password, 10);
        updateData.password = hashedPass;
      }

      if (req.file) {
        updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
      }

      const updateUser = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
      }).select("email username bio profileImage");
      res.json({ message: "Profile updated", updateUser });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
