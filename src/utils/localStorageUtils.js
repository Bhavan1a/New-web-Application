// Storage Keys
const FAVORITES_KEY = 'recipe_ideas_favorites_v2';
const RECENT_KEY = 'recipe_ideas_recent_v2';
const SEARCH_HISTORY_KEY = 'recipe_ideas_search_history_v1';

/**
 * FAVORITES MANAGEMENT
 */

export const getFavorites = () => {
  try {
    const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    return favs.map(fav => ({
      ...fav,
      addedAt: fav.addedAt || Date.now()
    }));
  } catch (e) {
    console.error('Error reading favorites:', e);
    return [];
  }
};

export const setFavorites = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Error saving favorites:', e);
  }
};

export const addFavorite = (meal) => {
  try {
    const favs = getFavorites();
    
    // Check if already exists
    if (favs.find(m => m.idMeal === meal.idMeal)) {
      console.log('Meal already in favorites');
      return false;
    }

    const enhancedMeal = {
      ...meal,
      addedAt: Date.now(),
      favoriteId: `fav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    favs.unshift(enhancedMeal);

    // Limit to 100 favorites (LRU strategy)
    if (favs.length > 100) {
      const sorted = favs.sort((a, b) => a.addedAt - b.addedAt);
      sorted.pop();
      setFavorites(sorted);
    } else {
      setFavorites(favs);
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent('favorites-updated', {
      detail: { action: 'added', meal: enhancedMeal }
    }));

    return true;
  } catch (e) {
    console.error('Error adding favorite:', e);
    return false;
  }
};

export const removeFavorite = (idMeal) => {
  try {
    const favs = getFavorites().filter(m => m.idMeal !== idMeal);
    setFavorites(favs);

    window.dispatchEvent(new CustomEvent('favorites-updated', {
      detail: { action: 'removed', idMeal }
    }));

    return true;
  } catch (e) {
    console.error('Error removing favorite:', e);
    return false;
  }
};

export const isFavorite = (idMeal) => {
  try {
    return getFavorites().some(m => m.idMeal === idMeal);
  } catch (e) {
    console.error('Error checking favorite:', e);
    return false;
  }
};

export const getFavoriteStats = () => {
  try {
    const favs = getFavorites();
    return {
      total: favs.length,
      recent: favs.slice(0, 5),
      categories: [...new Set(favs.map(f => f.strCategory).filter(Boolean))],
      areas: [...new Set(favs.map(f => f.strArea).filter(Boolean))]
    };
  } catch (e) {
    console.error('Error getting favorite stats:', e);
    return { total: 0, recent: [], categories: [], areas: [] };
  }
};

export const clearFavorites = () => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    window.dispatchEvent(new CustomEvent('favorites-updated', { detail: { action: 'cleared' } }));
    return true;
  } catch (e) {
    console.error('Error clearing favorites:', e);
    return false;
  }
};

/**
 * RECENT VIEWED MANAGEMENT
 */

export const pushRecent = (meal) => {
  try {
    const rec = JSON.parse(localStorage.getItem(RECENT_KEY)) || [];

    const enhancedMeal = {
      ...meal,
      viewedAt: Date.now(),
      viewCount: (rec.find(m => m.idMeal === meal.idMeal)?.viewCount || 0) + 1
    };

    // Remove if exists and add to beginning
    const filtered = rec.filter(m => m.idMeal !== meal.idMeal);
    filtered.unshift(enhancedMeal);

    // Keep last 10
    if (filtered.length > 10) filtered.pop();

    localStorage.setItem(RECENT_KEY, JSON.stringify(filtered));

    window.dispatchEvent(new CustomEvent('recipe-viewed', {
      detail: enhancedMeal
    }));

    return true;
  } catch (e) {
    console.error('Error pushing recent:', e);
    return false;
  }
};

export const getRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch (e) {
    console.error('Error reading recent:', e);
    return [];
  }
};

export const clearRecent = () => {
  try {
    localStorage.removeItem(RECENT_KEY);
    return true;
  } catch (e) {
    console.error('Error clearing recent:', e);
    return false;
  }
};

/**
 * SEARCH HISTORY MANAGEMENT
 */

export const addSearchToHistory = (query) => {
  try {
    const history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];

    // Check if exists and move to top
    const existingIndex = history.findIndex(
      item => item.query.toLowerCase() === query.toLowerCase()
    );

    if (existingIndex > -1) {
      history.splice(existingIndex, 1);
    }

    history.unshift({
      query,
      timestamp: Date.now(),
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    // Keep last 20
    if (history.length > 20) history.pop();

    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (e) {
    console.error('Error adding search to history:', e);
    return false;
  }
};

export const getSearchHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
  } catch (e) {
    console.error('Error reading search history:', e);
    return [];
  }
};

export const removeSearchFromHistory = (id) => {
  try {
    const history = getSearchHistory().filter(item => item.id !== id);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch (e) {
    console.error('Error removing search:', e);
    return false;
  }
};

export const clearSearchHistory = () => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    return true;
  } catch (e) {
    console.error('Error clearing search history:', e);
    return false;
  }
};

/**
 * UTILITY FUNCTIONS
 */

export const getStorageStats = () => {
  return {
    favoritesCount: getFavorites().length,
    recentCount: getRecent().length,
    searchHistoryCount: getSearchHistory().length
  };
};

export const exportData = () => {
  try {
    return {
      favorites: getFavorites(),
      recent: getRecent(),
      searchHistory: getSearchHistory(),
      exportedAt: new Date().toISOString()
    };
  } catch (e) {
    console.error('Error exporting data:', e);
    return null;
  }
};

export const importData = (data) => {
  try {
    if (data.favorites) setFavorites(data.favorites);
    if (data.recent) localStorage.setItem(RECENT_KEY, JSON.stringify(data.recent));
    if (data.searchHistory) localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(data.searchHistory));
    return true;
  } catch (e) {
    console.error('Error importing data:', e);
    return false;
  }
};

export const clearAllData = () => {
  try {
    clearFavorites();
    clearRecent();
    clearSearchHistory();
    return true;
  } catch (e) {
    console.error('Error clearing all data:', e);
    return false;
  }
};