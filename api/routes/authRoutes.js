// routes/authRoutes.js
const express = require("express");
const {
  signup,
  login,
  refreshToken,
  verifyOTP,
} = require("../controllers/authController");
const { validateSignup } = require("../middleware/validateMiddleware");
const router = express.Router();

router.post("/signup", signup);
router.post("/verifyotp", verifyOTP);
router.post("/login", login);
router.post("/token/refresh", refreshToken);

module.exports = router;
