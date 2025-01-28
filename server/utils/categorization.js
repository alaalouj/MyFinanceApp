// server/utils/categorization.js

const categoryKeywords = {
  loyer: ["loyer", "rent"],
  nourriture: ["supermarché", "restaurant", "food", "groceries"],
  loisirs: ["cinema", "sport", "loisirs", "entertainment"],
  transport: ["uber", "taxi", "bus", "train"],
};

function categorizeExpense(description = "") {
  const lowerDesc = description.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
      return category;
    }
  }
  return "Autre";
}

module.exports = { categorizeExpense };
