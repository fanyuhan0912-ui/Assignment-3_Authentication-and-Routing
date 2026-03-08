const express = require("express");
const Item = require("../models/Item");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// get all items for logged in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// create item
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    const newItem = new Item({
      title,
      description,
      userId: req.user.userId,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// delete item
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Item.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;