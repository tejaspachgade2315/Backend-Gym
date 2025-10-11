const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { updateStreak } = require("../services/streakService");
const { checkEquality, decryptPassword, encryptPassword } = require("../utils/helpers");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const isMatch = checkEquality(password, decryptPassword(user.password));
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    if (user.role !== 'admin') {
      return res.status(403).send("Unauthorized");
    }

    // await updateStreak(user._id);
    const tokenData = {
      userId: user._id,
      role: user.role,
      email: user.email,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

    const refreshToken = jwt.sign(tokenData, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    const response = {
      message: "Login successful",
      success: true,
      token,
      refreshToken,
    };

    res.setHeader("Authorization", "Bearer " + token);
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};
const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send("Logout successful");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const changePassword = async (req, res) => {
  try {
    const user = req.user;
    const userInfo = await User.findById(user.userId);
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    const { oldPassword, newPassword } = req.body;
    const isMatch = checkEquality(oldPassword, decryptPassword(userInfo.password));
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const hashedPassword = encryptPassword(newPassword);
    userInfo.password = hashedPassword;
    await userInfo.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
module.exports = { login, logout, changePassword };
