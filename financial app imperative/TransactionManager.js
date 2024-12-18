const FileSystem = require('./filesystem');

class TransactionManager {
  constructor() {
    this.fileSystem = new FileSystem();
  }

  // Add a new transaction
  async addTransaction(transaction) {
    try {
      let fileData = await this.fileSystem.readFile(); // Read existing data
      let transactions = fileData.Transactions || []; // Mutable variable

      // Assign a unique ID based on the timestamp
      transaction.id = Date.now();

      // Append the transaction
      transactions.push(transaction);

      // Write updated transactions back to the file
      fileData.Transactions = transactions; // Mutating the file data
      await this.fileSystem.writeFile(fileData.Transactions, 'Transactions');

      console.log('Transaction added successfully.');
    } catch (error) {
      console.error('Error adding transaction:', error.message);
    }
  }

  // Add or update income
  async addIncome(income) {
    try {
      let fileData = await this.fileSystem.readFile();
      let incomeList = fileData.income || []; // Mutable variable

      let updated = false; // Flag to track updates

      // Find and update the existing income entry
      for (let i = 0; i < incomeList.length; i++) {
        if (incomeList[i].source === income.source) {
          incomeList[i] = { ...incomeList[i], ...income }; // Mutate existing entry
          updated = true;
          console.log('Existing income entry updated successfully.');
          break;
        }
      }

      // If no existing entry, add a new one
      if (!updated) {
        income.id = Date.now(); // Assign unique ID
        incomeList.push(income); // Mutate the list
        console.log('New income entry added successfully.');
      }

      // Write updated income back to the file
      fileData.income = incomeList; // Update file data
      await this.fileSystem.writeFile(fileData.income, 'income');
    } catch (error) {
      console.error('Error adding income entry:', error.message);
    }
  }

  // Get all income
  async getIncome() {
    try {
      const fileData = await this.fileSystem.readFile();
      let incomeList = fileData.income || []; // Mutable variable
      return incomeList;
    } catch (error) {
      console.error('Error fetching income:', error.message);
      return [];
    }
  }

  // Get transactions with an optional category filter
  async getTransactions(category = null) {
    try {
      const fileData = await this.fileSystem.readFile();
      let transactions = fileData.Transactions || []; // Mutable variable

      let filteredTransactions = []; // Result container (mutable)

      if (category) {
        // Filter transactions based on the category
        for (let i = 0; i < transactions.length; i++) {
          if (transactions[i].Category === category) {
            filteredTransactions.push(transactions[i]);
          }
        }
        return filteredTransactions;
      }

      return transactions; // Return all transactions if no filter
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
      return [];
    }
  }
}

module.exports = TransactionManager;