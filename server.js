const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
require('dotenv').config();

const authRoutes = require('./routes/auth');
const dataRoutes = require("./routes/data");
const userRoutes = require("./routes/user");
const forumRoutes = require("./routes/forum")
const uploadImage = express.static("uploads")

const app = express();
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  // credentials: true
}));

app.use(express.json());

//Connect MongoDB Atlas
mongoose.connect(process.env.ATLAS_URI).then(() => console.log("MongoDB Connected")).catch(err => console.log(err))
app.use('/api/auth', authRoutes);
app.use("/api", dataRoutes);
app.use("/api/user", userRoutes)
app.use("/api/forum", forumRoutes)
app.use("/uploads", uploadImage);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Image size too large. Maximum allowed size is 2MB.",
      });
    }
  }

  if (err) {
    return res.status(400).json({
      message: err.message || "Upload failed",
    });
  }

  next();
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});