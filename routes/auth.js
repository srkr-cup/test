const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { generateOTP, sendOTPEmail, sendPasswordResetEmail } = require("../utils/emailService")

const router = express.Router()

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
router.post("/signup", async (req, res) => {
  try {
    const { name, regdNo, email, phone, password } = req.body

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { regdNo }] })
    if (user) {
      return res.status(400).json({ message: "User already exists with this email or registration number" })
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date()
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10) // OTP valid for 10 minutes

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    user = new User({
      name,
      regdNo,
      email,
      phone,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
    })

    await user.save()

    // Send OTP email
    try {
      await sendOTPEmail(email, otp)
      res.status(201).json({
        message: "OTP sent to your email. Please verify to complete registration.",
        email: email,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      res.status(201).json({
        message:
          "Account created successfully. However, we could not send the verification email. Please contact support.",
        email: email,
        otp: otp, // For demo purposes only - remove in production
      })
    }
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ message: error.message })
  }
})

// @route   POST /api/auth/login
// @desc    Authenticate user
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body

    // Check for user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check if admin login is requested but user is not admin
    if (isAdmin && user.role !== "admin") {
      return res.status(403).json({ message: "Invalid credentials" })
    }

    // Check if user is verified (except for admin)
    if (!isAdmin && !user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your email first." })
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create JWT payload
    const payload = {
      userId: user._id,
      role: user.role,
    }

    // Sign token
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP
// @access  Public
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" })
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." })
    }

    // Mark user as verified and clear OTP fields
    user.isVerified = true
    user.otp = undefined
    user.otpExpiry = undefined
    await user.save()

    // Generate token for automatic login
    const payload = {
      userId: user._id,
      role: user.role,
    }

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
      if (err) throw err
      res.status(200).json({
        message: "Email verified successfully.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        directLogin: true,
      })
    })
  } catch (error) {
    console.error("OTP verification error:", error)
    res.status(500).json({ message: error.message })
  }
})

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP
// @access  Public
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" })
    }

    // Generate new OTP
    const otp = generateOTP()
    const otpExpiry = new Date()
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10) // OTP valid for 10 minutes

    user.otp = otp
    user.otpExpiry = otpExpiry
    await user.save()

    // Send OTP email
    try {
      await sendOTPEmail(email, otp)
      res.status(200).json({ message: "New OTP sent to your email" })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      res.status(500).json({ message: "Failed to send OTP email" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   POST /api/auth/forgot-password
// @desc    Send password reset OTP
// @access  Public
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Generate OTP for password reset
    const otp = generateOTP()
    const otpExpiry = new Date()
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10) // OTP valid for 10 minutes

    user.otp = otp
    user.otpExpiry = otpExpiry
    user.passwordReset = true // Flag to indicate this OTP is for password reset
    await user.save()

    // Send password reset email with OTP
    try {
      await sendPasswordResetEmail(email, otp)
      res.status(200).json({
        message: "Password reset OTP sent to your email",
        email: email,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      res.status(500).json({ message: "Failed to send password reset email" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// @route   POST /api/auth/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." })
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update user's password and clear OTP fields
    user.password = hashedPassword
    user.otp = undefined
    user.otpExpiry = undefined
    user.passwordReset = undefined
    await user.save()

    res.status(200).json({ message: "Password has been reset successfully. You can now login with your new password." })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
