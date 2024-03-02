const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    min: [4, "A username must be at least 4 characters"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    min: [6, "A password must be at least 6 characters"],
    trim: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    required: true,
    min: [1, "A name must be at least 1 character"],
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    trim: true,
    lowercase: true,
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = { User };
