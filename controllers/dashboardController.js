const User = require("../models/User");
const Staff = require("../models/Staff");
const Payment = require("../models/Payment");
const Salary = require("../models/Salary");
const Membership = require("../models/Membership");
const fetchDashboard = async (req, res) => {
  try {
    const date = new Date();
    const totalMembers = await User.countDocuments({ role: "member" });
    const totalActiveMembers = await User.countDocuments({
      role: "member",
      endDate: { $gte: date },
    });
    const totalInactiveMembers = await User.countDocuments({
      role: "member",
      endDate: { $lt: date },
    });
    const totalTrainers = await Staff.countDocuments({
      role: "trainer",
      isActive: true,
    });
    const totalCleaners = await Staff.countDocuments({
      role: "cleaner",
      isActive: true,
    });

    const membershipIds = await Membership.find({ isActive: true }).distinct(
      "_id"
    );
    console.log("membershipIds", membershipIds);

    const usersByMembership = await Membership.aggregate([
      {
        $match: {
          _id: { $in: membershipIds },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "membership",
          as: "users",
        },
      },
      {
        $addFields: {
          activeCount: {
            $size: {
              $filter: {
                input: "$users",
                as: "user",
                cond: { $eq: ["$$user.isActive", true] },
              },
            },
          },
          inactiveCount: {
            $size: {
              $filter: {
                input: "$users",
                as: "user",
                cond: { $eq: ["$$user.isActive", false] },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          membershipDetails: "$$ROOT",
          activeCount: 1,
          inactiveCount: 1,
        },
      },
    ]);
    console.log("membershipIds", usersByMembership);
    const today = new Date();
    today.setDate(1);

    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        count: 0,
      });
    }

    const usersByMonth = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(today.getFullYear(), today.getMonth() - 11, 1),
          },
          role: "member",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const usersByMonthGraphData = months.map((month) => {
      const match = usersByMonth.find(
        (entry) =>
          entry._id.year === month.year && entry._id.month === month.month
      );
      return match ? { ...month, count: match.count } : month;
    });

    const todays = new Date();
    const firstDayOfLastMonth = new Date(
      todays.getFullYear(),
      todays.getMonth() - 1,
      1
    );
    const lastDayOfLastMonth = new Date(
      todays.getFullYear(),
      todays.getMonth(),
      0,
      23,
      59,
      59
    );

    const result = await Payment.aggregate([
      {
        $facet: {
          totalRevenue: [
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          lastMonthRevenue: [
            {
              $match: {
                status: "Paid",
                createdAt: {
                  $gte: firstDayOfLastMonth,
                  $lte: lastDayOfLastMonth,
                },
              },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
          waitingPayments: [
            { $match: { status: "Waiting" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ],
        },
      },
    ]);

    const totalRevenue =
      result[0].totalRevenue.length > 0 ? result[0].totalRevenue[0].total : 0;
    const lastMonthRevenue =
      result[0].lastMonthRevenue.length > 0
        ? result[0].lastMonthRevenue[0].total
        : 0;
    const waitingPayments =
      result[0].waitingPayments.length > 0
        ? result[0].waitingPayments[0].total
        : 0;
    return res.status(200).json({
      totalMembers,
      totalActiveMembers,
      totalInactiveMembers,
      totalTrainers,
      totalCleaners,
      usersByMembership,
      usersByMonthGraphData,
      totalRevenue,
      lastMonthRevenue,
      waitingPayments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { fetchDashboard };
