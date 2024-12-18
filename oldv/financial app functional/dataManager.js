const { readJSON, writeJSON } = require("./filesystem");

// Import data from a file
const importData = (filePath) => readJSON(filePath);

// Export data to a file
const exportData = (filePath, data) => writeJSON(filePath, data);

module.exports = {
  importData,
  exportData,
};
