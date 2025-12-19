const Expense = require("../models/Expense");

// GET
const getExpenses = async (req, res) => {
  try {
    console.log("Getting expenses for user:", req.user.id);
    const expenses = await Expense.find({ user: req.user.id });
    console.log("Found expenses:", expenses.length, expenses);
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADD
const addExpense = async (req, res) => {
  try {
    console.log("Adding expense for user:", req.user.id, "body:", req.body);
    const { title, amount, category, date } = req.body;

    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount: Number(amount),
      category,
      date: date ? new Date(date) : new Date(),
    });

    console.log("Expense created:", expense);
    res.status(201).json(expense);
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
const updateExpense = async (req, res) => {
  try {
    console.log("Updating expense:", req.params.id, "body:", req.body);
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updateBody = { ...req.body };
    if (updateBody.amount !== undefined) {
      updateBody.amount = Number(updateBody.amount);
    }

    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      updateBody,
      { new: true }
    );

    console.log("Expense updated:", updated);
    res.json(updated);
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE
const deleteExpense = async (req, res) => {
  try {
    console.log("Deleting expense:", req.params.id);
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await expense.deleteOne();
    console.log("Expense deleted:", req.params.id);
    res.json({ message: "Expense removed" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
};
