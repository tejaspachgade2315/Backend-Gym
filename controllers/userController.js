const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Services
const { sendRegistrationEmail } = require("../services/mailer");
// const { sendWhatsAppMessage } = require('../services/whatsapp');
const { sendSMS } = require("../services/sms");
const { sendWhatsAppMessage } = require("../services/waapi");

// Models
const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");
const Membership = require("../models/Membership");
const Staff = require("../models/Staff");
// const Credentials = require('../models/Credentials');

// helpers
const { generatePassword } = require("../utils/helpers");

const register = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const user = await User.findById(loggedInUser.userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (loggedInUser.role !== user.role) {
      return res.status(403).send("Unauthorized");
    }

    if (user.role === "user" || user.role === "trainer") {
      return res.status(403).send("Unauthorized");
    }

    const {
      name,
      email,
      role,
      gender,
      age,
      height,
      weight,
      phone,
      address,
      startDate,
      membership,
    } = req.body;
    const image = req.file ? req.file.path : null;

    if (role === loggedInUser.role) {
      return res.status(503).json({ message: `You can't add an ${role}` });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    console.log(loggedInUser);

    const plan = await Membership.findById(membership);
    if (!plan) {
      return res.status(400).send("Membership plan not found");
    }
    const remainingAmount = plan.price;

    const generatedPassword = generatePassword();
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const registeredUser = new User({
      name,
      email,
      password: hashedPassword,
      image,
      role,
      gender,
      age,
      height,
      weight,
      phone,
      address,
      membership,
      startDate,
      remainingAmount,
    });
    if (role === "member") {
      const membershipPlan = await Membership.findById(membership);
      const start_Date = new Date(startDate);
      const endDate = new Date(start_Date);
      endDate.setDate(start_Date.getDate() + membershipPlan.duration);
      registeredUser.endDate = endDate;
    }

    if (role === "trainer") {
      registeredUser.startDate = "";
      registeredUser.endDate = "";
    }

    const adminAccount = await User.findOne({ role: "admin" });
    user.adminId = adminAccount?._id || null;
    const savedUser = await registeredUser.save();
    if (!savedUser) {
      return res
        .status(500)
        .send("User registration failed. Please try again.");
    }
    // const credentials = new Credentials({ email, password: generatedPassword });
    // await credentials.save();

    // await sendWhatsAppMessage("919767335965", `Hi ${name}, welcome to our Gym! Your registration is successful.`);
    sendWhatsAppMessage("919767335965", "Hello from WhatsApp API!");
    // await sendSMS(savedUser.phone, `Hi ${name}, welcome to our Gym! Your registration is successful.`);
    // await sendRegistrationEmail("tejas@aeons.in", name);
    res.status(201).json({
      message: "User created successfully",
      user: { ...savedUser._doc },
      creds: { password: generatedPassword },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const deleteMember = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const user = await User.findById(loggedInUser.userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (loggedInUser.role !== user.role) {
      return res.status(403).send("Unauthorized");
    }

    if (user.role === "user" || user.role === "trainer") {
      return res.status(403).send("Unauthorized");
    }

    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const registerStaff = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const user = await User.findById(loggedInUser.userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (loggedInUser.role !== user.role) {
      return res.status(403).send("Unauthorized");
    }

    if (
      user.role === "trainer" ||
      user.role === "member" ||
      user.role === "manager" ||
      user.role === "receptionist" ||
      user.role === "cleaner"
    ) {
      return res.status(403).send("Unauthorized");
    }

    const { name, email, role, gender, age, phone, hireDate, address, salary } =
      req.body;
    const image = req.file ? req.file.path : null;

    if (role === loggedInUser.role) {
      return res.status(503).json({ message: `You can't add an ${role}` });
    }

    const existingUser = await Staff.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Staff already exists");
    }
    console.log(loggedInUser);

    const generatedPassword = generatePassword();
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const registeredUser = new Staff({
      name,
      email,
      password: hashedPassword,
      image,
      role,
      gender,
      age,
      phone,
      address,
      hireDate,
      salary,
    });
    const adminAccount = await User.findOne({ role: "admin" });
    user.adminId = adminAccount?._id || null;
    const savedUser = await registeredUser.save();
    if (!savedUser) {
      return res
        .status(500)
        .send("Staff registration failed. Please try again.");
    }
    // const credentials = new Credentials({ email, password: generatedPassword });
    // await credentials.save();

    res.status(201).json({
      message: "Staff created successfully",
      user: { ...savedUser._doc },
      creds: { password: generatedPassword },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const getstafftrainers = async (req, res) => {
  try {
    const trainers = await Staff.find({
      $or: [
        { role: "trainer" },
        { role: "manager" },
        { role: "receptionist" },
        { role: "cleaner" },
      ],
    });
    res.status(200).json(trainers);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const editStafftrainers = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, gender, age, phone, address, hireDate, salary } =
      req.body;
    let image;
    if (req.body.image) {
      image = req.body.image;
    } else if (req.file) {
      image = req.file ? req.file.path : null;
    }
    const updateStaffTrainer = await Staff.findByIdAndUpdate(
      id,
      {
        name,
        email,
        role,
        gender,
        age,
        phone,
        address,
        hireDate,
        salary,
        image,
      },
      { runValidators: true, new: true }
    );
    if (!updateStaffTrainer) {
      return res.status(404).send("Trainer not found");
    }
    res.status(200).json(updateStaffTrainer);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const deleteStaffTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStaffTrainer = await Staff.findByIdAndDelete(id);
    if (!deletedStaffTrainer) {
      return res.status(404).send("Trainer not found");
    }
    res.status(200).json({ message: "Trainer deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const getStaffTrainerById = async (req, res) => {
  try {
    const { id } = req.params;
    const staffTrainer = await Staff.findById(id);
    if (!staffTrainer) {
      return res.status(404).send("Trainer not found");
    }
    res.status(200).json(staffTrainer);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};
const getInactiveMembers = async (req, res) => {
  try {
    const date = new Date();

    const members = await User.find({
      $or: [
        // {
        //   role: "member",
        //   isActive: false,
        // },
        { role: "member", endDate: { $lt: date } }, // Fixing the date comparison syntax
      ],
    }).populate("membership");

    res.status(200).json(members);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const activateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await User.findById(id);
    member.isActive = true;
    await member.save();
    res.status(200).json({ message: "Member activated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const date = new Date();
    const users = await User.find({ role: "member", endDate: { $gte: date } }).populate(
      "membership"
    );
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.password = undefined;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    staff.password = undefined;
    if (!staff) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(staff);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserInfo = async (req, res) => {
  try {
    console.log(req.user);
    const user = req.user;
    const userInfo = await User.findById(user.userId).select("-password");

    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    const messageLimit = process.env.WALIMIT - userInfo.waCounter;
    if (messageLimit <= 0) {
      userInfo.waCounter = 0;
      await userInfo.save();
    }
    res.status(200).json({ userInfo, messageLimit, totalwalimit: Number(process.env.WALIMIT) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const {
      name,
      email,
      age,
      height,
      weight,
      phone,
      address,
      startDate,
      membership,
      isActive,
      gender,
    } = req.body;
    let image;
    if (req.body.image) {
      image = req.body.image;
    } else if (req.file) {
      image = req.file ? req.file.path : null;
    }

    const membershipPlan = await Membership.findById(membership);
    const start_Date = new Date(startDate);
    const endDate = new Date(startDate);
    endDate.setDate(start_Date.getDate() + membershipPlan.duration);
    const remainingAmount = membershipPlan.price;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        age,
        gender,
        height,
        weight,
        phone,
        address,
        startDate,
        membership,
        image,
        isActive,
        endDate,
        remainingAmount,
      },
      { runValidators: true, new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = req.user;
    const userInfo = await User.findById(user.userId);
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    const {
      name,
      email,
      image,
      role,
      gender,
      age,
      height,
      weight,
      phone,
      address,
      password,
      trainerId,
      userId,
    } = req.body;

    if (user.role === "admin" && trainerId && userId && trainerId !== userId) {
      const userToUpdate = await User.findById(userId);
      const trainer = await User.findById(trainerId);

      if (!userToUpdate || !trainer) {
        return res
          .status(400)
          .json({ error: "No user or trainer found in the list!!!" });
      }

      userToUpdate.trainerId = trainer.id;
      await userToUpdate.save();
      return res.status(201).json({ message: "User updated successfully" });
    } else if (
      user.role === "trainer" &&
      trainerId &&
      userId &&
      trainerId !== userId
    ) {
      return res.status(400).json({ error: "You can't update the trainer" });
    } else if (
      user.role === "user" &&
      trainerId &&
      userId &&
      trainerId !== userId
    ) {
      return res.status(400).json({ error: "You can't update the trainer" });
    } else {
      if (email) {
        return res.status(400).json({ error: "You can't update the email" });
      } else if (role) {
        return res.status(400).json({ error: "You can't update the role" });
      }

      let hashedPassword = userInfo.password;

      if (password) {
        hashedPassword = await bcrypt.hash(password, 12);
      }

      userInfo.name = name || userInfo.name;
      userInfo.image = image || userInfo.image;
      userInfo.gender = gender || userInfo.gender;
      userInfo.age = age || userInfo.age;
      userInfo.height = height || userInfo.height;
      userInfo.weight = weight || userInfo.weight;
      userInfo.phone = phone || userInfo.phone;
      userInfo.address = address || userInfo.address;
      userInfo.password = hashedPassword;

      // Credentials.findOne({ email: userInfo.email }).then((credentials) => {
      //     if (credentials) {
      //         credentials.password = hashedPassword;
      //         credentials.save();
      //     }
      // });

      await userInfo.save();
      return res.status(200).json({ message: "Updated successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
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
    const isMatch = await bcrypt.compare(oldPassword, userInfo.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    userInfo.password = hashedPassword;
    await userInfo.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = new PasswordResetToken({
      userId: user._id,
      token,
      createdAt: new Date(),
    });
    await passwordResetToken.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset",
      text: `You requested for a password reset. Please use the following token to reset your password: ${token}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset token sent to email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        error: "Missing password, confirmPassword or token",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }

    const passwordResetToken = await PasswordResetToken.findOne({
      token,
      createdAt: { $gt: new Date(Date.now() - 30 * 60 * 1000) },
      resetAt: null,
    });

    if (!passwordResetToken) {
      return res.status(400).json({
        error: "Invalid token",
      });
    }

    const user = await User.findById(passwordResetToken.userId);

    if (!user) {
      return res.status(400).json({
        error: "Invalid token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
    await PasswordResetToken.findByIdAndUpdate(passwordResetToken._id, {
      resetAt: new Date(),
    });

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllReceptionists = async (req, res) => {
  try {
    const users = await User.find({ role: "receptionist" });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllTrainers = async (req, res) => {
  try {
    const users = await Staff.find({ role: "trainer" });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const generateQRCode = async (req, res) => {
  try {
    const user = req.user;
    const userInfo = await User.findById(user.userId);
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    const qrCode = await qrcode.toDataURL(userInfo.email);
    res.status(200).json({ qrCode });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  register,
  getAllUsers,
  getUserById,
  getUserInfo,
  updateUser,
  updateUserById,
  changePassword,
  resetPassword,
  requestPasswordReset,
  getAllReceptionists,
  getAllMembers,
  getAllTrainers,
  generateQRCode,
  registerStaff,
  getstafftrainers,
  deleteMember,
  getInactiveMembers,
  activateMember,
  deleteStaffTrainer,
  getStaffTrainerById,
  editStafftrainers,
};
