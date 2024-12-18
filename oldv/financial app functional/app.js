const { importData, exportData } = require("./filesystem");
const { calculateTotals, summarizeByCategory } = require("./analytics");
const { calculateSavingsRecommendation } = require("./savingsGoals");
const { checkBudget } = require("./budgeting");
const { addTransaction, filterTransactions } = require("./expenseTracker");

// File path
const filePath = "./transactions.json";

// Import transactions
let transactions = importData(filePath);

// Side effect: Adding a new transaction
console.log("Adding a new transaction...");
addTransaction(transactions, { date: "2024-06-18", type: "expense", category: "Food", amount: 70 });

// Calculate totals
const totals = calculateTotals(transactions);
console.log("\n--- Totals ---");
console.log("Total Income:", totals.totalIncome);
console.log("Total Expenses:", totals.totalExpenses);

// Summarize by category
const summary = summarizeByCategory(transactions);
console.log("\n--- Summary by Category ---");
for (const [category, total] of Object.entries(summary)) {
  console.log(`${category}: $${total}`);
}

// Check budget warnings
const budgets = { Food: 100, Rent: 1200 };
const warnings = checkBudget(transactions, budgets);
console.log("\n--- Budget Warnings ---");
warnings.forEach((warning) => console.log(warning));

// Filter expenses
console.log("\n--- Filtering Expenses ---");
const expenses = filterTransactions(transactions, (t) => t.type === "expense");
expenses.forEach((expense) => console.log(expense));

// Calculate savings recommendation
const monthlySavings = calculateSavingsRecommendation(5000, 10, 1000);
console.log("\n--- Savings Recommendation ---");
console.log(`You need to save $${monthlySavings} per month to reach your goal.`);

// Export updated transactions
exportData(filePath, transactions);

