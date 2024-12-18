const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, './state.json');

const saveState = async (state) => {
  try {
    // console.log(state);
    await fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2), 'utf8');
    console.log('State saved successfully!');
  } catch (error) {
    console.error('Error saving state:', error);
  }
};

const loadState = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    console.log('State loaded successfully!');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading state, initializing with empty state:', error);
    return { transactions: [], budgets: [], savingsGoals: [], income: [] };
  }
};

module.exports = { saveState, loadState };