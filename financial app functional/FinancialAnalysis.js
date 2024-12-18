const analyzeIncomeVsExpenses = (state) => {
    const totalIncome = state.income.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = state.transactions.reduce((sum, t) => sum + t.Amount, 0);
  
    console.log(`Total Income: $${totalIncome.toFixed(2)}`);
    console.log(`Total Expenses: $${totalExpenses.toFixed(2)}`);
  
    if (totalIncome > totalExpenses) {
        console.log(`You have a surplus of $${totalIncome - totalExpenses}.`);
    } else if (totalIncome < totalExpenses) {
      console.log('You have a deficit!');
    } else {
      console.log('Your income matches your expenses.');
    }
  };
  
  const generateSpendingInsights = (state) => {
    const categoryTotals = state.transactions.reduce((totals, t) => {
      if (!totals[t.Category]) {
        totals[t.Category] = 0;
      }
      totals[t.Category] += t.Amount;
      return totals;
    }, {});
  
    console.log('Spending insights:');
    Object.entries(categoryTotals).forEach(([category, total]) => {
      console.log(`Category: ${category}, Total Spent: $${total.toFixed(2)}`);
    });
  };
  
  module.exports = { analyzeIncomeVsExpenses, generateSpendingInsights };
  