// controllers/AuthController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Register a new user
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Convert email to lowercase
    const lowerCaseEmail = email.toLowerCase();

    // Create a new user
    const newUser = new User({
      fullName,
      email: lowerCaseEmail,
      phoneNumber,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Controller function to check if email exists
exports.checkEmailExists = async (req, res) => {
  const { email } = req.body;

  try {
    const lowerCaseEmail = email.toLowerCase();
    // Check if the email exists in the database
    const user = await User.findOne({ email: lowerCaseEmail });
    const exists = !!user;

    res.status(200).json({ exists });
  } catch (error) {
    res.status(500).json({ error: "Failed to check email existence" });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    // Check if the user exists
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email address" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return user data along with the token
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const lowerCaseEmail = email.toLowerCase();
    // Check if the user exists
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "reset sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.newPasswords = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const lowerCaseEmail = email.toLowerCase();
    // Check if the user exists
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Send a response
    res.status(200).json({ message: "password change successffully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
// controllers/AuthController.js

// Update user information
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, image } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's information
    if (fullName) user.fullName = fullName;
    if (image) user.image = image;

    // Save the updated user to the database
    await user.save();

    res
      .status(200)
      .json({ message: "User information updated successfully", user });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// controllers/AdminController.js

exports.checkAdminStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is an admin
    if (user.isAdmin) {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res.status(200).json({ isAdmin: false });
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Get all user data
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Delete user by ID
exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
