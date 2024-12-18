// Calculate monthly savings recommendation
const calculateSavingsRecommendation = (goalAmount, monthsRemaining, saved = 0) => {
  let remainingAmount = goalAmount - saved;
  if (monthsRemaining <= 0) {
    return remainingAmount <= 0 ? 0 : "Not achievable";
  }
  return Math.ceil(remainingAmount / monthsRemaining);
};

module.exports = { calculateSavingsRecommendation };

