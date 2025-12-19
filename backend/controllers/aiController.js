const OpenAI = require("openai");
const Expense = require("../models/Expense");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.getAIInsight = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });

    if (expenses.length === 0) {
      return res.json({
        insight: "Start adding expenses to get AI-powered insights.",
      });
    }

    let categoryTotals = {};
    let total = 0;

    expenses.forEach((e) => {
      categoryTotals[e.category] =
        (categoryTotals[e.category] || 0) + e.amount;
      total += e.amount;
    });

    const topCategory = Object.keys(categoryTotals).reduce((a, b) =>
      categoryTotals[a] > categoryTotals[b] ? a : b
    );

    const prompt = `
User expense summary:
Total spending: ₹${total}
Top category: ${topCategory}
Category breakdown: ${JSON.stringify(categoryTotals)}

Give 1 short, friendly financial advice (max 2 lines).
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      insight: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI Insight error:", error);
    res.status(500).json({
      insight: "AI service temporarily unavailable.",
    });
  }
};
