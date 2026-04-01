const express = require("express");
const Pet = require("../models/Pet");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, category, age, description, image } = req.body;

    const pet = await Pet.create({
      name,
      category,
      age,
      description,
      image,
      createdBy: req.user.userId,
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Pet.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    res.json({ message: "Pet deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
