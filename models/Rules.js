const mongoose = require("mongoose");

const RulesSchema = new mongoose.Schema({
  img: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true }
});

module.exports = mongoose.model("Rules", RulesSchema);