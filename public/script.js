// Global variables
let currentUser = null
let isAdmin = false
const API_BASE_URL = window.location.origin + "/api"
const notifications = []

// Initialize OTP input fields
function initializeOTPInputs() {
  const otpInputs = document.querySelectorAll(".otp-input")

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      const value = e.target.value

      // Allow only numbers
      if (!/^\d*$/.test(value)) {
        input.value = ""
        return
      }

      // Auto-move to next input
      if (value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus()
      }
    })

    // Handle backspace
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        otpInputs[index - 1].focus()
      }
    })
  })
}

// Initialize the application
function setupDashboardSidebar() {
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const dashboardSidebar = document.getElementById("dashboard-sidebar")

  if (sidebarToggle && dashboardSidebar) {
    sidebarToggle.addEventListener("click", () => {
      dashboardSidebar.classList.toggle("active")
    })

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        if (!dashboardSidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
          dashboardSidebar.classList.remove("active")
        }
      }
    })

    // Close sidebar when clicking nav items on mobile
    const navItems = dashboardSidebar.querySelectorAll(".nav-item")
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          dashboardSidebar.classList.remove("active")
        }
      })
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  initializeOTPInputs()
  setupMobileMenu()
  setupDashboardSidebar()
})

function initializeApp() {
  console.log("Initializing app...")

  // Check if user is logged in
  const savedUser = localStorage.getItem("currentUser")
  const savedIsAdmin = localStorage.getItem("isAdmin")
  const token = localStorage.getItem("token")

  console.log("Checking saved login:", { savedUser, savedIsAdmin, token })

  if (savedUser && token) {
    currentUser = JSON.parse(savedUser)
    isAdmin = savedIsAdmin === "true"
    console.log("User already logged in:", { currentUser, isAdmin })
    showDashboard()
  } else {
    // Ensure main content is visible if no one is logged in
    showMainContent()
  }
}

function setupEventListeners() {
  // Navigation
  const hamburger = document.getElementById("hamburger")
  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileMenu)
  }

  // Forms
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  const signupForm = document.getElementById("signupForm")
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)
  }

  const forgotPasswordForm = document.getElementById("forgotPasswordForm")
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", handleForgotPassword)
  }

  const passwordResetForm = document.getElementById("passwordResetForm")
  if (passwordResetForm) {
    passwordResetForm.addEventListener("submit", handlePasswordReset)
  }

  const postLostItemForm = document.getElementById("postLostItemForm")
  if (postLostItemForm) {
    postLostItemForm.addEventListener("submit", handlePostLostItem)
  }

  const postSaleItemForm = document.getElementById("postSaleItemForm")
  if (postSaleItemForm) {
    postSaleItemForm.addEventListener("submit", handlePostSaleItem)
  }

  const uploadNotesForm = document.getElementById("uploadNotesForm")
  if (uploadNotesForm) {
    uploadNotesForm.addEventListener("submit", handleUploadNotes)
  }

  // Set up OTP verification form listeners
  setupOTPVerificationListeners()

  // Contact form
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }

  // FAQ toggle functionality
  setupFAQToggles()

  // Dashboard sidebar toggles for mobile
  const sidebarToggle = document.getElementById("sidebar-toggle")
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      const sidebar = document.querySelector(".dashboard-sidebar")
      if (sidebar) {
        sidebar.classList.toggle("active")
      }
    })
  }

  const adminSidebarToggle = document.getElementById("admin-sidebar-toggle")
  if (adminSidebarToggle) {
    adminSidebarToggle.addEventListener("click", () => {
      const sidebar = document.getElementById("admin-sidebar")
      if (sidebar) {
        sidebar.classList.toggle("active")
      }
    })
  }

  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none"
    }
  })
}

function setupMobileMenu() {
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      }
    })

    // Close menu when clicking nav links
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })
  }
}

function setupFAQToggles() {
  const faqQuestions = document.querySelectorAll(".faq-question")
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const faqItem = question.parentElement
      const answer = faqItem.querySelector(".faq-answer")
      const icon = question.querySelector("i")

      // Toggle answer visibility
      if (answer.style.display === "block") {
        answer.style.display = "none"
        icon.style.transform = "rotate(0deg)"
      } else {
        answer.style.display = "block"
        icon.style.transform = "rotate(180deg)"
      }
    })
  })
}

function handleContactForm(e) {
  e.preventDefault()

  const firstName = document.getElementById("contactFirstName").value
  const lastName = document.getElementById("contactLastName").value
  const email = document.getElementById("contactEmail").value
  const subject = document.getElementById("contactSubject").value
  const message = document.getElementById("contactMessage").value

  // Simulate form submission
  alert(`Thank you ${firstName}! Your message has been sent successfully. We'll get back to you within 24 hours.`)

  // Reset form
  e.target.reset()
}

// Navigation functions
function toggleMobileMenu() {
  const navMenu = document.getElementById("nav-menu")
  if (navMenu) {
    navMenu.classList.toggle("active")
  }
}

function showLogin() {
  console.log("showLogin function called")
  const loginModal = document.getElementById("loginModal")
  if (loginModal) {
    loginModal.style.display = "block"
    console.log("Login modal displayed")
  } else {
    console.error("Login modal element not found")
  }
  closeModal("signupModal")
}

function showSignup() {
  const signupModal = document.getElementById("signupModal")
  if (signupModal) {
    signupModal.style.display = "block"
  }
  closeModal("loginModal")
  closeModal("forgotPasswordModal")
  closeModal("passwordResetModal")
}

function showForgotPassword() {
  const forgotModal = document.getElementById("forgotPasswordModal")
  if (forgotModal) {
    forgotModal.style.display = "block"
  }
  closeModal("loginModal")
}

function showPasswordReset(email) {
  const resetModal = document.getElementById("passwordResetModal")
  if (resetModal) {
    resetModal.style.display = "block"
    const emailField = document.getElementById("resetEmail")
    if (emailField) {
      emailField.value = email
    }
  }
  closeModal("forgotPasswordModal")
}

