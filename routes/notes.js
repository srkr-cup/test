const express = require("express")
const Note = require("../models/Note")
const Notification = require("../models/Notification")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   POST /api/notes
// @desc    Upload a note
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { title, subject, semester, description, fileName, fileSize, fileUrl } = req.body

    if (!title || !subject || !semester || !fileName || !fileUrl) {
      return res.status(400).json({ message: "Title, subject, semester, fileName, and fileUrl are required" })
    }

    const newNote = new Note({
      title,
      subject,
      semester,
      description,
      user: req.user._id,
      fileName,
      fileSize: fileSize || 0,
      fileUrl,
      status: "pending",
      dateUploaded: new Date(),
    })

    await newNote.save()

    // Create notification for the user
    const notification = new Notification({
      message: `Your note "${title}" has been submitted for approval.`,
      user: req.user._id,
      type: "system",
    })
    await notification.save()

    res.status(201).json({
      success: true,
      message: "Note uploaded successfully and pending approval",
      note: newNote,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   GET /api/notes
// @desc    Get approved notes
// @access  Public
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ status: "approved" }).populate("user", "name email").sort({ dateUploaded: -1 })
    res.json(notes)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   GET /api/notes/user
// @desc    Get user's notes
// @access  Private
router.get("/user", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ dateUploaded: -1 })
    res.json(notes)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   GET /api/notes/pending
// @desc    Get pending notes (admin only)
// @access  Private/Admin
router.get("/pending", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." })
    }

    const notes = await Note.find({ status: "pending" }).populate("user", "name email").sort({ dateUploaded: -1 })
    res.json(notes)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
