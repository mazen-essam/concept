// Calculate total income and expenses
const calculateTotals = (transactions) => {
  let totals = { totalIncome: 0, totalExpenses: 0 }; // Mutable state
  for (let i = 0; i < transactions.length; i++) {
    const { type, amount } = transactions[i];
    if (type === "income") totals.totalIncome += amount;
    else if (type === "expense") totals.totalExpenses += amount;
  }
  return totals;
};

// Summarize transactions by category
const summarizeByCategory = (transactions) => {
  const summary = {}; // Mutable state
  for (const transaction of transactions) {
    const { category, amount } = transaction;
    summary[category] = (summary[category] || 0) + amount;
  }
  return summary;
};

module.exports = { calculateTotals, summarizeByCategory };
