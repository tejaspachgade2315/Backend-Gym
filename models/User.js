const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    age: {
      type: Number,
      default: 18,
    },
    height: {
      type: Number,
      default: 100,
    },
    weight: {
      type: Number,
      default: 50,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?[1-9]\d{9,14}$/, 'Please enter a valid phone number']
    },
    address: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      //   default: null,
      required: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    remainingAmount: {
      type: Number,
      default: 0,
    },
    activityCount: {
      type: Number,
      default: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    waCounter:{
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
