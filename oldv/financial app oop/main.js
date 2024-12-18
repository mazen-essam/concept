const readline = require('readline');
const TransactionManager = require('./TransactionManager');
const Budgeting = require('./Budgeting');
const SavingsGoals = require('./saving');
const FinancialAnalysis = require('./FinancialAnalysis');

class FinancialManagementSystem {
  constructor() {
    this.transactionManager = new TransactionManager();
    this.financialAnalysis = new FinancialAnalysis(this.transactionManager);
    this.budgeting = new Budgeting();
    this.savingsGoals = new SavingsGoals();
    this.incomes = []; // Example: Stores income data
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  // Utility function to prompt the user
  prompt(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  // Main menu logic
  async mainMenu() {
    console.log(`
      === Financial Management System ===
      1. Add Transaction
      2. View Transactions
      3. Set Budget
      4. View Budgets
      5. Set Savings Goal
      6. View Savings Goals
      7. Set Income
      8. View Incomes
      9. Analyze Income vs Expenses
      10. Summary for each category in transactions
      11. Monthly Saving to achieve the goal
      12. Check budget exceeded
      13. Spending trends insights
      14. Exit
    `);

    const choice = await this.prompt('Select an option: ');

    switch (choice) {
      case '1':
        await this.addTransaction();
        break;
      case '2':
        await this.viewTransactions();
        break;
      case '3':
        await this.setBudget();
        break;
      case '4':
        await this.viewBudgets();
        break;
      case '5':
        await this.setSavingsGoal();
        break;
      case '6':
        await this.viewSavingsGoals();
        break;
      case '7':
        await this.setIncome();
        break;
      case '8':
        await this.viewIncomes();
        break;
      case '9':
        await this.analyzeIncomeVsExpenses();
        break;
      case '10':
        await this.analyzeSpendingTrends();
        break;
      case '11':
        await this.monthlysaving();
        break;
      case '12':
        await this.budgetalert();
        break;
      case '13':
        await this.insightstrend();
        break;
      case '14':
        console.log('Goodbye!');
        this.rl.close();
        return;
      default:
        console.log('Invalid choice. Please try again.');
    }

    // Loop back to main menu
    await this.mainMenu();
  }

  // Example: Adding a Transaction
  async addTransaction() {
    const date = await this.prompt('Enter transaction date (YYYY-MM-DD): ');
    const category = await this.prompt('Enter transaction category: ');
    const amount = parseFloat(await this.prompt('Enter transaction amount: '));
    const description = await this.prompt('Enter transaction description: ');

    const transaction = [
      { Date: date, Category: category, Amount: amount, Description: description },
    ];
    await this.transactionManager.addTransaction(transaction);
    console.log('Transaction added successfully!');
  }
  async viewTransactions() {
    const category = await this.prompt('Enter category to filter by (or press Enter to view all): ');
    const transactions = await this.transactionManager.getTransactions(category || null);
    console.log('Transactions:', transactions);
  }
  async addIncome() {
    const date = await this.prompt('Enter income date (YYYY-MM-DD): ');
    const source = await this.prompt('Enter income source: ');
    const amount = parseFloat(await this.prompt('Enter income amount: '));
    const income = { source: source, amount: amount, date: date };
    await this.transactionManager.addIncome(income);
}

async viewIncomes() {
    const incomes = await this.transactionManager.getIncome();
    console.log('Incomes:', JSON.stringify(incomes, null, 2));

}

async analyzeIncomeVsExpenses() {
    await this.financialAnalysis.analyzeIncomeVsExpenses();
}


  // Example: Viewing Transactions
 

  // Example: Setting a Budget
  async setBudget() {
    const category = await this.prompt('Enter budget category: ');
    const period = await this.prompt('Enter budget period (e.g., monthly, weekly): ');
    const amount = parseFloat(await this.prompt('Enter budget amount: '));

    const budget = [{ category, period, amount }];
    await this.budgeting.setBudget(budget);
    console.log('Budget set successfully!');
  }

  // Example: Viewing Budgets
  async viewBudgets() {
    const budgets = await this.budgeting.getBudgets();
    console.log('Budgets:', JSON.stringify(budgets, null, 2));
  }

  // Example: Setting a Savings Goal
  async setSavingsGoal() {
    const name = await this.prompt('Enter goal name: ');
    const amount = parseFloat(await this.prompt('Enter goal amount: '));
    const targetDate = new Date(await this.prompt('Enter target date (YYYY-MM-DD): ')).getTime();

    const goal = { id: Date.now(), name, amount, targetDate };
    await this.savingsGoals.setGoal(goal);
    console.log('Savings goal set successfully!');
  }

  // Example: Viewing Savings Goals
  async viewSavingsGoals() {
    const goals = await this.savingsGoals.getGoals();
    console.log('Savings Goals:', JSON.stringify(goals, null, 2));
  }

  // Example: Setting Income
  async setIncome() {
    const date = await this.prompt('Enter income date (YYYY-MM-DD): ');
    const source = await this.prompt('Enter income source: ');
    const amount = parseFloat(await this.prompt('Enter income amount: '));

    const income = { Date: date, Source: source, Amount: amount };
    await this.transactionManager.addIncome(income);
    console.log('Income recorded successfully!');
  }

  // Example: Viewing Incomes
  async viewIncomes() {
    const incomes = await this.transactionManager.getIncome();
    console.log('Incomes:', JSON.stringify(incomes, null, 2));
  }

  // Example: Analyze Income vs Expenses
  

  async monthlysaving() {
    const savingsGoals = await this.savingsGoals.getGoals(); // Using the getGoals method

  if (savingsGoals.length === 0) {
    console.log('No savings goals found.');
    return; // Simply return without closing readline
  }

  console.log('Available goals:');
  savingsGoals.forEach((goal, index) => {
    console.log(`${index + 1}. ${goal.name}`);
  });

  const selection = await this.prompt('Please select a goal by number: ');
  const goalIndex = parseInt(selection) - 1;

  if (goalIndex >= 0 && goalIndex < savingsGoals.length) {
    const selectedGoal = savingsGoals[goalIndex].name;
    await this.savingsGoals.calculateMonthlySavings(selectedGoal);
  } else {
    console.log('Invalid selection');
  }
  }
  // Example: Analyze Spending Trends
  async analyzeSpendingTrends() {
    console.log(`
        1. Monthly
        2. Weekly
         `);
    const selection = await this.prompt('please select the period of budget by number: ');
            
            switch (selection) {
                case "1":
                    await this.financialAnalysis.getCategorySpending('monthly');
                    break;
                case "2":
                    await this.financialAnalysis.getCategorySpending('weekly');
                    break;
                default:
                    console.log('Invalid selection. Please try again.');
            }
  }

  async budgetalert() {
    console.log(`
        1. Monthly
        2. Weekly
         `);
    const selection = await this.prompt('please select the period of budget by number: ');

        switch (selection) {
            case "1":
                await this.budgeting.checkAllBudgets('monthly');
                break;
            case "2":
                await this.budgeting.checkAllBudgets('weekly');
                break;
            default:
                console.log('Invalid selection. Please try again.');
        }
}

async insightstrend() {
    await this.financialAnalysis.generateSpendingInsights();
}
  
}

  
// Start the application
const app = new FinancialManagementSystem();
app.mainMenu();