function closeModal(modalId) {
  console.log(`closeModal function called for ${modalId}`)
  const modal = document.getElementById(modalId)
  if (modal) {
    // Add fade-out animation
    const modalContainer = modal.querySelector(".modal-container")
    if (modalContainer) {
      modalContainer.classList.add("fade-out")

      // Wait for animation to complete before hiding
      setTimeout(() => {
        modal.style.display = "none"
        // Remove the animation class for next time
        modalContainer.classList.remove("fade-out")
      }, 300)
    } else {
      modal.style.display = "none"
    }

    // Clear OTP timer if it exists
    if (modalId === "otpVerificationModal" && window.otpTimerInterval) {
      clearInterval(window.otpTimerInterval)
      window.otpTimerInterval = null
    }

    console.log(`Modal ${modalId} closed`)
  } else {
    console.error(`Modal element ${modalId} not found`)
  }
}

// Authentication functions
async function handleLogin(e) {
  console.log("handleLogin triggered", e)
  e.preventDefault()
  console.log("Login form submitted")

  const email = document.getElementById("loginEmail").value.trim()
  const password = document.getElementById("loginPassword").value.trim()
  const adminLogin = document.getElementById("isAdmin").checked

  console.log("Login attempt:", { email, adminLogin })

  if (!email || !password) {
    alert("Please enter both email and password")
    return
  }

  // Add loading state to the button
  const loginButton = e.submitter
  const originalText = loginButton.querySelector("span").textContent
  loginButton.disabled = true
  loginButton.querySelector("span").textContent = "Signing In..."

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        isAdmin: adminLogin,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.message === "Email not verified") {
        alert("Your email is not verified. Please check your inbox for the verification OTP.")
        // Show OTP verification modal with the email
        showOTPVerificationModal(email)
      } else {
        throw new Error(data.message || "Login failed")
      }
      return
    }

    // Login successful
    isAdmin = data.user.role === "admin"
    currentUser = data.user
    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    localStorage.setItem("isAdmin", isAdmin ? "true" : "false")
    localStorage.setItem("token", data.token)

    console.log("User login successful, showing dashboard")
    try {
      showDashboard()
      closeModal("loginModal")
    } catch (error) {
      console.error("Error showing dashboard:", error)
      alert("Error loading dashboard. Please try again.")
    }
  } catch (error) {
    alert(error.message || "Login failed. Please try again.")
  } finally {
    // Remove loading state
    loginButton.disabled = false
    loginButton.querySelector("span").textContent = originalText
  }
}

async function handleSignup(e) {
  e.preventDefault()

  const name = document.getElementById("signupName").value
  const regdNo = document.getElementById("signupRegdNo").value
  const email = document.getElementById("signupEmail").value
  const password = document.getElementById("signupPassword").value
  const phone = document.getElementById("signupPhone").value

  // Validate registration number format
  const regdNoPattern = /^(22|23|24|25)B91[A-Za-z0-9]+$/
  if (!regdNoPattern.test(regdNo)) {
    alert("Invalid registration number format. Please use format like 22B91..., 23B91..., 24B91..., or 25B91...")
    return
  }

  // Add loading state to the button
  const signupButton = e.submitter
  const originalText = signupButton.querySelector("span").textContent
  signupButton.disabled = true
  signupButton.querySelector("span").textContent = "Creating Account..."

  try {
    // Send signup request to the server
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        regdNo,
        email,
        password,
        phone,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Signup failed")
    }

    // Show success message
    alert("Account created successfully! Please check your email for the verification code.")

    // Show OTP verification modal
    showOTPVerificationModal(email)
    closeModal("signupModal")
  } catch (error) {
    alert(error.message)
  } finally {
    // Remove loading state
    signupButton.disabled = false
    signupButton.querySelector("span").textContent = originalText
  }
}

function logout() {
  try {
    currentUser = null
    isAdmin = false
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isAdmin")
    localStorage.removeItem("token")

    // Hide dashboards and show home
    showMainContent()

    // Close any open sidebars on logout - with null checks
    const userSidebar = document.getElementById("user-sidebar")
    if (userSidebar) userSidebar.classList.remove("active")

    const adminSidebar = document.getElementById("admin-sidebar")
    if (adminSidebar) adminSidebar.classList.remove("active")
  } catch (error) {
    console.error("Error during logout:", error)
  }
}

// Helper function to set up OTP verification form listeners
function setupOTPVerificationListeners() {
  // Add event listener to OTP verification form
  const otpForm = document.getElementById("otpVerificationForm")
  if (otpForm) {
    // Remove existing event listeners to prevent duplicates
    const newOtpForm = otpForm.cloneNode(true)
    otpForm.parentNode.replaceChild(newOtpForm, otpForm)
    newOtpForm.addEventListener("submit", handleOTPVerification)
  }

  // Add event listener to resend OTP link
  const resendOtpLink = document.getElementById("resendOtpLink")
  if (resendOtpLink) {
    // Remove existing event listeners to prevent duplicates
    const newResendOtpLink = resendOtpLink.cloneNode(true)
    resendOtpLink.parentNode.replaceChild(newResendOtpLink, resendOtpLink)
    newResendOtpLink.addEventListener("click", handleResendOTP)
  }
}

// OTP Verification Functions
function showOTPVerificationModal(email) {
  // Create modal if it doesn't exist
  let otpModal = document.getElementById("otpVerificationModal")
  if (!otpModal) {
    otpModal = document.createElement("div")
    otpModal.id = "otpVerificationModal"
    otpModal.className = "modal"
    otpModal.innerHTML = `
            <div class="modal-overlay" onclick="closeModal('otpVerificationModal')"></div>
            <div class="modal-container fade-in">
                <div class="modal-header">
                    <h2 class="pulse-animation">Verify Your Email</h2>
                    <p>We've sent a verification code to your email</p>
                    <button class="modal-close" onclick="closeModal('otpVerificationModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <form id="otpVerificationForm" class="modal-form">
                    <input type="hidden" id="otpEmail">
                    <div class="form-group">
                        <label for="otpCode">Enter Verification Code</label>
                        <div class="otp-input-container">
                            <input type="text" class="otp-input" maxlength="1" autofocus>
                            <input type="text" class="otp-input" maxlength="1">
                            <input type="text" class="otp-input" maxlength="1">
                            <input type="text" class="otp-input" maxlength="1">
                            <input type="text" class="otp-input" maxlength="1">
                            <input type="text" class="otp-input" maxlength="1">
                            <input type="hidden" id="otpCode">
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="timer-container">
                            <p class="form-hint">Code expires in <span id="otpTimer" class="countdown-timer">05:00</span></p>
                        </div>
                        <p class="form-hint">Didn't receive the code? <a href="javascript:void(0)" id="resendOtpLink" class="resend-link">Resend</a></p>
                    </div>

                    <button type="submit" class="btn btn-primary btn-full btn-animated">
                        <span>Verify Email</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </form>

                <div class="modal-footer">
                    <p>Already verified? <a href="javascript:void(0)" onclick="showLogin()">Sign in</a></p>
                </div>
            </div>
        `
    document.body.appendChild(otpModal)

    // Set up OTP input fields
    setupOTPInputFields()

    // Start countdown timer
    startOTPCountdownTimer()
  }

  // Set email in hidden field
  document.getElementById("otpEmail").value = email

  // Show the modal
  otpModal.style.display = "block"

  // Set up event listeners for the OTP form
  setupOTPVerificationListeners()
}

