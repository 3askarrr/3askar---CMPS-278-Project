const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  email: { type: String },
  name: { type: String },
  picture: { type: String }
});

module.exports = mongoose.model("User", userSchema);




