const express = require("express")
const MarketPlaceItem = require("../models/MarketPlaceItem")
const Notification = require("../models/Notification")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   POST /api/marketplace
// @desc    Post a marketplace item
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, price, contact } = req.body

    if (!title || !description || !price) {
      return res.status(400).json({ message: "Title, description, and price are required" })
    }

    const newItem = new MarketPlaceItem({
      title,
      description,
      price,
      contact: contact || req.user.phone,
      user: req.user._id,
      status: "pending",
      datePosted: new Date(),
    })

    await newItem.save()

    // Create notification for the user
    const notification = new Notification({
      message: `Your marketplace item "${title}" has been submitted for approval.`,
      user: req.user._id,
      type: "system",
    })
    await notification.save()

    res.status(201).json({
      success: true,
      message: "Item posted successfully and pending approval",
      item: newItem,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   GET /api/marketplace
// @desc    Get approved marketplace items
// @access  Public
router.get("/", async (req, res) => {
  try {
    const items = await MarketPlaceItem.find({ status: "approved" })
      .populate("user", "name email phone")
      .sort({ datePosted: -1 })
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   GET /api/marketplace/user
// @desc    Get user's marketplace items
// @access  Private
router.get("/user", auth, async (req, res) => {
  try {
    const items = await MarketPlaceItem.find({ user: req.user._id }).sort({ datePosted: -1 })
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   GET /api/marketplace/pending
// @desc    Get pending marketplace items (admin only)
// @access  Private/Admin
router.get("/pending", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." })
    }

    const items = await MarketPlaceItem.find({ status: "pending" })
      .populate("user", "name email phone")
      .sort({ datePosted: -1 })
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