// Set up OTP input fields for better UX
function setupOTPInputFields() {
  const otpInputs = document.querySelectorAll(".otp-input")
  const otpCodeField = document.getElementById("otpCode")
  const firstInput = otpInputs[0]

  function handleOTPInput(e) {
    const input = e.target
    let value = input.value

    // Remove non-digits
    value = value.replace(/\D/g, "")

    // Take only first 6 digits
    value = value.substring(0, 6)

    // Update display
    otpInputs.forEach((input, index) => {
      input.value = value[index] || ""
    })

    // Update hidden field
    otpCodeField.value = value

    // Focus next empty input if available
    if (value.length < 6) {
      const nextEmptyInput = Array.from(otpInputs).find((input) => !input.value)
      if (nextEmptyInput) nextEmptyInput.focus()
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Backspace") {
      const input = e.target
      if (input.value === "") {
        // Clear all inputs when backspacing an empty first input
        otpInputs.forEach((input) => (input.value = ""))
        otpCodeField.value = ""
        firstInput.focus()
      }
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    const value = pastedData.replace(/\D/g, "").substring(0, 6)

    // Update display
    otpInputs.forEach((input, index) => {
      input.value = value[index] || ""
    })

    // Update hidden field
    otpCodeField.value = value

    // Focus last filled input
    const lastFilledIndex = Math.min(value.length, otpInputs.length) - 1
    if (lastFilledIndex >= 0) otpInputs[lastFilledIndex].focus()
  }

  // Set up event listeners
  otpInputs.forEach((input, index) => {
    if (index === 0) {
      input.addEventListener("input", handleOTPInput)
      input.addEventListener("keydown", handleKeyDown)
      input.addEventListener("paste", handlePaste)
    } else {
      input.readOnly = true
    }
  })

  // Focus first input initially
  firstInput.focus()
}

// Start countdown timer for OTP expiration
function startOTPCountdownTimer() {
  // Clear any existing timer
  if (window.otpTimerInterval) {
    clearInterval(window.otpTimerInterval)
  }

  const timerElement = document.getElementById("otpTimer")
  const resendLink = document.getElementById("resendOtpLink")
  const form = document.getElementById("otpVerificationForm")
  const inputs = document.querySelectorAll(".otp-input")
  let timeLeft = 5 * 60 // 5 minutes in seconds
  let warningShown = false
  let criticalShown = false

  // Store timer start time for accurate countdown
  const startTime = Date.now()

  // Initially disable resend link and enable inputs
  resendLink.classList.remove("active")
  resendLink.style.pointerEvents = "none"
  resendLink.style.opacity = "0.5"
  inputs.forEach((input) => (input.disabled = false))

  // Reset timer classes and state
  timerElement.classList.remove("timer-warning", "timer-critical", "timer-expired", "pulse-animation")

  // Function to update timer display
  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  window.otpTimerInterval = setInterval(() => {
    // Calculate time passed since start
    const timePassed = Math.floor((Date.now() - startTime) / 1000)
    timeLeft = Math.max(5 * 60 - timePassed, 0)

    // Update display
    timerElement.textContent = updateTimerDisplay()

    // Warning state - 1 minute remaining
    if (timeLeft <= 60 && !warningShown) {
      warningShown = true
      timerElement.classList.add("timer-warning", "pulse-animation")
    }

    // Critical state - 30 seconds remaining
    if (timeLeft <= 30 && !criticalShown) {
      criticalShown = true
      timerElement.classList.add("timer-critical")
      timerElement.classList.add("pulse-animation-fast")
    }

    // Expired state
    if (timeLeft <= 0) {
      clearInterval(window.otpTimerInterval)
      window.otpTimerInterval = null

      timerElement.textContent = "Code Expired!"
      timerElement.classList.remove("timer-warning", "timer-critical", "pulse-animation", "pulse-animation-fast")
      timerElement.classList.add("timer-expired")

      // Show expired message
      const expiredMessage = document.createElement("div")
      expiredMessage.className = "verification-error"
      expiredMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Code expired. Please request a new one.'
      form.insertBefore(expiredMessage, form.querySelector(".form-group:last-child"))

      // Enable resend link when timer expires
      resendLink.classList.add("active")
      resendLink.style.pointerEvents = "auto"
      resendLink.style.opacity = "1"

      // Clear form fields
      document.querySelectorAll(".otp-input").forEach((input) => {
        input.value = ""
        input.disabled = true
      })
    }

    timeLeft--
  }, 1000)
}

async function handleOTPVerification(e) {
  e.preventDefault()

  const email = document.getElementById("otpEmail").value
  const otpInputs = document.querySelectorAll(".otp-input")
  const otp = Array.from(otpInputs)
    .map((input) => input.value)
    .join("")
  const otpForm = document.getElementById("otpVerificationForm")
  const timerElement = document.getElementById("otpTimer")

  // Check if OTP is expired
  if (timerElement.classList.contains("timer-expired")) {
    const errorMessage = document.createElement("div")
    errorMessage.className = "verification-error"
    errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> OTP has expired. Please request a new one.'
    otpForm.insertBefore(errorMessage, otpForm.querySelector(".form-group:last-child"))

    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.parentNode.removeChild(errorMessage)
      }
    }, 3000)
    return
  }

  // Validate OTP format
  if (!email || !otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
    // Add shake animation to the form
    otpForm.classList.add("shake-animation")

    // Create and show error message
    const errorMessage = document.createElement("div")
    errorMessage.className = "verification-error"
    errorMessage.innerHTML =
      '<i class="fas fa-exclamation-circle"></i> Please enter the complete 6-digit verification code'

    // Remove any existing error messages
    const existingError = otpForm.querySelector(".verification-error, .verification-success")
    if (existingError) {
      existingError.remove()
    }

    otpForm.appendChild(errorMessage)

    // Remove the animation class after it completes
    setTimeout(() => {
      otpForm.classList.remove("shake-animation")
      // Remove error message after a delay
      setTimeout(() => {
        if (errorMessage.parentNode) {
          errorMessage.parentNode.removeChild(errorMessage)
        }
      }, 3000)
    }, 500)

    return
  }

  // Add loading state to the button
  const verifyButton = e.submitter
  addLoadingState(verifyButton)

  try {
    // Send OTP verification request to the server
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Verification failed")
    }

    // Show success animation and message
    const modalContainer = document.querySelector("#otpVerificationModal .modal-container")
    modalContainer.classList.add("bounce-animation")

    // Create and show success message
    const successMessage = document.createElement("div")
    successMessage.className = "verification-success"
    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Verification successful!'

    // Remove any existing messages
    const existingMessage = otpForm.querySelector(".verification-error, .verification-success")
    if (existingMessage) {
      existingMessage.remove()
    }

    otpForm.appendChild(successMessage)

    // Check if direct login is enabled
    if (data.directLogin && data.token && data.user) {
      // Store user data and token
      currentUser = data.user
      isAdmin = data.user.role === "admin"
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
      localStorage.setItem("isAdmin", isAdmin ? "true" : "false")
      localStorage.setItem("token", data.token)

      // Wait for animation to complete before redirecting
      setTimeout(() => {
        // Close the modal and show dashboard
        closeModal("otpVerificationModal")
        showDashboard()
      }, 1500)
    } else {
      // Fallback to the old behavior
      setTimeout(() => {
        closeModal("otpVerificationModal")
        showLogin()
      }, 1500)
    }
  } catch (error) {
    // Add shake animation to the form
    otpForm.classList.add("shake-animation")

    // Create and show error message
    const errorMessage = document.createElement("div")
    errorMessage.className = "verification-error"
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`

    // Remove any existing error messages
    const existingError = otpForm.querySelector(".verification-error")
    if (existingError) {
      existingError.remove()
    }

    otpForm.appendChild(errorMessage)

    // Remove the animation class after it completes
    setTimeout(() => {
      otpForm.classList.remove("shake-animation")
      // Remove error message after a delay
      setTimeout(() => {
        if (errorMessage.parentNode) {
          errorMessage.parentNode.removeChild(errorMessage)
        }
      }, 3000)
    }, 500)
  } finally {
    removeLoadingState(verifyButton, "Verify Email")
  }
}

async function handleResendOTP(e) {
  e.preventDefault()

  const email = document.getElementById("otpEmail").value
  const resendLink = document.getElementById("resendOtpLink")
  const form = document.getElementById("otpVerificationForm")

  if (!email) {
    alert("Email address is missing. Please try again.")
    return
  }

  // Add loading state to the resend link
  resendLink.classList.remove("active")
  const originalText = resendLink.textContent
  resendLink.textContent = "Sending..."
  resendLink.style.pointerEvents = "none"
  resendLink.style.opacity = "0.5"

  // Remove any existing error messages
  const existingError = form.querySelector(".verification-error")
  if (existingError) {
    existingError.remove()
  }

  // Re-enable OTP input fields
  document.querySelectorAll(".otp-input").forEach((input) => {
    input.value = ""
    input.disabled = false
  })

  // Remove expired/warning classes from timer
  const timerElement = document.getElementById("otpTimer")
  timerElement.classList.remove("timer-expired", "timer-warning", "pulse-animation")

  try {
    // Send resend OTP request to the server
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to resend verification code")
    }

    // Show success animation and message
    const successMessage = document.createElement("div")
    successMessage.className = "verification-success"
    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> New code sent successfully!'
    form.appendChild(successMessage)

    // Clear and focus first input
    document.querySelectorAll(".otp-input").forEach((input, index) => {
      input.value = ""
      if (index === 0) input.focus()
    })

    // Clear old timer if exists
    if (window.otpTimerInterval) {
      clearInterval(window.otpTimerInterval)
    }

    // Restart the countdown timer
    startOTPCountdownTimer()

    // Remove success message after 3 seconds
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.parentNode.removeChild(successMessage)
      }
    }, 3000)
  } catch (error) {
    const errorMessage = document.createElement("div")
    errorMessage.className = "verification-error"
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`
    form.appendChild(errorMessage)

    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.parentNode.removeChild(errorMessage)
      }
    }, 3000)
  } finally {
    // Reset the link
    resendLink.textContent = originalText
    resendLink.style.pointerEvents = "auto"
    resendLink.style.opacity = "1"
  }
}

