const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

// GET all expenses
router.get("/", protect, getExpenses);

// ADD expense
router.post("/", protect, addExpense);

// UPDATE expense
router.put("/:id", protect, updateExpense);

// DELETE expense
router.delete("/:id", protect, deleteExpense);

module.exports = router;
