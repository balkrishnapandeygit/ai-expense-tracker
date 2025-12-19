const express = require("express");
const {
  getTotalExpense,
  getCategoryWiseExpense,
  getMonthlyExpense,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/total", protect, getTotalExpense);
router.get("/category", protect, getCategoryWiseExpense);
router.get("/monthly", protect, getMonthlyExpense);

module.exports = router;
