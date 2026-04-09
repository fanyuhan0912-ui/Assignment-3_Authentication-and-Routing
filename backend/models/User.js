// Schema for application users
// Stores login credentials, profile info, role, and saved pets
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
  // Controls access level for regular users and admins
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  // Optional profile information shown in the user interface
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
  // Stores pets that the user has saved or favorited
  savedPets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
