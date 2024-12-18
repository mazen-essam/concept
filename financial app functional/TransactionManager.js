const addTransaction = (state, transaction) => ({
    ...state,
    transactions: [...state.transactions, transaction],
  });
  
  const getTransactions = (state) => state.transactions;
  
  module.exports = { addTransaction, getTransactions };