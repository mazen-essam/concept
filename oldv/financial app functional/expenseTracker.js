// Add a transaction (mutating the array directly)
const addTransaction = (transactions, newTransaction) => {
  transactions.push(newTransaction);
};

// Higher-order function to filter transactions
const filterTransactions = (transactions, predicate) => {
  return transactions.filter(predicate);
};

module.exports = { addTransaction, filterTransactions };