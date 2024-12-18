const { addTransaction, getTransactions } = require('./TransactionManager');
const { saveState, loadState } = require('./utils');

const main = async () => {
    let state = await loadState();
    // Example for saving a new transaction
    const transaction = { date: "2024-12-02", category: "Food", amount: 100, description: "dinner" };
    state = addTransaction(state, transaction); // Updates state
    await saveState(state); // Save updated state to state.json
};

main();

// const fs = require('fs').promises;

// (async () => {
//     try {
//         await fs.writeFile('./state.json', 'test');
//         console.log('File write successful!');
//     } catch (error) {
//         console.error('File write failed:', error.message);
//     }
// })();