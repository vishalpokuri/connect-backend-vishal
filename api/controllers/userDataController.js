const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.createUsername = async (req, res) => {
  const { email, username, name } = req.body;
  try {
    // Update user document with username, name, and onboardingLevel
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        username: username,
        name: name,
        onboardingLevel: 2,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error updating user" });
  }
};

exports.addSocials = async (req, res) => {};
