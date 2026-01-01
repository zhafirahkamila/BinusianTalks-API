const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, confirmPass } = req.body;

    console.log("REGISTER BODY:", req.body);

    // Validate email
    if (!email.endsWith("@binus.ac.id")) {
      return res.status(400).json({ message: "Email format not valid" });
    }

    // Strong password validation
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!strongPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain 8 characters, one uppercase, one lowercase, one number, and one special character",
      });
    }

    // Check Confirm Password
    if (password !== confirmPass) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hass password
    const hashedPass = await bcrypt.hash(password, 10);

    // Create User
    const user = new User({
      email,
      password: hashedPass,
    });

    await user.save();

    res.json({ message: "Registration successful" });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
module.exports = router;
