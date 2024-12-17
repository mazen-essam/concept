const TransactionManager = require('./TransactionManager');
const FileSystem = require('./filesystem');

class FinancialAnalysis {
    constructor() {
        this.transactionManager = new TransactionManager()
        this.fileSystem = new FileSystem('./financial.json');
    }
    async calculateTotalIncome() {
        const incomes = await this.transactionManager.getIncome();
        let totalIncome = 0;
        for (const entry of incomes) {
            const amount = entry.amount;
            totalIncome += parseFloat(amount || 0);
        }
        return totalIncome;
    }
async analyzeIncomeVsExpenses() {
    const totalIncome = await this.calculateTotalIncome();
    console.log(totalIncome);
    const data = await this.fileSystem.readFile();
    const transactions = data.Transactions || [];
    const totalExpenses = transactions.reduce((total, txn) => total + txn.Amount, 0);
    console.log(`Total Income: $${totalIncome}`);
    console.log(`Total Expenses: $${totalExpenses}`);
    const balance = totalIncome - totalExpenses;
    if (balance >= 0) {
        console.log(`You have a surplus of $${balance}.`);
    } else {
        console.log(`You have a deficit of $${Math.abs(balance)}.`);
    }
}
async getTotalSpending(period) {
    try {
        const data = await this.fileSystem.readFile();
        const transactions = data.Transactions || [];
        const now = new Date();
        const filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.Date);
            return this.isInPeriod(transactionDate, now, period);
        });
        const totalSpending = filteredTransactions.reduce((sum, transaction) => sum + transaction.Amount, 0);
        console.log(`Total spending (${period}): $${totalSpending}`);
        return totalSpending;
    } catch (error) {
        console.error("Error calculating total spending:", error);
    }
}
async getCategorySpending(period) {
    try {
        const data = await this.fileSystem.readFile();
        const transactions = data.Transactions || [];
        const now = new Date();
        const filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.Date);
            return this.isInPeriod(transactionDate, now, period);
        });
        const categorySpending = {};
        filteredTransactions.forEach(transaction => {
            if (!categorySpending[transaction.Category]) {
                categorySpending[transaction.Category] = 0;
            }
            categorySpending[transaction.Category] += transaction.Amount;
        });
        console.log(`Category spending (${period === 'monthly' ? 'this month' : period === 'lastMonthly' ? 'last month' : period}):`, categorySpending);
        return categorySpending;
    } catch (error) {
        console.error("Error calculating category spending:", error);
    }
}
async generateSpendingInsights() {
    try {
        const currentMonthSpending = await this.getCategorySpending('monthly');
        const lastMonthSpending = await this.getCategorySpending('lastMonthly');
        const insights = [];
        for (const category in currentMonthSpending) {
            const current = currentMonthSpending[category] || 0;
            const last = lastMonthSpending[category] || 0;
            const diff = current - last;
            const percentage = last !== 0 ? ((diff / last) * 100).toFixed(2) : 100;
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
    const diffInTime = now - date;
    const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

    switch (period) {
        case 'weekly':
            return diffInDays <= 7;
        case 'monthly':
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        case 'lastMonthly':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
        default:
            return false;
    }
}}
module.exports = FinancialAnalysis;
