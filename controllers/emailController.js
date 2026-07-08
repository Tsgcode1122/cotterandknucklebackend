const express = require("express");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const generateVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

exports.formSubmission = async (req, res) => {
  const { name, email, number, message } = req.body;

  try {
    await resend.emails.send({
      from: "Cotter and Knuckle <noreply@noreply.com.ng>",
       to: ["gemluxemedspa@gmail.com"],
      subject: "New Inquiry Received", 
      text: `
Hello, you just received an inquiry form from ${name}.

Email: ${email}
Phone-Number: ${number}
Message: ${message}
      `,
      html: `
        <p>Hello, you just received an inquiry form from <strong>${name}</strong>.</p>
        <p>Here are the details:</p>
        <ul>
          <li>Email: ${email}</li>
          <li>Phone-Number: ${number}</li>
          <li>Message: ${message}</li>
        </ul>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send inquiry email",
    });
  }
};

exports.inquirySubmission = async (req, res) => {
  const {
    name,
    companyName,
    streetAddress,
    state,
    city,
    email,
    number,
    engineSerialNumber,
    services,
    message,
  } = req.body;

  try {
    await resend.emails.send({
      from: "Cotter and Knuckle <noreply@noreply.com.ng>",
       to: ["gemluxemedspa@gmail.com"],
      subject: "New Inquiry Received",
      text: `
Hello, you just received an inquiry form from ${name}.

Name: ${name}
Company Name: ${companyName}
Street Address: ${streetAddress}
City: ${city}
State: ${state}
Email: ${email}
Phone Number: ${number}
Engine Serial Number: ${engineSerialNumber}
Services: ${services}
Message: ${message}
      `,
      html: `
        <p>Hello, you just received an inquiry form from <strong>${name}</strong>.</p>
        <p><strong>Here are the details:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Company Name:</strong> ${companyName}</li>
          <li><strong>Street Address:</strong> ${streetAddress}</li>
          <li><strong>City:</strong> ${city}</li>
          <li><strong>State:</strong> ${state}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone Number:</strong> ${number}</li>
          <li><strong>Engine Serial Number:</strong> ${engineSerialNumber}</li>
          <li><strong>Services:</strong> ${services}</li>
          <li><strong>Message:</strong> ${message}</li>
        </ul>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Inquiry sent successfully",
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send inquiry email",
    });
  }
};

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    const verify = generateVerificationCode();
    const token = jwt.sign({ verify }, process.env.JWT_SECRET);

    await resend.emails.send({
      from: process.env.MAIL_SENDER,
      to: email,
      subject: "Email Verification Code",
      text: `Your verification code is: ${verify}`,
      html: `Your verification code is: <strong>${verify}</strong>`,
    });

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
      token,
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const verification = decoded.verify;

    if (verificationCode === verification) {
      return res.json({ success: true });
    }

    res.json({ success: false });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify code",
    });
  }
};

exports.Subscribe = async (req, res) => {
  const { email } = req.body;

  try {
    await resend.emails.send({
       from: "Cotter and Knuckle <noreply@noreply.com.ng>",
       to: ["gemluxemedspa@gmail.com"],
      subject: "New Subscription Request",
      text: `Dear Admin, you have a new subscriber: ${email}`,
      html: `
        <p>Dear Admin,</p>
        <p>You have a new subscriber: <strong>${email}</strong></p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Subscription request received",
    });
  } catch (error) {
    console.error("Error processing subscription request:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process subscription request",
    });
  }
};