async function handleForgotPassword(e) {
  e.preventDefault()

  const email = document.getElementById("forgotEmail").value

  if (!email) {
    alert("Please enter your email address")
    return
  }

  // Add loading state to the button
  const submitButton = e.submitter
  const originalText = submitButton.querySelector("span").textContent
  submitButton.disabled = true
  submitButton.querySelector("span").textContent = "Sending..."

  try {
    // Send forgot password request to the server
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to send reset code")
    }

    alert("A password reset code has been sent to your email.")
    showPasswordReset(email)
  } catch (error) {
    alert(error.message)
  } finally {
    // Remove loading state
    submitButton.disabled = false
    submitButton.querySelector("span").textContent = originalText
  }
}

async function handlePasswordReset(e) {
  e.preventDefault()

  const email = document.getElementById("resetEmail").value
  const otp = document.getElementById("resetOTP").value
  const newPassword = document.getElementById("newPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value

  if (!email || !otp || !newPassword || !confirmPassword) {
    alert("Please fill in all fields")
    return
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match")
    return
  }

  // Add loading state to the button
  const resetButton = e.submitter
  const originalText = resetButton.querySelector("span").textContent
  resetButton.disabled = true
  resetButton.querySelector("span").textContent = "Resetting..."

  try {
    // Send reset password request to the server
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
        newPassword,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Password reset failed")
    }

    alert("Your password has been reset successfully. You can now login with your new password.")
    closeModal("passwordResetModal")
    showLogin()
  } catch (error) {
    alert(error.message)
  } finally {
    // Remove loading state
    resetButton.disabled = false
    resetButton.querySelector("span").textContent = originalText
  }
}

