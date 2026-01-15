const Expense = require("../models/Expense");
const mongoose = require("mongoose");


exports.getTotalExpense = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const result = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$amount" } }, // 🔥 FIX
        },
      },
    ]);

    res.json({ total: result[0]?.total || 0 });
  } catch (error) {
    console.error("getTotalExpense error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getCategoryWiseExpense = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const result = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: { $toDouble: "$amount" } }, // 🔥 FIX
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json(result);
  } catch (error) {
    console.error("getCategoryWiseExpense error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getMonthlyExpense = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const result = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: { $toDouble: "$amount" } }, // 🔥 FIX
        },
      },
      { $sort: { _id: 1 } },
    ]);

  )
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];

    const formatted = result.map((item) => ({
      _id: monthNames[item._id - 1],
      total: item.total,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("getMonthlyExpense error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
