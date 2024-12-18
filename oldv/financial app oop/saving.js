const FileSystem = require('./filesystem');

class SavingsGoals {
    constructor() {
        this.fileSystem = new FileSystem('./financial.json');
    }

    async setGoal(goal) {
        try {
            const data = await this.fileSystem.readFile();
            const savingsGoals = data.savingsGoals || [];
    
            // Check if a goal with the same name already exists
            const existingGoalIndex = savingsGoals.findIndex(g => g.name === goal.name);
    
            if (existingGoalIndex !== -1) {
                // Update the existing goal
                savingsGoals[existingGoalIndex] = { ...savingsGoals[existingGoalIndex], ...goal };
                console.log("Existing savings goal updated successfully.");
            } else {
                // Add new goal
                savingsGoals.push(goal);
                console.log("New savings goal set successfully.");
            }
    
            // Write updated goals back to file
            await this.fileSystem.writefile(savingsGoals, 'savingsGoals');
        } catch (error) {
            console.error("Error setting savings goal:", error);
        }
    }
    

    async getGoals() {
        try {
            const data = await this.fileSystem.readFile();
            return data.savingsGoals || [];
        } catch (error) {
            console.error("Error retrieving savings goals:", error);
            return [];
        }
    }


    // Calculate recommended monthly savings for a goal
    async calculateMonthlySavings(goalName) {
        try {
            const data = await this.fileSystem.readFile();
            const savingsGoals = data.savingsGoals || [];
            const goal = savingsGoals.find(g => g.name === goalName);
            
            if (!goal) {
                console.error("Goal not found");
                return;
            }

            const monthsLeft = (goal.targetDate - Date.now()) / (1000 * 60 * 60 * 24 * 30);
            const monthlyAmount = goal.amount / monthsLeft;
            console.log(`To reach your goal of $${goal.amount} to ${goal.name} by ${new Date(goal.targetDate).toLocaleDateString()}, you need to save $${monthlyAmount.toFixed(2)} per month.`);
        } catch (error) {
            console.error("Error calculating monthly savings:", error);
        }
    }
   
}


module.exports = SavingsGoals;