function showMainContent() {
  document.body.setAttribute("data-page", "home")

  // Add null check for main-navbar
  const mainNavbar = document.getElementById("main-navbar")
  if (mainNavbar) mainNavbar.style.display = "flex" // Show main navbar

  const sections = ["home", "features", "about", "contact"]
  sections.forEach((id) => {
    const section = document.getElementById(id)
    if (section) section.style.display = "block"
  })

  const dashboards = ["userDashboard", "adminDashboard"]
  dashboards.forEach((id) => {
    const dashboard = document.getElementById(id)
    if (dashboard) dashboard.style.display = "none"
  })
}

function showDashboard() {
  console.log("showDashboard called, isAdmin:", isAdmin, currentUser)
  console.log("Attempting to show dashboard")
  try {
    // Hide all main sections
    document.body.setAttribute("data-page", "dashboard")

    // Hide main navbar
    const mainNavbar = document.getElementById("main-navbar")
    if (mainNavbar) mainNavbar.style.display = "none" // Hide main navbar

    const sections = ["home", "features", "about", "contact"]
    sections.forEach((id) => {
      const section = document.getElementById(id)
      if (section) section.style.display = "none"
    })

    if (isAdmin) {
      const adminDashboard = document.getElementById("adminDashboard")
      const userDashboard = document.getElementById("userDashboard")

      if (adminDashboard) adminDashboard.style.display = "flex"
      if (userDashboard) userDashboard.style.display = "none"
      loadAdminDashboard()
      updateNotificationBadge()
      // Set initial active tab for admin
      showTab("admin-overview", "admin", null)
    } else {
      const userDashboard = document.getElementById("userDashboard")
      const adminDashboard = document.getElementById("adminDashboard")
      const userName = document.getElementById("userName")

      if (userDashboard) userDashboard.style.display = "flex"
      if (adminDashboard) adminDashboard.style.display = "none"
      if (userName && currentUser) userName.textContent = currentUser.name
      loadUserDashboard()
      updateNotificationBadge()
      loadRecentNotifications()
      // Set initial active tab for user
      showTab("overview", "user", null)
    }
  } catch (error) {
    console.error("Error showing dashboard:", error)
    alert("Error loading dashboard. Please try refreshing the page.")
  }
}

// Tab functions
function showTab(tabName, userType, event) {
  console.log(`showTab called with tabName: ${tabName}, userType: ${userType}, event:`, event)
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content")
  tabContents.forEach((tab) => tab.classList.remove("active"))

  // Remove active class from all nav items
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => item.classList.remove("active"))

  // Show selected tab
  const tabElement = document.getElementById(tabName)
  if (tabElement) {
    tabElement.classList.add("active")
  } else {
    console.error(`Tab element with ID '${tabName}' not found`)
    return
  }

  // Set active class to the clicked nav item if event is provided
  if (event) {
    const clickedNavItem = event.target.closest(".nav-item")
    if (clickedNavItem) {
      clickedNavItem.classList.add("active")
    }
  } else {
    // If no event (called programmatically), find and activate the corresponding nav item
    const navItem = document.querySelector(`.nav-item[onclick*="showTab('${tabName}')"]`)
    if (navItem) {
      navItem.classList.add("active")
    }
  }

  // Update breadcrumb title
  const pageTitleElement =
    userType === "admin" ? document.getElementById("adminPageTitle") : document.getElementById("currentPageTitle")
  if (pageTitleElement) {
    // Capitalize first letter and replace hyphens with spaces for display
    pageTitleElement.textContent = tabName
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Load specific tab data
  if (tabName === "lost-found-user") {
    loadLostFoundItems()
  } else if (tabName === "marketplace-user") {
    loadMarketplaceItems()
  } else if (tabName === "notes-user") {
    loadNotes()
  } else if (tabName === "users-management") {
    loadUsersManagement()
  } else if (tabName === "pending-approvals") {
    loadPendingApprovals()
  } else if (tabName === "content-management") {
    loadContentManagement()
  }

  // Close sidebar on mobile after selecting a tab
  if (window.innerWidth <= 1024) {
    // Adjust breakpoint as per your CSS
    if (userType === "admin") {
      const sidebar = document.getElementById("admin-sidebar")
      if (sidebar) {
        sidebar.classList.remove("active")
      }
    } else {
      const sidebar = document.querySelector(".dashboard-sidebar")
      if (sidebar) {
        sidebar.classList.remove("active")
      }
    }
  }
}

// User Dashboard functions
function loadUserDashboard() {
  updateUserStats()
  loadLostFoundItems()
  loadMarketplaceItems()
  loadNotes()
  loadRecentNotifications()
}

