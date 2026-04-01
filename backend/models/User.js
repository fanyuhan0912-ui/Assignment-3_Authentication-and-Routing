const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    default: "",
    trim: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  signInDate: {
    type: Date,
    default: null,
  },
  savedPets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
