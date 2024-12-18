const readline = require('readline');
const { addTransaction, getTransactions } = require('./TransactionManager');
const { setBudget, getBudgets, checkBudgetExceeded } = require('./Budgeting');
const { addSavingsGoal, getSavingsGoals, calculateMonthlySavings } = require('./SavingsGoals');
const { analyzeIncomeVsExpenses, generateSpendingInsights } = require('./FinancialAnalysis');
const { saveState, loadState } = require('./utils');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Utility function for user input
const prompt = (question) =>
  new Promise((resolve) => {
    rl.question(question, resolve);
  });

// Main menu
async function mainMenu(currentState) {
  console.log(`
    === Financial Management System ===
    1. Add Transaction
    2. View Transactions
    3. Set Budget
    4. View Budgets
    5. Set Savings Goal
    6. View Savings Goals
    7. Analyze Income vs Expenses
    8. Spending Trends Insights
    9. Calculate Monthly Savings to Achieve Goal
    10. Exit
  `);

  const choice = await prompt('Select an option: ');

  switch (choice) {
    case '1': {
      const newState = await addTransactionPrompt(currentState);
      await saveState(newState);
      return mainMenu(newState);
    }
    case '2': {
      viewTransactions(currentState);
      return mainMenu(currentState);
    }
    case '3': {
      const newState = await setBudgetPrompt(currentState);
      await saveState(newState);
      return mainMenu(newState);
    }
    case '4': {
      viewBudgets(currentState);
      return mainMenu(currentState);
    }
    case '5': {
      const newState = await setSavingsGoalPrompt(currentState);
      await saveState(newState);
      return mainMenu(newState);
    }
    case '6': {
      viewSavingsGoals(currentState);
      return mainMenu(currentState);
    }
    case '7': {
      analyzeIncomeVsExpenses(currentState);
      return mainMenu(currentState);
    }
    case '8': {
      generateSpendingInsights(currentState);
      return mainMenu(currentState);
    }
    case '9':{
        viewMonthlySavingsToAchieveGoal(currentState);
        return mainMenu(currentState);
    }
    case '10': 
      console.log('Goodbye!');
      rl.close();
      break;
    default:
      console.log('Invalid choice. Please try again.');
      return mainMenu(currentState);
  }
}

// Prompts for adding a transaction
async function addTransactionPrompt(currentState) {
  const date = await prompt('Enter transaction date (YYYY-MM-DD): ');
  const category = await prompt('Enter transaction category: ');
  const amount = parseFloat(await prompt('Enter transaction amount: '));
  const description = await prompt('Enter transaction description: ');

  const transaction = { date, category, amount, description };
  const updatedState = addTransaction(currentState, transaction);
  console.log('Transaction added successfully!');
  return updatedState;
}

async function viewMonthlySavingsToAchieveGoal(state) {
    if (state.savingsGoals.length === 0) {
        console.log('No savings goals set. Please set a goal first.');
        return;
    }

    console.log('Select a savings goal to calculate monthly savings:');
    state.savingsGoals.forEach((goal, index) => {
        console.log(`${index + 1}. ${goal.name} - Target Amount: $${goal.amount}, Target Date: ${new Date(goal.targetDate).toLocaleDateString()}`);
    });

    const choice = await prompt('Enter the number of the savings goal: ');
    const index = Number(choice); // Convert to a number

    // Validate the user's input
    if (isNaN(index) || index < 1 || index > state.savingsGoals.length) {
        console.log('Invalid selection.');
        return;
    }

    const selectedGoal = state.savingsGoals[index - 1]; // Correct the 1-based index

    // Call the function with the correct arguments
    calculateMonthlySavings(state, selectedGoal.name);
}

// View transactions
function viewTransactions(currentState) {
  const transactions = getTransactions(currentState);
  console.log('Transactions:', JSON.stringify(transactions, null, 2));
}

// Prompts for setting a budget
async function setBudgetPrompt(currentState) {
  const category = await prompt('Enter budget category: ');
  const period = await prompt('Enter budget period (e.g., monthly, weekly): ');
  const amount = parseFloat(await prompt('Enter budget amount: '));

  const budget = { category, period, amount };
  const updatedState = setBudget(currentState, budget);
  console.log('Budget set successfully!');
  return updatedState;
}

// View budgets
function viewBudgets(currentState) {
  const budgets = getBudgets(currentState);
  console.log('Budgets:', JSON.stringify(budgets, null, 2));
}

// Prompts for setting a savings goal
async function setSavingsGoalPrompt(currentState) {
  const name = await prompt('Enter goal name: ');
  const amount = parseFloat(await prompt('Enter goal amount: '));
  const targetDate = new Date(await prompt('Enter target date (YYYY-MM-DD): ')).getTime();

  const goal = { name, amount, targetDate };
  const updatedState = addSavingsGoal(currentState, goal);
  console.log('Savings goal set successfully!');
  return updatedState;
}

// View savings goals
function viewSavingsGoals(currentState) {
  const savingsGoals = getSavingsGoals(currentState);
  console.log('Savings Goals:', JSON.stringify(savingsGoals, null, 2));
}

// Start the app
(async () => {
  const initialState = await loadState();
  await mainMenu(initialState);
})();