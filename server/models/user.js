const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  picture: {
    type: String,
    default:
      "https://www.anitawatkins.com/wp-content/uploads/2016/02/Generic-Profile-1600x1600.png",
  }, //link to picture
});

module.exports = mongoose.model("user", UserSchema);
