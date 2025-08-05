const jwt = require("jsonwebtoken")
const User = require("../models/User")

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    // Check if no token
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Add user from payload
      const userId = decoded.userId || decoded.id

      if (!userId) {
        return res.status(401).json({ message: "Invalid token format" })
      }

      // Find user by ID and exclude password from the result
      const user = await User.findById(userId).select("-password")

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      // Add user to request object
      req.user = user

      next()
    } catch (tokenError) {
      console.error("Token verification error:", tokenError.message)
      return res.status(401).json({ message: "Token is not valid" })
    }
  } catch (err) {
    console.error("Auth middleware error:", err.message)
    return res.status(500).json({ message: "Server authentication error" })
  }
}
