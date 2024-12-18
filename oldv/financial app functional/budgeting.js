// Check if transactions exceed budgets
const checkBudget = (transactions, budgets) => {
  const warnings = []; // Mutable state
  for (const transaction of transactions) {
    const { category, amount } = transaction;
    if (budgets[category] && amount > budgets[category]) {
      warnings.push(`Warning: Budget exceeded for ${category} by ${amount - budgets[category]}`);
    }
  }
  return warnings;
};

module.exports = { checkBudget };
