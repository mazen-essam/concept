const fs = require("fs");

// Import data from JSON file
const importData = (filePath) => {
  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading file:", error.message);
    return [];
  }
};

// Export data to JSON file
const exportData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log("Data successfully saved to", filePath);
  } catch (error) {
    console.error("Error writing file:", error.message);
  }
};

module.exports = { importData, exportData };
