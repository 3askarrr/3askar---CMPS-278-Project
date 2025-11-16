const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  email: { type: String },
  name: { type: String },
  picture: { type: String },
  storageUsed: {type: Number, default: 0,}, // later used by calling updateStorage(userId, file.length, "add" or "remove")
  storageLimit: {
    type: Number,
    default: 15 * 1024 * 1024 * 1024, // 15GB default quota
  },
});

module.exports = mongoose.model("User", userSchema);




