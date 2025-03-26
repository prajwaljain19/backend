const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,  
  age: Number,
  height: Number,
  weight: Number,
  goal: String,
  activityLevel: String,
  diettype: String,
});

module.exports = mongoose.model("User", UserSchema);
