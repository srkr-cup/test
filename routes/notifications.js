const express = require("express")
const Notification = require("../models/Notification")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   POST /api/notifications
// @desc    Create notification
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { message, type } = req.body

    if (!message) {
      return res.status(400).json({ message: "Message is required" })
    }

    const notification = new Notification({
      message,
      user: req.user._id,
      type: type || "system",
      read: false,
    })

    await notification.save()
    res.status(201).json(notification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   GET /api/notifications/unread
// @desc    Get unread notifications
// @access  Private
router.get("/unread", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
      read: false,
    }).sort({ createdAt: -1 })

    res.json(notifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   POST /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.post("/:id/read", auth, async (req, res) => {
  try {
    const { id } = req.params

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { read: true },
      { new: true },
    )

    if (!notification) {
      return res.status(404).json({ message: "Notification not found or not authorized" })
    }

    res.json(notification)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   POST /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.post("/read-all", auth, async (req, res) => {
  try {
    const result = await Notification.updateMany({ user: req.user._id, read: false }, { read: true })

    res.json({
      message: "All notifications marked as read",
      count: result.modifiedCount,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
