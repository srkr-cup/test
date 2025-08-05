const express = require("express")
const LostItem = require("../models/LostItem")
const Notification = require("../models/Notification")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   POST /api/lostfound
// @desc    Post a lost item
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, location } = req.body

    if (!title || !description || !location) {
      return res.status(400).json({ message: "Title, description, and location are required" })
    }

    const newItem = new LostItem({
      title,
      description,
      location,
      user: req.user._id,
      status: "pending",
      datePosted: new Date(),
    })

    await newItem.save()

    // Create notification for the user
    const notification = new Notification({
      message: `Your lost item "${title}" has been submitted for approval.`,
      user: req.user._id,
      type: "system",
    })
    await notification.save()

    res.status(201).json({
      success: true,
      message: "Lost item posted successfully and pending approval",
      item: newItem,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   GET /api/lostfound
// @desc    Get approved lost items
// @access  Public
router.get("/", async (req, res) => {
  try {
    const items = await LostItem.find({ status: "approved" })
      .populate("user", "name email phone")
      .sort({ datePosted: -1 })
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   GET /api/lostfound/user
// @desc    Get user's lost items
// @access  Private
router.get("/user", auth, async (req, res) => {
  try {
    const items = await LostItem.find({ user: req.user._id }).sort({ datePosted: -1 })
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   GET /api/lostfound/pending
// @desc    Get pending lost items (admin only)
// @access  Private/Admin
router.get("/pending", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." })
    }

    const items = await LostItem.find({ status: "pending" })
      .populate("user", "name email phone")
      .sort({ datePosted: -1 })
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
