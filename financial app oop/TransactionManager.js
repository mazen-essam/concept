const FileSystem = require('./filesystem');


class TransactionManager {
  constructor() {
    this.fileSystem = new FileSystem('./financial.json');
    this.incomes = [];
  }

  // Add a new transaction
  async addTransaction(transaction) {
    try {
      // Assign a unique ID based on the timestamp
      // Append the new transaction to the file

      await this.fileSystem.appendfile(transaction, 'Transactions');
      console.log("Transaction added successfully.");
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  }
  async addIncome(income) {
    try {
        const data = await this.fileSystem.readFile();
        const incomeList = data.income || [];
    
        // Check if an income entry with the same source already exists
        const existingIncomeIndex = incomeList.findIndex(entry => entry.source === income.source);
    
        if (existingIncomeIndex !== -1) {
            // Update the existing income entry
            incomeList[existingIncomeIndex] = { ...incomeList[existingIncomeIndex], ...income };
            console.log("Existing income entry updated successfully.");
        } else {
            // Add new income entry
            incomeList.push(income);
            console.log("New income entry added successfully.");
        }
    
        // Write updated income entries back to file
        await this.fileSystem.writefile(incomeList, 'income');
    } catch (error) {
        console.error("Error adding income entry:", error);
    }
}
    
    async getIncome() {
      try {
        const data = await this.fileSystem.readFile();
        const incomes = data.income || [];
        return incomes
      } catch (error) {
        console.error("Error fetching income:", error);
        return [];
      }
    }
  async getTransactions(category = null) {
    try {
      const data = await this.fileSystem.readFile();
      const transactions = data.Transactions || [];
      if (category) {
        return transactions.filter((t) => t.Category === category);
      }
      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }
}

module.exports = TransactionManager;