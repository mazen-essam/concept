const TransactionManager = require('./TransactionManager');
const FileSystem = require('./filesystem');

class FinancialAnalysis {
    constructor() {
        this.transactionManager = new TransactionManager();
        this.fileSystem = new FileSystem();
    }

    async calculateTotalIncome() {
        let incomes = await this.transactionManager.getIncome();
        let totalIncome = 0;
        for (let i = 0; i < incomes.length; i++) {
            let amount = incomes[i].amount;
            totalIncome += parseFloat(amount || 0);
        }
        return totalIncome;
    }

    async analyzeIncomeVsExpenses() {
        let totalIncome = await this.calculateTotalIncome();
        console.log(totalIncome);
        let data = await this.fileSystem.readFile();
        let transactions = data.Transactions || [];
        let totalExpenses = 0;
        for (let i = 0; i < transactions.length; i++) {
            totalExpenses += transactions[i].amount;
        }
        console.log(`Total Income: $${totalIncome}`);
        console.log(`Total Expenses: $${totalExpenses}`);
        let balance = totalIncome - totalExpenses;
        if (balance >= 0) {
            console.log(`You have a surplus of $${balance}.`);
        } else {
            console.log(`You have a deficit of $${Math.abs(balance)}.`);
        }
    }

    async getTotalSpending(period) {
        try {
            let data = await this.fileSystem.readFile();
            let transactions = data.Transactions || [];
            let now = new Date();
            let filteredTransactions = [];
            for (let i = 0; i < transactions.length; i++) {
                let transactionDate = new Date(transactions[i].Date);
                if (this.isInPeriod(transactionDate, now, period)) {
                    filteredTransactions.push(transactions[i]);
                }
            }
            let totalSpending = 0;
            for (let i = 0; i < filteredTransactions.length; i++) {
                totalSpending += filteredTransactions[i].amount;
            }
            console.log(`Total spending (${period}): $${totalSpending}`);
            return totalSpending;
        } catch (error) {
            console.error("Error calculating total spending:", error);
        }
    }

    async getCategorySpending(period) {
        try {
            let data = await this.fileSystem.readFile();
            let transactions = data.Transactions || [];
            let now = new Date();
            let filteredTransactions = [];
            for (let i = 0; i < transactions.length; i++) {
                let transactionDate = new Date(transactions[i].Date);
                if (this.isInPeriod(transactionDate, now, period)) {
                    filteredTransactions.push(transactions[i]);
                }
            }
            let categorySpending = {};
            for (let i = 0; i < filteredTransactions.length; i++) {
                let transaction = filteredTransactions[i];
                if (!categorySpending[transaction.Category]) {
                    categorySpending[transaction.Category] = 0;
                }
                categorySpending[transaction.Category] += transaction.amount;
            }
            console.log(`Category spending (${period === 'monthly' ? 'this month' : period === 'lastMonthly' ? 'last month' : period}):`, categorySpending);
            return categorySpending;
        } catch (error) {
            console.error("Error calculating category spending:", error);
        }
    }

    async generateSpendingInsights() {
        try {
            let currentMonthSpending = await this.getCategorySpending('monthly');
            let lastMonthSpending = await this.getCategorySpending('lastMonthly');
            let insights = [];
            for (let category in currentMonthSpending) {
                let current = currentMonthSpending[category] || 0;
                let last = lastMonthSpending[category] || 0;
                let diff = current - last;
                let percentage = last !== 0 ? ((diff / last) * 100).toFixed(2) : 100;
                if (diff > 0) {
                    insights.push(`You spent ${percentage}% more on ${category} this month compared to last month.`);
                } else if (diff < 0) {
                    insights.push(`You spent ${Math.abs(percentage)}% less on ${category} this month compared to last month.`);
                } else {
                    insights.push(`Your spending on ${category} remained the same.`);
                }
            }
            console.log("Spending insights:", insights);
            return insights;
        } catch (error) {
            console.error("Error generating spending insights:", error);
        }
    }

    isInPeriod(date, now, period) {
        let diffInTime = now - date;
        let diffInDays = diffInTime / (1000 * 60 * 60 * 24);

        switch (period) {
            case 'weekly':
                return diffInDays <= 7;
            case 'monthly':
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            case 'lastMonthly':
                let lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
            default:
                return false;
        }
    }
}

module.exports = FinancialAnalysis;