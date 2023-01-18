const mongoose = require("mongoose");

const StatsSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  wins: Number,
  games: Number,
});

module.exports = mongoose.model("stats", StatsSchema);
