// API Configuration
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Cache for API responses (in-memory)
const cache = new Map();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

/**
 * Get from cache if valid
 */
const getFromCache = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  
  if (Date.now() - item.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
};

/**
 * Set cache
 */
const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Fetch with error handling
 */
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (err) {
    console.error("API Error:", err);
    return null;
  }
};

// 🔍 Fetch meals by ingredient
export const fetchMealsByIngredient = async (ingredient) => {
  const cacheKey = `ingredient_${ingredient.toLowerCase()}`;
  const cached = getFromCache(cacheKey);
  
  if (cached) return cached;

  try {
    const data = await fetchData(`${BASE_URL}/filter.php?i=${ingredient}`);
    const meals = data?.meals || [];
    setCache(cacheKey, meals);
    return meals;
  } catch (err) {
    console.error("Error fetching meals by ingredient:", err);
    return [];
  }
};

// 🍽️ Fetch meals by name
export const fetchMealsByName = async (name) => {
  const cacheKey = `name_${name.toLowerCase()}`;
  const cached = getFromCache(cacheKey);
  
  if (cached) return cached;

  try {
    const data = await fetchData(`${BASE_URL}/search.php?s=${name}`);
    const meals = data?.meals || [];
    setCache(cacheKey, meals);
    return meals;
  } catch (err) {
    console.error("Error fetching meals by name:", err);
    return [];
  }
};

// 🎲 Fetch random meal
export const fetchRandomMeal = async () => {
  try {
    const data = await fetchData(`${BASE_URL}/random.php`);
    return data?.meals?.[0] || null;
  } catch (err) {
    console.error("Error fetching random meal:", err);
    return null;
  }
};

// 📚 Fetch all meal categories
export const fetchCategories = async () => {
  const cacheKey = 'all_categories';
  const cached = getFromCache(cacheKey);
  
  if (cached) return cached;

  try {
    const data = await fetchData(`${BASE_URL}/categories.php`);
    const categories = data?.categories || [];
    setCache(cacheKey, categories);
    return categories;
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
};

// 🏷️ Fetch meals by category
export const fetchMealsByCategory = async (category) => {
  const cacheKey = `category_${category.toLowerCase()}`;
  const cached = getFromCache(cacheKey);
  
  if (cached) return cached;

  try {
    const data = await fetchData(`${BASE_URL}/filter.php?c=${category}`);
    const meals = data?.meals || [];
    setCache(cacheKey, meals);
    return meals;
  } catch (err) {
    console.error("Error fetching meals by category:", err);
    return [];
  }
};

// 🌍 Fetch all areas
export const fetchAreas = async () => {
  const cacheKey = 'all_areas';
  const cached = getFromCache(cacheKey);
  
  if (cached) return cached;

  try {
    const data = await fetchData(`${BASE_URL}/list.php?a=list`);
    const areas = data?.meals || [];
    setCache(cacheKey, areas);
    return areas;
  } catch (err) {
    console.error("Error fetching areas:", err);
    return [];
  }
};

// 🧭 Fetch meals by area
export const fetchMealsByArea = async (area) => {
  const cacheKey = `area_${area.toLowerCase()}`;
  const cached = getFromCache(cacheKey);
  
  if (cached) return cached;

  try {
    const data = await fetchData(`${BASE_URL}/filter.php?a=${area}`);
    const meals = data?.meals || [];
    setCache(cacheKey, meals);
    return meals;
  } catch (err) {
    console.error("Error fetching meals by area:", err);
    return [];
  }
};

// 🥘 Fetch meal details by ID
export const fetchMealDetails = async (mealId) => {
  const cacheKey = `meal_${mealId}`;
  const cached = getFromCache(cacheKey);
  
  if (cached) return cached;

  try {
    const data = await fetchData(`${BASE_URL}/lookup.php?i=${mealId}`);
    const meal = data?.meals?.[0] || null;
    if (meal) setCache(cacheKey, meal);
    return meal;
  } catch (err) {
    console.error("Error fetching meal details:", err);
    return null;
  }
};

// 🧂 Apply advanced filter
export const applyFilter = async ({ type, value }) => {
  try {
    switch (type) {
      case "ingredient":
        return await fetchMealsByIngredient(value);
      case "category":
        return await fetchMealsByCategory(value);
      case "area":
        return await fetchMealsByArea(value);
      default:
        return [];
    }
  } catch (err) {
    console.error("Error applying filter:", err);
    return [];
  }
};

// 🧠 Fetch today's special (multiple random meals)
export const fetchTodaysSpecial = async () => {
  try {
    const specials = [];
    for (let i = 0; i < 3; i++) {
      const meal = await fetchRandomMeal();
      if (meal) specials.push(meal);
    }
    return specials;
  } catch (err) {
    console.error("Error fetching today's specials:", err);
    return [];
  }
};

// 🔄 Clear cache (useful for manual refresh)
export const clearCache = () => {
  cache.clear();
};

// 📊 Get cache stats
export const getCacheStats = () => {
  return {
    size: cache.size,
    items: Array.from(cache.keys())
  };
};