async function updateUserStats() {
  try {
    const token = localStorage.getItem("token")
    if (!token) return

    // Fetch user's lost items
    const lostResponse = await fetch(`${API_BASE_URL}/lostfound/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const lostItems = await lostResponse.json()

    // Fetch user's marketplace items
    const marketResponse = await fetch(`${API_BASE_URL}/marketplace/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const marketItems = await marketResponse.json()

    // Fetch user's notes
    const notesResponse = await fetch(`${API_BASE_URL}/notes/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const notes = await notesResponse.json()

    // Update stats
    const userLostItemsEl = document.getElementById("userLostItems")
    const userSaleItemsEl = document.getElementById("userSaleItems")
    const userNotesEl = document.getElementById("userNotes")

    if (userLostItemsEl) userLostItemsEl.textContent = lostItems.length || 0
    if (userSaleItemsEl) userSaleItemsEl.textContent = marketItems.length || 0
    if (userNotesEl) userNotesEl.textContent = notes.length || 0
  } catch (error) {
    console.error("Error updating user stats:", error)
  }
}

// Lost & Found functions
function showPostLostItem() {
  const modal = document.getElementById("postLostItemModal")
  if (modal) {
    modal.style.display = "block"
  }
}

async function handlePostLostItem(e) {
  e.preventDefault()

  const title = document.getElementById("lostItemTitle").value
  const description = document.getElementById("lostItemDescription").value
  const location = document.getElementById("lostItemLocation").value

  const token = localStorage.getItem("token")
  if (!token) {
    alert("Please login first")
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/lostfound`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        location,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to post item")
    }

    alert("Item posted successfully! Waiting for admin approval.")
    closeModal("postLostItemModal")
    document.getElementById("postLostItemForm").reset()
    updateUserStats()
    loadLostFoundItems()
  } catch (error) {
    alert(error.message)
  }
}

async function loadLostFoundItems() {
  try {
    const response = await fetch(`${API_BASE_URL}/lostfound`)
    const items = await response.json()

    const container = document.getElementById("lostItemsList")
    if (!container) return

    container.innerHTML = ""

    if (items.length === 0) {
      container.innerHTML = '<p class="text-center">No lost items found.</p>'
      return
    }

    items.forEach((item) => {
      const itemCard = createItemCard(item, "lost")
      container.appendChild(itemCard)
    })
  } catch (error) {
    console.error("Error loading lost items:", error)
  }
}

function searchLostItems() {
  const searchTerm = document.getElementById("lostItemSearch").value.toLowerCase()
  // Implementation for search functionality
  loadLostFoundItems() // For now, just reload all items
}

// Marketplace functions
function showPostSaleItem() {
  const modal = document.getElementById("postSaleItemModal")
  if (modal) {
    modal.style.display = "block"
  }
}

async function handlePostSaleItem(e) {
  e.preventDefault()

  const title = document.getElementById("saleItemTitle").value
  const description = document.getElementById("saleItemDescription").value
  const price = document.getElementById("saleItemPrice").value
  const contact = document.getElementById("saleItemContact").value

  const token = localStorage.getItem("token")
  if (!token) {
    alert("Please login first")
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/marketplace`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        price: Number.parseFloat(price),
        contact,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to post item")
    }

    alert("Item posted successfully!")
    closeModal("postSaleItemModal")
    document.getElementById("postSaleItemForm").reset()
    updateUserStats()
    loadMarketplaceItems()
  } catch (error) {
    alert(error.message)
  }
}

async function loadMarketplaceItems() {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace`)
    const items = await response.json()

    const container = document.getElementById("marketplaceList")
    if (!container) return

    container.innerHTML = ""

    if (items.length === 0) {
      container.innerHTML = '<p class="text-center">No items for sale.</p>'
      return
    }

    items.forEach((item) => {
      const itemCard = createItemCard(item, "marketplace")
      container.appendChild(itemCard)
    })
  } catch (error) {
    console.error("Error loading marketplace items:", error)
  }
}

function searchMarketplace() {
  const searchTerm = document.getElementById("marketplaceSearch").value.toLowerCase()
  // Implementation for search functionality
  loadMarketplaceItems() // For now, just reload all items
}

// Notes functions
function showUploadNotes() {
  const modal = document.getElementById("uploadNotesModal")
  if (modal) {
    modal.style.display = "block"
  }
}

async function handleUploadNotes(e) {
  e.preventDefault()

  const title = document.getElementById("notesTitle").value
  const subject = document.getElementById("notesSubject").value
  const semester = document.getElementById("notesSemester").value
  const description = document.getElementById("notesDescription").value

  const token = localStorage.getItem("token")
  if (!token) {
    alert("Please login first")
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        subject,
        semester,
        description,
        fileName: `${title}.pdf`,
        fileUrl: "#", // Placeholder for file URL
        fileSize: 0,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to upload notes")
    }

    alert("Notes uploaded successfully! Waiting for admin approval.")
    closeModal("uploadNotesModal")
    document.getElementById("uploadNotesForm").reset()
    updateUserStats()
    loadNotes()
  } catch (error) {
    alert(error.message)
  }
}

async function loadNotes() {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`)
    const notes = await response.json()

    const container = document.getElementById("notesList")
    if (!container) return

    container.innerHTML = ""

    if (notes.length === 0) {
      container.innerHTML = '<p class="text-center">No notes available.</p>'
      return
    }

    notes.forEach((note) => {
      const noteCard = createItemCard(note, "notes")
      container.appendChild(noteCard)
    })
  } catch (error) {
    console.error("Error loading notes:", error)
  }
}

function filterNotes() {
  const semester = document.getElementById("semesterFilter").value
  const subject = document.getElementById("subjectFilter").value.toLowerCase()
  // Implementation for filter functionality
  loadNotes() // For now, just reload all notes
}

// Admin Dashboard functions
function loadAdminDashboard() {
  updateAdminStats()
  loadUsersManagement()
  loadPendingApprovals()
  loadContentManagement()
  loadRecentNotifications()
}

async function updateAdminStats() {
  try {
    const token = localStorage.getItem("token")
    if (!token) return

    // Fetch all users
    const usersResponse = await fetch(`${API_BASE_URL}/user/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const users = await usersResponse.json()

    // Fetch pending lost items
    const pendingLostResponse = await fetch(`${API_BASE_URL}/lostfound/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const pendingLostItems = await pendingLostResponse.json()

    // Fetch pending notes
    const pendingNotesResponse = await fetch(`${API_BASE_URL}/notes/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const pendingNotes = await pendingNotesResponse.json()

    // Update stats
    const totalUsersEl = document.getElementById("totalUsers")
    const pendingApprovalsEl = document.getElementById("pendingApprovals")
    const pendingCountEl = document.getElementById("pendingCount")

    if (totalUsersEl) totalUsersEl.textContent = users.length || 0

    const totalPending = (pendingLostItems.length || 0) + (pendingNotes.length || 0)
    if (pendingApprovalsEl) pendingApprovalsEl.textContent = totalPending
    if (pendingCountEl) {
      pendingCountEl.textContent = totalPending
      pendingCountEl.style.display = totalPending > 0 ? "block" : "none"
    }
  } catch (error) {
    console.error("Error updating admin stats:", error)
  }
}

