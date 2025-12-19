const express = require("express");
const protectedRoutes = require("./routes/protectedRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const aiRoutes = require("./routes/ai.routes");
const { protect } = require("./middleware/authMiddleware");




const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

console.log("Server file started");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", protect, aiRoutes);




connectDB();


// Test Route
app.get("/", (req, res) => {
  res.send("AI Expense Tracker Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

console.log("About to listen on port:", PORT);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
