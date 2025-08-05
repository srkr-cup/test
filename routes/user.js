const express = require("express")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    res.json(req.user)
  } catch (error) {
    console.error("Profile error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/user/all
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get("/all", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." })
    }

    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    console.error("Get all users error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone } = req.body

    // Find user by ID (from auth middleware)
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update fields
    if (name) user.name = name
    if (phone) user.phone = phone

    await user.save()

    res.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        regdNo: user.regdNo,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Update profile error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