async function loadUsersManagement() {
  try {
    const token = localStorage.getItem("token")
    if (!token) return

    const response = await fetch(`${API_BASE_URL}/user/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const users = await response.json()

    const tbody = document.getElementById("usersTableBody")
    if (!tbody) return

    tbody.innerHTML = ""

    users.forEach((user) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${new Date(user.createdAt || user.joinDate).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
        </td>
      `
      tbody.appendChild(row)
    })
  } catch (error) {
    console.error("Error loading users:", error)
  }
}

async function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/admin/user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        alert("User deleted successfully")
        loadUsersManagement()
        updateAdminStats()
      } else {
        throw new Error("Failed to delete user")
      }
    } catch (error) {
      alert(error.message)
    }
  }
}

async function loadPendingApprovals() {
  try {
    const token = localStorage.getItem("token")
    if (!token) return

    // Load pending lost items
    const lostResponse = await fetch(`${API_BASE_URL}/lostfound/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const pendingLostItems = await lostResponse.json()

    // Load pending notes
    const notesResponse = await fetch(`${API_BASE_URL}/notes/pending`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const pendingNotes = await notesResponse.json()

    // Update counts
    const pendingLostCountEl = document.getElementById("pendingLostCount")
    const pendingNotesCountEl = document.getElementById("pendingNotesCount")

    if (pendingLostCountEl) pendingLostCountEl.textContent = `${pendingLostItems.length} pending`
    if (pendingNotesCountEl) pendingNotesCountEl.textContent = `${pendingNotes.length} pending`

    // Load pending lost items
    const lostItemsContainer = document.getElementById("pendingLostItems")
    if (lostItemsContainer) {
      lostItemsContainer.innerHTML = ""

      if (pendingLostItems.length === 0) {
        lostItemsContainer.innerHTML = "<p>No pending lost items.</p>"
      } else {
        pendingLostItems.forEach((item) => {
          const approvalCard = createApprovalCard(item, "lostItem")
          lostItemsContainer.appendChild(approvalCard)
        })
      }
    }

    // Load pending notes
    const notesContainer = document.getElementById("pendingNotes")
    if (notesContainer) {
      notesContainer.innerHTML = ""

      if (pendingNotes.length === 0) {
        notesContainer.innerHTML = "<p>No pending notes.</p>"
      } else {
        pendingNotes.forEach((note) => {
          const approvalCard = createApprovalCard(note, "note")
          notesContainer.appendChild(approvalCard)
        })
      }
    }
  } catch (error) {
    console.error("Error loading pending approvals:", error)
  }
}

function loadContentManagement() {
  // Implementation for content management
  console.log("Loading content management...")
}

// Approval functions
async function approveItem(itemId, type) {
  try {
    const token = localStorage.getItem("token")
    let endpoint = ""

    if (type === "lostItem") {
      endpoint = `/admin/approve/lostitem/${itemId}`
    } else if (type === "note") {
      endpoint = `/admin/approve/note/${itemId}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      alert("Item approved successfully!")
      loadPendingApprovals()
      updateAdminStats()
      updateNotificationBadge()
    } else {
      throw new Error("Failed to approve item")
    }
  } catch (error) {
    alert(error.message)
  }
}

async function rejectItem(itemId, type) {
  try {
    const token = localStorage.getItem("token")
    let endpoint = ""

    if (type === "lostItem") {
      endpoint = `/admin/reject/lostitem/${itemId}`
    } else if (type === "note") {
      endpoint = `/admin/reject/note/${itemId}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      alert("Item rejected successfully!")
      loadPendingApprovals()
      updateAdminStats()
      updateNotificationBadge()
    } else {
      throw new Error("Failed to reject item")
    }
  } catch (error) {
    alert(error.message)
  }
}

// Notification functions
async function updateNotificationBadge() {
  if (!currentUser) return

  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE_URL}/notifications/unread`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const notifications = await response.json()

    const unreadCount = notifications.length

    const notificationDot = document.getElementById("adminNotificationDot")
    if (notificationDot) {
      if (unreadCount > 0) {
        notificationDot.style.display = "block"
      } else {
        notificationDot.style.display = "none"
      }
    }
  } catch (error) {
    console.error("Error fetching notifications:", error)
  }
}

function showNotifications() {
  if (!currentUser) return

  const modal = document.getElementById("notificationModal")
  const list = document.getElementById("notificationList")

  if (!modal || !list) return

  list.innerHTML = "<p class='text-center'>Loading notifications...</p>"
  modal.style.display = "block"

  // Fetch notifications from API
  const token = localStorage.getItem("token")
  fetch(`${API_BASE_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((notifications) => {
      list.innerHTML = ""

      if (notifications.length === 0) {
        list.innerHTML = "<p class='text-center'>No notifications</p>"
      } else {
        notifications.forEach((notification) => {
          const item = document.createElement("div")
          item.className = `activity-item ${!notification.read ? "unread" : ""}`

          // Create the notification content
          const content = document.createElement("div")
          content.className = "notification-content d-flex"
          content.innerHTML = `
                    <div class="activity-icon">
                        <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${notification.message}</div>
                        <div class="activity-time">${formatTimeAgo(new Date(notification.createdAt))}</div>
                    </div>
                `

          // Add a mark as read button for unread notifications
          if (!notification.read) {
            const markReadBtn = document.createElement("button")
            markReadBtn.className = "btn btn-sm btn-outline-primary ml-auto"
            markReadBtn.innerHTML = '<i class="fas fa-check"></i>'
            markReadBtn.title = "Mark as read"
            markReadBtn.addEventListener("click", (e) => {
              e.stopPropagation() // Prevent event bubbling
              markNotificationAsRead(notification._id)
            })
            content.appendChild(markReadBtn)
          }

          item.appendChild(content)
          list.appendChild(item)
        })

        // Add a button to mark all as read if there are unread notifications
        if (notifications.some((n) => !n.read)) {
          const markAllBtn = document.createElement("button")
          markAllBtn.className = "btn btn-primary w-100 mt-3"
          markAllBtn.textContent = "Mark all as read"
          markAllBtn.addEventListener("click", markAllNotificationsAsRead)
          list.appendChild(markAllBtn)
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching notifications:", error)
      list.innerHTML = "<p class='text-center text-danger'>Error loading notifications</p>"
    })
}

async function markNotificationAsRead(notificationId) {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      console.log("Marked notification as read")
      updateNotificationBadge()
      showNotifications() // Refresh the notifications list
    }
  } catch (error) {
    console.error("Error marking notification as read:", error)
  }
}

async function markAllNotificationsAsRead() {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.ok) {
      console.log("Marked all notifications as read")
      updateNotificationBadge()
      showNotifications() // Refresh the notifications list
    }
  } catch (error) {
    console.error("Error marking notifications as read:", error)
  }
}

async function loadRecentNotifications() {
  if (!currentUser) return

  const container = document.getElementById("recentNotifications")
  if (!container) return

  container.innerHTML = "<p class='text-center'>Loading...</p>"

  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const notifications = await response.json()

    container.innerHTML = ""

    if (notifications.length === 0) {
      container.innerHTML = "<p class='text-center'>No recent activity</p>"
      return
    }

    // Display only the 5 most recent notifications
    notifications.slice(0, 5).forEach((notification) => {
      const item = document.createElement("div")
      item.className = `activity-item ${!notification.read ? "unread" : ""}`
      item.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${notification.message}</div>
                    <div class="activity-time">${formatTimeAgo(new Date(notification.createdAt))}</div>
                </div>
            `
      container.appendChild(item)
    })
  } catch (error) {
    console.error("Error fetching recent notifications:", error)
    container.innerHTML = "<p class='text-center text-danger'>Error loading notifications</p>"
  }
}

