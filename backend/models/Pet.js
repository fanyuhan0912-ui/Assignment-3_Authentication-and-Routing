// Schema for pets displayed in the adoption system
// Stores pet details, availability status, contact info, image, and location
const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    // Basic pet information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: String,
      required: true,
      trim: true,
    },
    breed: {
      type: String,
      default: "",
      trim: true,
    },
    size: {
      type: String,
      default: "",
      trim: true,
    },
    vaccinated: {
      type: Boolean,
      default: false,
    },
    // Tracks whether the pet is still open for adoption
    status: {
      type: String,
      enum: ["Available", "Pending", "Adopted"],
      default: "Available",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    // Location data used for displaying the pet's area or map position
    location: {
      address: {
        type: String,
        default: "",
        trim: true,
      },
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },
    // User who created the pet posting; null for seeded/default pets
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  // adds createdAt and updatedAt fields
  { timestamps: true }
);

module.exports = mongoose.model("Pet", petSchema);
