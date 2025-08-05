
const LostItem = require("../models/LostItem")
const MarketPlaceItem = require("../models/MarketPlaceItem")
const Note = require("../models/Note")
const User = require("../models/User")
const Notification = require("../models/Notification")
const auth = require("../middleware/auth")

const router = express.Router()

// Middleware to check admin role
const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." })
  }
  next()
}

// Lost Item Approval
router.post("/approve/lostitem/:id", auth, adminAuth, async (req, res) => {
  try {
    const item = await LostItem.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true })

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    // Create notification for the user
    const notification = new Notification({
      message: `Your lost item "${item.title}" has been approved.`,
      user: item.user,
      type: "system",
    })
    await notification.save()

    res.json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/reject/lostitem/:id", auth, adminAuth, async (req, res) => {
  try {
    const item = await LostItem.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true })

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    // Create notification for the user
    const notification = new Notification({
      message: `Your lost item "${item.title}" has been rejected.`,
      user: item.user,
      type: "system",
    })
    await notification.save()

    res.json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Marketplace Item Approval
router.post("/approve/marketplace/:id", auth, adminAuth, async (req, res) => {
  try {
    const item = await MarketPlaceItem.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true })

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    // Create notification for the user
    const notification = new Notification({
      message: `Your marketplace item "${item.title}" has been approved.`,
      user: item.user,
      type: "system",
    })
    await notification.save()

    res.json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/reject/marketplace/:id", auth, adminAuth, async (req, res) => {
  try {
    const item = await MarketPlaceItem.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true })

    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    // Create notification for the user
    const notification = new Notification({
      message: `Your marketplace item "${item.title}" has been rejected.`,
      user: item.user,
      type: "system",
    })
    await notification.save()

    res.json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Note Approval
router.post("/approve/note/:id", auth, adminAuth, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true })

    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    // Create notification for the user
    const notification = new Notification({
      message: `Your note "${note.title}" has been approved.`,
      user: note.user,
      type: "system",
    })
    await notification.save()

    res.json(note)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/reject/note/:id", auth, adminAuth, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true })

    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    // Create notification for the user
    const notification = new Notification({
      message: `Your note "${note.title}" has been rejected.`,
      user: note.user,
      type: "system",
    })
    await notification.save()

    res.json(note)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// User Management
router.delete("/user/:id", auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ message: "User deleted successfully." })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/add-admin", auth, adminAuth, async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.role = "admin"
    await user.save()

    res.status(200).json({ message: "User promoted to admin successfully", user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all users
router.get("/users", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
