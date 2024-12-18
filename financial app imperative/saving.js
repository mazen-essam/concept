const FileSystem = require('./filesystem');

class SavingsGoals {
  constructor() {
    this.fileSystem = new FileSystem();
  }

  // Set or update a savings goal
  async setGoal(goal) {
    try {
      let fileData = await this.fileSystem.readFile(); // Read file content
      let savingsGoals = fileData.savingsGoals || []; // Mutable variable for savings goals

      let found = false;

      // Iterate through existing goals to find a match
      for (let i = 0; i < savingsGoals.length; i++) {
        if (savingsGoals[i].name === goal.name) {
          // Update existing goal
          savingsGoals[i] = { ...savingsGoals[i], ...goal };
          found = true;
          console.log("Existing savings goal updated successfully.");
          break;
        }
      }

      // If no match found, add the new goal
      if (!found) {
        savingsGoals.push(goal);
        console.log("New savings goal set successfully.");
      }

      // Write updated goals back to the file
      await this.fileSystem.writeFile(savingsGoals, 'savingsGoals');
    } catch (error) {
      console.error("Error setting savings goal:", error.message);
    }
  }

  // Retrieve all savings goals
  async getGoals() {
    try {
      let fileData = await this.fileSystem.readFile(); // Read file content
      let savingsGoals = fileData.savingsGoals || []; // Mutable variable for savings goals
      return savingsGoals;
    } catch (error) {
      console.error("Error retrieving savings goals:", error.message);
      return [];
    }
  }
  
  // Calculate recommended monthly savings for a goal
  async calculateMonthlySavings(goalName) {
    try {
      let fileData = await this.fileSystem.readFile(); // Read file content
      let savingsGoals = fileData.savingsGoals || []; // Mutable variable for savings goals
      let goal = null;

      // Find the specific goal by name
      for (let i = 0; i < savingsGoals.length; i++) {
        if (savingsGoals[i].name === goalName) {
          goal = savingsGoals[i];
          break;
        }
      }

      if (!goal) {
        console.error("Goal not found.");
        return;
      }

      // Calculate months left and monthly savings
      let monthsLeft =
        (goal.targetDate - Date.now()) / (1000 * 60 * 60 * 24 * 30); // Convert ms to months
      let monthlyAmount = goal.amount / monthsLeft;

      console.log(
        `To reach your goal of $${goal.amount} (${goal.name}) by ${new Date(
          goal.targetDate
        ).toLocaleDateString()}, you need to save $${monthlyAmount.toFixed(2)} per month.`
      );
    } catch (error) {
      console.error("Error calculating monthly savings:", error.message);
    }
  }
}

module.exports = SavingsGoals;