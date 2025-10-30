/**
 * INGREDIENT EXTRACTION
 */
export const extractIngredients = (meal) => {
  if (!meal) return [];
  
  const items = [];
  
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ing && ing.trim()) {
      items.push({
        ingredient: ing.trim(),
        measure: measure ? measure.trim() : 'to taste',
        id: `ing_${i}_${ing.toLowerCase().replace(/\s+/g, '_')}`,
        index: i
      });
    }
  }
  
  return items;
};

/**
 * TEXT FORMATTING
 */
export const safeText = (text, fallback = 'Not specified') => {
  return text && text.trim() ? text.trim() : fallback;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * INSTRUCTIONS FORMATTING
 */
export const formatInstructions = (instructions) => {
  if (!instructions) return [];
  
  // Split by numbered patterns or newlines
  const steps = instructions
    .split(/\d+\.\s*/)
    .filter(step => step.trim().length > 0)
    .map((step, index) => ({
      number: index + 1,
      text: step.trim(),
      id: `step_${index + 1}`
    }));
  
  return steps.length > 1 ? steps : [{ number: 1, text: instructions, id: 'step_1' }];
};

export const getInstructionsSummary = (instructions, wordLimit = 50) => {
  if (!instructions) return 'No instructions provided';
  
  const words = instructions.split(' ');
  const summary = words.slice(0, wordLimit).join(' ');
  
  return words.length > wordLimit ? summary + '...' : summary;
};

/**
 * TIME FORMATTING
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return 'Unknown time';
  
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2592000000);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  
  return new Date(timestamp).toLocaleDateString();
};

export const formatFullDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';
  
  const date = new Date(timestamp);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleString('en-US', options);
};

/**
 * VALIDATION
 */
export const isValidMeal = (meal) => {
  return meal &&
    meal.idMeal &&
    meal.strMeal &&
    meal.strMealThumb;
};

export const isValidIngredient = (ingredient) => {
  return ingredient && ingredient.trim().length > 0;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * SEARCH & FILTER UTILITIES
 */
export const searchMeals = (meals, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) return meals;
  
  const term = searchTerm.toLowerCase();
  
  return meals.filter(meal =>
    meal.strMeal.toLowerCase().includes(term) ||
    (meal.strCategory && meal.strCategory.toLowerCase().includes(term)) ||
    (meal.strArea && meal.strArea.toLowerCase().includes(term))
  );
};

export const filterByCategory = (meals, category) => {
  if (!category) return meals;
  return meals.filter(meal => meal.strCategory === category);
};

export const filterByArea = (meals, area) => {
  if (!area) return meals;
  return meals.filter(meal => meal.strArea === area);
};

export const sortMeals = (meals, sortBy = 'name') => {
  const sorted = [...meals];
  
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    case 'category':
      return sorted.sort((a, b) => 
        (a.strCategory || '').localeCompare(b.strCategory || '')
      );
    case 'area':
      return sorted.sort((a, b) => 
        (a.strArea || '').localeCompare(b.strArea || '')
      );
    default:
      return sorted;
  }
};

/**
 * ARRAY & OBJECT UTILITIES
 */
export const getUnique = (items, key) => {
  return [...new Set(items.map(item => item[key]))].filter(Boolean);
};

export const groupBy = (items, key) => {
  return items.reduce((acc, item) => {
    const groupKey = item[key];
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
};

export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * URL UTILITIES
 */
export const extractMealIdFromUrl = (url) => {
  const match = url.match(/\/meal\/(\d+)/);
  return match ? match[1] : null;
};

export const buildMealUrl = (mealId) => {
  return `/meal/${mealId}`;
};

/**
 * MEAL STATS
 */
export const getMealStats = (meals) => {
  return {
    total: meals.length,
    categories: getUnique(meals, 'strCategory'),
    areas: getUnique(meals, 'strArea'),
    uniqueCategories: new Set(meals.map(m => m.strCategory)).size,
    uniqueAreas: new Set(meals.map(m => m.strArea)).size
  };
};

/**
 * RECIPE DIFFICULTY ESTIMATION
 */
export const estimateDifficulty = (meal) => {
  const ingredients = extractIngredients(meal);
  const instructionLength = (meal.strInstructions || '').length;
  
  let difficulty = 'Easy';
  
  if (ingredients.length > 10) difficulty = 'Medium';
  if (ingredients.length > 15 || instructionLength > 1000) difficulty = 'Hard';
  if (ingredients.length > 20 || instructionLength > 1500) difficulty = 'Very Hard';
  
  return difficulty;
};

/**
 * COOK TIME ESTIMATION (based on instruction length)
 */
export const estimateCookTime = (meal) => {
  const instructionLength = (meal.strInstructions || '').length;
  
  if (instructionLength < 300) return '15-20 mins';
  if (instructionLength < 600) return '20-30 mins';
  if (instructionLength < 1000) return '30-45 mins';
  return '45-60+ mins';
};

export default {
  extractIngredients,
  safeText,
  truncateText,
  capitalizeFirst,
  capitalizeWords,
  formatInstructions,
  getInstructionsSummary,
  formatTime,
  formatFullDate,
  isValidMeal,
  isValidIngredient,
  validateEmail,
  searchMeals,
  filterByCategory,
  filterByArea,
  sortMeals,
  getUnique,
  groupBy,
  chunk,
  extractMealIdFromUrl,
  buildMealUrl,
  getMealStats,
  estimateDifficulty,
  estimateCookTime
};