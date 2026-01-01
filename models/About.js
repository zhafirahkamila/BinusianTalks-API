const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema({
  questionIndo: { type: String, required: true },
  questionEng: { type: String, required: true },
  answerIndo: { type: String, required: true },
  answerEng: { type: String, required: true }
});

module.exports = mongoose.model("About", AboutSchema, "about");