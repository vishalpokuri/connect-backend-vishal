const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();
const {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
} = require("../services/authService");

let otpStorage = {};

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  otpStorage[email] = email;
  otpStorage[password] = password;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStorage[otp] = otp;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "[Connect] Verify your Connect account",
      text: `Enter OTP: ${otp} to gain access, \n Welcome to Connect, we're so excited to create you a second brain for your connections`,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (e) {
      console.log("Error sending mail", e);
    }
    res.status(200).json({ message: "OTP sent to your email" });
    // const newUser = new User({
    //   email,
    //   password: hashPassword(password),
    // });
    // await newUser.save();

    // const accessToken = generateAccessToken(newUser._id, newUser.username);
    // const refreshToken = generateRefreshToken(newUser._id, newUser.username);

    // res.status(201).json({
    //   message: "User registered successfully",
    //   accessToken,
    //   refreshToken,
    // });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    throw error;
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (otpStorage[email] === email && otpStorage[otp] === otp) {
    console.log("Verified successfully");
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !comparePassword(password, user.password)) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const accessToken = generateAccessToken(user._id, user.username);
    const refreshToken = generateRefreshToken(user._id, user.username);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(403).json({ message: "No refresh token provided" });

  jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user.id, user.username);
    res.json({ accessToken: newAccessToken });
  });
};
