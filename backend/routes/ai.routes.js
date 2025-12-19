const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const { protect } = require("../middleware/authMiddleware");

router.get("/insight", protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });

    if (expenses.length === 0) {
      return res.json({ insight: "Start adding expenses to get AI insights." });
    }

    const categoryMap = {};
    let total = 0;

    expenses.forEach((e) => {
      total += Number(e.amount);
      categoryMap[e.category] =
        (categoryMap[e.category] || 0) + Number(e.amount);
    });

    const topCategory = Object.keys(categoryMap).reduce((a, b) =>
      categoryMap[a] > categoryMap[b] ? a : b
    );

    const percentage = Math.round(
      (categoryMap[topCategory] / total) * 100
    );

    res.json({
      insight: `You spend ${percentage}% on ${topCategory}.`,
    });
  } catch (err) {
    console.error("AI insight error:", err);
    res.status(500).json({ message: "Insight failed" });
  }
});

module.exports = router;
