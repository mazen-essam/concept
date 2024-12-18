const FileSystem = require('./filesystem');
const TransactionManager = require('./TransactionManager');
const FinancialAnalysis = require('./FinancialAnalysis');

class Budgeting {
  constructor() {
    this.fileSystem = new FileSystem();
    this.transactionManager = new TransactionManager();
    this.financialAnalysis = new FinancialAnalysis();
  }

  // Add or update budgets
  async setBudget(data) {
    try {
      let fileData = await this.fileSystem.readFile(); // Read existing data
      let budgetFile = fileData.budgets || []; // Mutable variable for budgets

      for (let i = 0; i < data.length; i++) {
        let newBudget = data[i];
        let exists = false;

        // Check if a budget already exists for the same category and period
        for (let j = 0; j < budgetFile.length; j++) {
          if (
            budgetFile[j].category === newBudget.category &&
            budgetFile[j].period === newBudget.period
          ) {
            // Update the existing budget
            budgetFile[j].amount = newBudget.amount;
            exists = true;
            break;
          }
        }

        // If no existing budget found, add the new one
        if (!exists) {
          budgetFile.push(newBudget);
        }
      }

      // Write the updated budget data back to the file
      await this.fileSystem.writeFile(budgetFile, 'budgets');
      console.log('Budgets added or updated successfully.');
    } catch (error) {
      console.error('Error adding budget:', error.message);
    }
  }

  // Retrieve all budgets
  async getBudgets() {
    try {
      let fileData = await this.fileSystem.readFile();
      let budgetFile = fileData.budgets || []; // Mutable variable for budgets
      return budgetFile;
    } catch (error) {
      console.error('Error retrieving budgets:', error.message);
      return [];
    }
  }

  // Check budgets for a specific period
  async checkAllBudgets(period) {
    try {
      let summary = await this.financialAnalysis.getCategorySpending(period);// Transactions summary
      let budgets = await this.getBudgets(); // Get all budgets

      if (budgets.length === 0) {
        console.log('No budgets found.');
        return;
      }

      // Filter budgets for the specified period
      let periodBudgets = [];
      for (let i = 0; i < budgets.length; i++) {
        if (budgets[i].period === period) {
          periodBudgets.push(budgets[i]);
        }
      }

      if (periodBudgets.length === 0) {
        console.log(`No budgets found for the '${period}' period.`);
        return;
      }

      // Check each budget category
      for (let i = 0; i < periodBudgets.length; i++) {
        let budget = periodBudgets[i];
        let spent = summary[budget.category] || 0;

        if (spent >= budget.amount) {
          console.log(
            `Budget exceeded for ${budget.category} (${period}). Spent: ${spent}, Budget: ${budget.amount}`
          );
        } else {
          console.log(
            `Within budget for ${budget.category} (${period}). Spent: ${spent}, Budget: ${budget.amount}`
          );
        }
      }
    } catch (error) {
      console.error('Error checking budgets:', error.message);
    }
  }
}

module.exports = Budgeting;