// routes/auth.js
const passport = require("passport");
const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/new-password", AuthController.newPasswords);

router.post("/check-exists", AuthController.checkEmailExists);

router.put("/update-user/:userId", AuthController.updateUser);
router.get("/:userId", AuthController.checkAdminStatus);
router.get("/", AuthController.getAllUsers);
router.delete("/:id", AuthController.deleteUserById);
module.exports = router;
