const Payment = require("../models/Payment");
const User = require("../models/User");
const { sendRegistrationEmail } = require("../services/mailer");
const { sendWhatsAppMessage } = require("../services/whatsapp");
const makePayment = async (req, res) => {
  const { package } = req.body;
  const gymPackage = await Package.findById(package);
  const packageItems = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: gymPackage.name,
          price: gymPackage.price,
          features: gymPackage.features,
          duration: gymPackage.duration,
        },
        unit_amount: Math.round(gymPackage.price * 100),
      },
      quantity: 1,
    },
  ];
  const session = await stripe.checkout.sessions.create({
    line_items: packageItems,
    mode: "payment",
    success_url: "",
    cancel_url: "",
  });
  // console.log(req.body);
  res.status(200).json({ id: session.id, packageItems });
};

const submitPaymentForm = async (req, res) => {
  try {
    const { userId, amount, Date, status } = req.body;
    const user = await User.findById(userId).populate("membership");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(user);
    if (status === "Paid" && user.remainingAmount === 0) {
      user.isPaid = true;
      const membershipPrice = user.membership.price;
      console.log(membershipPrice);
      if (amount > membershipPrice) {
        return res
          .status(400)
          .json({ message: "Amount is greater than membership price" });
      }
      user.remainingAmount = membershipPrice - amount;
      await user.save();
      const payment = new Payment({ userId, amount, Date, status }).populate(
        "userId"
      );
      // await sendRegistrationEmail("tejas@aeons.in", user.name);
      // await sendRegistrationEmail("gaurav@aeons.in", user.name);
      // await sendWhatsAppMessage(
      //   "+919767335965",
      //   "Thank you for registering with us. We are excited to have you on board."
      // );

      // await sendWhatsAppMessage(
      //   "+919767335965",
      //   `Hi ${user.name}, welcome to our Gym! Your registration is successful.`
      // );
      await payment.save();

      res.status(200).json({
        message: "Payment Form submitted successfully",
        payment: payment,
      });
    } else if (status === "Paid" && user.remainingAmount > 0) {
      user.isPaid = true;
      const membershipPrice = user.membership.price;
      if (amount > membershipPrice || amount > user.remainingAmount) {
        return res.status(400).json({
          message:
            "Amount is greater than membership price or remaining amount",
        });
      }

      user.remainingAmount = user.remainingAmount - amount;
      await user.save();
      const payment = new Payment({ userId, amount, Date, status });
      await payment.save();
      res.status(200).json({
        message: "Payment Form submitted successfully",
        payment: payment,
      });
    } else if (status === "Waiting") {
      const payment = new Payment({ userId, amount, Date, status });
      await payment.save();
      res.status(200).json({
        message: "Payment Form submitted successfully",
        payment: payment,
      });
    } else {
      res.status(400).json({ message: "Invalid status" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate({
      path: "userId",
      populate: {
        path: "membership",
      },
    });
    res.status(200).json(payments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const awaitingPayments = async (req, res) => {
  try {
    const payments = await User.find({
      role: "member",
      remainingAmount: { $gt: 0 }
    })
      .populate({
        path: "membership",
        select: "price name"
      })
      .select("_id name email phone startDate endDate remainingAmount");

    const totallyIncompleted = [];
    const partiallyIncompleted = [];

    payments.forEach(user => {
      if (user.membership && user.remainingAmount === user.membership.price) {
        totallyIncompleted.push(user);
      } else {
        partiallyIncompleted.push(user);
      }
    });

    res.status(200).json({
      totallyIncompleted,
      partiallyIncompleted
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const paidPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "Paid" }).populate({
      path: "userId",
      populate: {
        path: "membership",
      },
    });
    res.status(200).json(payments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate({
      path: 'userId',
      populate: {
        path: 'membership',
        model: 'Membership' // Ensure the correct model is used
      }
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(payment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const updatePaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    const { status } = req.body;
    if (status !== "Paid" && status !== "Waiting") {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (status === "Paid" && payment.status === "Paid") {
      return res.status(400).json({ message: "Payment already paid" });
    }
    if (status === "Paid" && payment.status === "Waiting") {
      const updatedPayment = await Payment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
      );
      if (!updatedPayment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      return res.status(200).json({ message: "Payment updated successfully" });
    }

    return res.status(400).json({ message: "Invalid status" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  makePayment,
  submitPaymentForm,
  getAllPayments,
  awaitingPayments,
  paidPayments,
  updatePaymentById,
  getPaymentById,
};
