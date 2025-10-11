const Salary = require("../models/Salary");
const Staff = require("../models/Staff");
const { getMonthName } = require("../utils/helpers");

const createSalary = async (req, res) => {
  try {
    const {
      staffId,
      salaryMonth,
      salaryYear,
      amount,
      creditedDate,
      paymentMethod,
      status,
    } = req.body;
    const staff = await Staff.findById(staffId);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const existing = await Salary.findOne({ staffId, salaryMonth, salaryYear });
    if (existing) {
      return res.status(400).json({ message: "Salary has already been created" });
    }

    const salary = new Salary({
      staffId,
      salaryMonth,
      salaryYear,
      amount,
      creditedDate,
      paymentMethod,
      status,
    });
    await salary.save();
    return res.status(201).json({ message: "Salary created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const awaitingSalaries = async (req, res) => {
  try {
    const date = new Date();
    const currentMonthName = getMonthName(date.getMonth());
    console.log(currentMonthName);
    const salariedStaffIds = await Salary.find({
      salaryMonth: currentMonthName,
    }).distinct("staffId");
    const awaitingSalariesStaff = await Staff.find({
      _id: { $nin: salariedStaffIds },
    });
    res.status(200).json(awaitingSalariesStaff);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const paidSalaries = async (req, res) => {
  try {
    const date = new Date();
    const currentMonthName = getMonthName(date.getMonth());
    console.log(currentMonthName);
    const salaries = await Salary.find({
      status: "Paid",
      salaryMonth: currentMonthName,
    }).populate("staffId");
    console.log("salaries--------------", salaries);
    res.status(200).json(salaries);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const previousSalaries = async (req, res) => {
  try {
    const monthOrder = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };

    const salaries = await Salary.aggregate([
      {
        $lookup: {
          from: "staffs", // Ensure the correct collection name for Staff
          localField: "staffId",
          foreignField: "_id",
          as: "staff",
        },
      },
      { $unwind: "$staff" }, // Flatten the staff array
      {
        $group: {
          _id: { salaryMonth: "$salaryMonth", salaryYear: "$salaryYear" },
          totalAmount: { $sum: "$amount" }, // Sum salaries for the month-year
          salaries: { $push: "$$ROOT" }, // Store salaries in an array
        },
      },
      {
        $addFields: {
          monthNumber: { $getField: { field: "$_id.salaryMonth", input: monthOrder } },
        },
      },
      { $sort: { "_id.salaryYear": -1, monthNumber: -1 } }, // Sort by year (descending), then month (descending)
      { $project: { monthNumber: 0 } }, // Remove monthNumber from output
    ]);

    if (!salaries.length) {
      return res.status(404).json({ message: "No salary records found" });
    }

    res.status(200).json(salaries);
  } catch (err) {
    console.error("Error fetching salaries:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const getSalariesByQuery = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const startDate = new Date(`${year}-${month}-01T00:00:00.000+00:00`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const salaries = await Salary.find({
      creditedDate: { $gte: startDate, $lt: endDate },
    }).populate("staffId");

    res.status(200).json(salaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const getSalaryById = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id).populate("staffId");
    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }
    res.status(200).json(salary);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateSalaryById = async (req, res) => {
  try {
  } catch { }
};
module.exports = {
  createSalary,
  awaitingSalaries,
  paidSalaries,
  getSalaryById,
  updateSalaryById,
  getSalariesByQuery,
  previousSalaries
};
