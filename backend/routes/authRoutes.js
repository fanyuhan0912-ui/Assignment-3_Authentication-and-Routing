const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Pet = require("../models/Pet");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      displayName: username,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.signInDate = new Date();
    if (!user.displayName) {
      user.displayName = user.username;
    }
    await user.save();

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role,
      displayName: req.user.displayName || req.user.username,
      profileImage: req.user.profileImage || "",
      signInDate: req.user.signInDate,
      savedPets: req.user.savedPets,
    },
  });
});

router.patch("/profile", requireAuth, async (req, res) => {
  try {
    const { displayName, profileImage } = req.body;

    if (typeof displayName === "string") {
      req.user.displayName = displayName.trim() || req.user.username;
    }

    if (typeof profileImage === "string") {
      req.user.profileImage = profileImage;
    }

    await req.user.save();

    res.json({
      profile: {
        displayName: req.user.displayName || req.user.username,
        profileImage: req.user.profileImage || "",
        signInDate: req.user.signInDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/saved-pets/:petId", requireAuth, async (req, res) => {
  try {
    const { petId } = req.params;
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    const alreadySaved = req.user.savedPets.some(
      (savedPet) => savedPet._id.toString() === petId
    );

    if (alreadySaved) {
      req.user.savedPets = req.user.savedPets.filter(
        (savedPet) => savedPet._id.toString() !== petId
      );
    } else {
      req.user.savedPets.push(pet._id);
    }

    await req.user.save();
    await req.user.populate("savedPets");

    res.json({
      savedPets: req.user.savedPets,
      isSaved: !alreadySaved,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
