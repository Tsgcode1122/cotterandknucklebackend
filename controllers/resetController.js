const nodemailer = require("nodemailer");
const express = require("express");
const jwt = require("jsonwebtoken"); // Import JWT module
require("dotenv").config();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate random verification code
const generateVerificationCode = () => {
  // Generate a random alphanumeric code
  const code = Math.random().toString(36).substr(2, 6).toUpperCase();
  return code;
};

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    // Generate a new verification code
    const verify = generateVerificationCode();

    // Create a JWT containing the verification code
    const token = jwt.sign({ verify }, process.env.JWT_SECRET);

    // Send the verification code token to the user's email
    await transporter.sendMail({
      from: process.env.MAIL_SENDER,
      to: email,
      subject: "Email Verification Code",
      text: `Your reset password  is: ${verify}`,
      html: `hello you requested to change your password, input this code in your reset: <strong>${verify}</strong>`,
    });

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
      token: token, // Include the token in the response
    });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification code",
    });
  }
};

exports.verifyCode = async (req, res) => {
  const { verificationCode, token } = req.body;

  try {
    // Decode the JWT to extract the verification code
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const verification = decoded.verify;

    // Compare the provided code with the verification code
    const success = verificationCode === verification;

    if (success) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ success: false, message: "Failed to verify code" });
  }
};
