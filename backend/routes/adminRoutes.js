const express = require("express");
const User = require("../models/User");
const Pet = require("../models/Pet");
const Registration = require("../models/Registration");
const verifyAdmin = require("../middleware/verifyAdmin");

const router = express.Router();

// All admin routes require admin role
router.use(verifyAdmin);

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user role
router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all pets
router.get("/pets", async (req, res) => {
  try {
    const pets = await Pet.find().populate("createdBy", "username").sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete pet
router.delete("/pets/:id", async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all registrations
router.get("/registrations", async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("user", "username displayName")
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Approve/reject registration
router.patch("/registrations/:id/status", async (req, res) => {
  try {
    const { approvalStatus } = req.body;

    if (!["Waiting", "Approved"].includes(approvalStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { approvalStatus },
      { new: true }
    ).populate("user", "username displayName");

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete registration
router.delete("/registrations/:id", async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json({ message: "Registration deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const [userCount, petCount, registrationCount, pendingRegistrations] = await Promise.all([
      User.countDocuments(),
      Pet.countDocuments(),
      Registration.countDocuments(),
      Registration.countDocuments({ approvalStatus: "Waiting" }),
    ]);

    res.json({
      totalUsers: userCount,
      totalPets: petCount,
      totalRegistrations: registrationCount,
      pendingRegistrations,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;