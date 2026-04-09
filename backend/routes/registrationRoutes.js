// Routes for authenticated users to view and submit their pet adoption registrations
const express = require("express");
const Registration = require("../models/Registration");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// Protect all registration routes so only logged-in users can access them
router.use(requireAuth);

// Get all registrations created by the current logged-in user
router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("petId");

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new registration form and link it to the current user
router.post("/", async (req, res) => {
  try {
    const registration = await Registration.create({
      ...req.body,
      user: req.user._id,
    });

    // Return the newly created registration with pet details populated
    const populatedRegistration = await Registration.findById(registration._id).populate(
      "petId"
    );

    res.status(201).json(populatedRegistration);
  } catch (error) {
    res.status(400).json({ message: "Unable to save registration form" });
  }
});

module.exports = router;
