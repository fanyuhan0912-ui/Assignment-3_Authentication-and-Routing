const express = require("express");
const Registration = require("../models/Registration");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

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

router.post("/", async (req, res) => {
  try {
    const registration = await Registration.create({
      ...req.body,
      user: req.user._id,
    });

    const populatedRegistration = await Registration.findById(registration._id).populate(
      "petId"
    );

    res.status(201).json(populatedRegistration);
  } catch (error) {
    res.status(400).json({ message: "Unable to save registration form" });
  }
});

module.exports = router;
