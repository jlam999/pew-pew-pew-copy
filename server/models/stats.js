const mongoose = require("mongoose");

const StatsSchema = new mongoose.Schema({
  googleid: String,
  wins: Number,
  games: Number,
  kills: Number,
});

module.exports = mongoose.model("Stats", StatsSchema);
