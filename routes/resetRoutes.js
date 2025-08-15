const express = require("express");
const router = express.Router();
const resetController = require("../controllers/resetController");

// Route to send verification code
router.post("/send-verification-code", resetController.sendVerificationCode);
router.post("/verify-code", resetController.verifyCode);
module.exports = router;
