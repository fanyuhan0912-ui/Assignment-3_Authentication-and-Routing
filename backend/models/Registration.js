const mongoose = require("mongoose");

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
  { _id: false }
);

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    formType: {
      type: String,
      enum: ["adoption", "posting"],
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ["Waiting", "Approved"],
      default: "Waiting",
    },
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
  { timestamps: true }
);

module.exports = mongoose.model("Registration", registrationSchema);
