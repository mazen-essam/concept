const addSavingsGoal = (state, goal) => ({
    ...state,
    savingsGoals: [...state.savingsGoals, goal],
  });
  
  const getSavingsGoals = (state) => state.savingsGoals;
  
  const calculateMonthlySavings = (state, goalName) => {
    const goal = state.savingsGoals.find((g) => g.name === goalName);
    if (!goal) {
      console.log('Savings goal not found.');
      return;
    }
  
    const now = Date.now();
    const remainingTime = goal.targetDate - now;
  
    if (remainingTime <= 0) {
      console.log('Target date has already passed.');
      return;
    }
  
    const months = remainingTime / (30 * 24 * 60 * 60 * 1000); // Approximation
    const monthlySavings = goal.amount / months;
    console.log(`You need to save $${monthlySavings.toFixed(2)} per month to reach your goal.`);
  };
  
  module.exports = { addSavingsGoal, getSavingsGoals, calculateMonthlySavings };