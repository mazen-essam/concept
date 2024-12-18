const setBudget = (state, budget) => ({
    ...state,
    budgets: [...state.budgets, budget],
  });
  
  const getBudgets = (state) => state.budgets;
  
  const checkBudgetExceeded = (state, category, period) => {
    const budget = state.budgets.find((b) => b.category === category && b.period === period);
    if (!budget) {
      console.log('No budget found for the specified category and period.');
      return;
    }
    
    const totalSpent = state.transactions
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  
    if (totalSpent > budget.amount) {
      console.log(`Budget exceeded for ${category} (${period}). Total spent: ${totalSpent}, Budget: ${budget.amount}`);
    } else {
      console.log(`Budget within limits for ${category} (${period}). Total spent: ${totalSpent}, Budget: ${budget.amount}`);
    }
  };
  
  module.exports = { setBudget, getBudgets, checkBudgetExceeded };