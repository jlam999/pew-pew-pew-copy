const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  picture: String,//link to picture
});

module.exports = mongoose.model("user", UserSchema);
