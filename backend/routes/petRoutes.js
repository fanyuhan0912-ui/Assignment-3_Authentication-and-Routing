// Routes for viewing, creating, and deleting pet postings
const express = require("express");
const Pet = require("../models/Pet");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

// Get public pets (only available ones) sorted by newest first
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find({ status: "Available" }).sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new pet posting for the currently logged-in user
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, category, age, description, image, phoneNumber } = req.body;

    const pet = await Pet.create({
      name,
      category,
      age,
      description,
      phoneNumber,
      image,
      createdBy: req.user.userId,
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single pet by id
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a pet only if it belongs to the current logged-in user
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedPet = await Pet.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!deletedPet) {
      return res.status(404).json({ message: "Pet not found or not authorized" });
    }

    res.json({ message: "Pet deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
