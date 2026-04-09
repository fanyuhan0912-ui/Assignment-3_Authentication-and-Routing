// Registration schema for pet adoption registrations
// Stores applicant info, selected pet info, uploaded files, and review status.
const mongoose = require("mongoose");

// Subdocument schema for uploaded files in a registration form
const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      default: "",
      trim: true,
    },
    mimeType: {
      type: String,
      default: "",
      trim: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    dataUrl: {
      type: String,
      default: "",
    },
  },
  // Prevent Mongoose from creating a separate _id for each uploaded file object
  { _id: false }
);

// Main schema for adoption and pet posting registration forms
const registrationSchema = new mongoose.Schema(
  {
    // Reference to the user who submitted the registration
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Distinguishes between adoption requests and pet posting forms
    formType: {
      type: String,
      enum: ["adoption", "posting"],
      required: true,
    },
    // Tracks the admin review result for the submitted form
    approvalStatus: {
      type: String,
      enum: ["Waiting", "Approved"],
      default: "Waiting",
    },
    // Applicant contact information
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    homeAddress: {
      type: String,
      required: true,
      trim: true,
    },
    // Linked pet for adoption forms; null if the form is for pet posting
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      default: null,
    },
    petName: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    // Uploaded supporting files
    idDocument: {
      type: fileSchema,
      default: () => ({}),
    },
    proofOfFunds: {
      type: fileSchema,
      default: () => ({}),
    },
    petImage: {
      type: fileSchema,
      default: () => ({}),
    },
    // Pet details used mainly for pet posting forms
    petType: {
      type: String,
      default: "",
      trim: true,
    },
    petBreed: {
      type: String,
      default: "",
      trim: true,
    },
    petAge: {
      type: String,
      default: "",
      trim: true,
    },
    petWeight: {
      type: String,
      default: "",
      trim: true,
    },
    vaccinated: {
      type: String,
      default: "",
      trim: true,
    },
    petHealthCondition: {
      type: String,
      default: "",
      trim: true,
    },
  },
  // Automatically adds createdAt and updatedAt fields
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