function getNotificationIcon(type) {
  switch (type) {
    case "lost-found":
      return "search-location"
    case "notes":
      return "graduation-cap"
    case "user":
      return "user"
    case "approval":
      return "check-circle"
    case "rejection":
      return "times-circle"
    case "system":
      return "cog"
    default:
      return "bell"
  }
}

function formatTimeAgo(timestamp) {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now - time) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

// Helper functions to create cards
function createItemCard(item, type) {
  const card = document.createElement("div")
  card.className = "item-card"

  let cardContent = ""

  if (type === "lost") {
    cardContent = `
            <div class="item-image">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">` : '<i class="fas fa-image fa-3x"></i>'}
            </div>
            <div class="item-content">
                <div class="item-title">${item.title}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-meta">
                    <span>📍 ${item.location}</span>
                    <span>📅 ${new Date(item.datePosted).toLocaleDateString()}</span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary btn-sm" onclick="contactUser('${item.user?.phone || "N/A"}', '${item.user?.name || "Unknown"}')">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                </div>
            </div>
        `
  } else if (type === "marketplace") {
    cardContent = `
            <div class="item-image">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">` : '<i class="fas fa-image fa-3x"></i>'}
            </div>
            <div class="item-content">
                <div class="item-title">${item.title}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-price">₹${item.price}</div>
                <div class="item-meta">
                    <span>👤 ${item.user?.name || "Unknown"}</span>
                    <span>📅 ${new Date(item.datePosted).toLocaleDateString()}</span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary btn-sm" onclick="contactUser('${item.contact}', '${item.user?.name || "Unknown"}')">
                        <i class="fas fa-phone"></i> Contact Seller
                    </button>
                </div>
            </div>
        `
  } else if (type === "notes") {
    cardContent = `
            <div class="item-image">
                <i class="fas fa-file-pdf fa-3x"></i>
            </div>
            <div class="item-content">
                <div class="item-title">${item.title}</div>
                <div class="item-description">${item.description || "No description provided"}</div>
                <div class="item-meta">
                    <span>📚 ${item.subject}</span>
                    <span>🎓 Semester ${item.semester}</span>
                    <span>👤 ${item.user?.name || "Unknown"}</span>
                    <span>📅 ${new Date(item.dateUploaded).toLocaleDateString()}</span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary btn-sm" onclick="downloadFile('${item.fileUrl}', '${item.fileName}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `
  }

  card.innerHTML = cardContent
  return card
}

function createApprovalCard(item, type) {
  const card = document.createElement("div")
  card.className = "approval-item"

  let cardContent = ""

  if (type === "lostItem") {
    cardContent = `
            <div class="approval-header">
                <div class="approval-info">
                    <h4>${item.title}</h4>
                    <p><strong>Description:</strong> ${item.description}</p>
                    <p><strong>Location:</strong> ${item.location}</p>
                    <p><strong>Posted by:</strong> ${item.user?.name || "Unknown"}</p>
                    <p><strong>Date:</strong> ${new Date(item.datePosted).toLocaleDateString()}</p>
                </div>
                <div class="approval-actions">
                    <button class="btn btn-success btn-sm" onclick="approveItem('${item._id}', 'lostItem')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="rejectItem('${item._id}', 'lostItem')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `
  } else if (type === "note") {
    cardContent = `
            <div class="approval-header">
                <div class="approval-info">
                    <h4>${item.title}</h4>
                    <p><strong>Subject:</strong> ${item.subject}</p>
                    <p><strong>Semester:</strong> ${item.semester}</p>
                    <p><strong>Description:</strong> ${item.description || "No description"}</p>
                    <p><strong>Uploaded by:</strong> ${item.user?.name || "Unknown"}</p>
                    <p><strong>Date:</strong> ${new Date(item.dateUploaded).toLocaleDateString()}</p>
                    <p><strong>File:</strong> ${item.fileName}</p>
                </div>
                <div class="approval-actions">
                    <button class="btn btn-success btn-sm" onclick="approveItem('${item._id}', 'note')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="rejectItem('${item._id}', 'note')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `
  }

  card.innerHTML = cardContent
  return card
}

// Utility functions
function contactUser(contact, userName) {
  alert(`Contact ${userName} at: ${contact}`)
}

function downloadFile(fileUrl, fileName) {
  const link = document.createElement("a")
  link.href = fileUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add loading states to buttons
function addLoadingState(button) {
  if (!button) return
  button.setAttribute("data-original-html", button.innerHTML)
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'
  button.disabled = true
  button.classList.add("loading")
}

function removeLoadingState(button, originalText) {
  if (!button) return
  button.innerHTML = button.getAttribute("data-original-html") || originalText
  button.disabled = false
  button.classList.remove("loading")
  button.removeAttribute("data-original-html")
}
