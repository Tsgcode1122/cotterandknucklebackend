const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

// Route to send verification code
router.post("/send-verification-code", emailController.sendVerificationCode);
router.post("/verify-code", emailController.verifyCode);
router.post("/subscribe", emailController.Subscribe);
module.exports = router;
router.post("/formSubmission", emailController.formSubmission);
router.post("/inquirySubmission", emailController.inquirySubmission);
