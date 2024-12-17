const FileSystem = require('./filesystem');
const TransactionManager = require('./TransactionManager');

class Budgeting {
    constructor() {
        this.fileSystem = new FileSystem('./financial.json');
        this.transactionManager = new TransactionManager();
    }

    async setBudget(data) {
        try {
            const datafile = await this.fileSystem.readFile();
            const budgetfile = datafile.budgets || [];

            for (const newBudget of data) {
                const exist = budgetfile.find(budget => 
                    budget.category === newBudget.category && budget.period === newBudget.period
                );

                if (exist) {
                    // Update the amount if budget exists for the same category and period
                    exist.amount = newBudget.amount;
                } else {
                    // Add new budget
                    budgetfile.push(newBudget);
                }
            }

            await this.fileSystem.writefile(budgetfile, 'budgets');
            console.log("Budget added or updated successfully.");
        } catch (error) {
            console.error("Error adding budget:", error);
        }
    }

    async getBudgets() {
        try {
            const fileData = await this.fileSystem.readFile();
            return fileData.budgets || [];
        } catch (error) {
            console.error("Error retrieving budgets:", error);
            return [];
        }
    }

    async checkAllBudgets(period) {
        try {
            const summary = await this.transactionManager.getSummaryByCategory(period);
            
            console.log(`Summary for ${period}:`, summary);
            const budgets = await this.getBudgets();
    
            if (budgets.length === 0) {
                console.log("No budgets found.");
                return;
            }
    
            // Group budgets by the specified period
            const periodBudgets = budgets.filter(budget => budget.period === period);
    
            if (periodBudgets.length === 0) {
                console.log(`No budgets found for the '${period}' period.`);
                return;
            }
    
            // Iterate through each category in the budget
            periodBudgets.forEach(budget => {
                const spent = summary[budget.category] || 0;
    
                if (spent >= budget.amount) {
                    console.log(`Budget exceeded for ${budget.category} (${period}). Spent: ${spent}, Budget: ${budget.amount}`);
                } else {
                    console.log(`Within budget for ${budget.category} (${period}). Spent: ${spent}, Budget: ${budget.amount}`);
                }
            });
        } catch (error) {
            console.error("Error checking budgets:", error);
        }
    }
}

module.exports = Budgeting;