import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  fetchMealsByIngredient,
  fetchMealsByName,
  fetchRandomMeal,
  fetchMealsByCategory,
} from "../api/mealApi";
import RecipeCard from "../components/RecipeCard";
import Loader from "../components/Loader";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("ingredient");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentCategories, setRecentCategories] = useState([]);
  const [popularCategories] = useState([
    "Chicken",
    "Beef",
    "Seafood",
    "Pasta",
    "Vegetarian",
    "Dessert",
  ]);
  const [todaysSpecial, setTodaysSpecial] = useState(null);

  useEffect(() => {
    const storedRecent = JSON.parse(localStorage.getItem("recentCategories")) || [];
    setRecentCategories(storedRecent);
    loadTodaysSpecial();
    loadDefaultMeals();
  }, []);

  const loadTodaysSpecial = async () => {
    try {
      const meal = await fetchRandomMeal();
      setTodaysSpecial(meal);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDefaultMeals = async () => {
    setLoading(true);
    try {
      // Load first meal immediately, then others in parallel
      const firstMeal = await fetchRandomMeal();
      if (firstMeal) {
        setMeals([firstMeal]);
        
        // Load remaining meals in background
        const remainingMeals = await Promise.all([
          fetchRandomMeal(),
          fetchRandomMeal(),
          fetchRandomMeal()
        ]);
        
        const allMeals = [firstMeal, ...remainingMeals.filter(m => m)];
        setMeals(allMeals);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load default meals!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError("Please enter a search term!");
      return;
    }
    setError("");
    setLoading(true);
    try {
      let results = [];
      if (searchType === "ingredient") {
        results = await fetchMealsByIngredient(searchTerm);
      } else {
        results = await fetchMealsByName(searchTerm);
      }

      if (!results || results.length === 0) {
        setMeals([]);
        setError("No recipes found. Try another term!");
      } else {
        // Limit to 12 results for better performance
        setMeals(results.slice(0, 12));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recipes!");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category) => {
    setLoading(true);
    setError("");
    try {
      const results = await fetchMealsByCategory(category);
      
      if (!results || results.length === 0) {
        setMeals([]);
        setError(`No ${category} recipes found. Try another category!`);
      } else {
        // Limit to 12 results for better performance
        setMeals(results.slice(0, 12));
        updateRecentCategories(category);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch category recipes!");
    } finally {
      setLoading(false);
    }
  };

  const updateRecentCategories = (category) => {
    let updated = [category, ...recentCategories.filter((c) => c !== category)];
    if (updated.length > 6) updated = updated.slice(0, 6);
    setRecentCategories(updated);
    localStorage.setItem("recentCategories", JSON.stringify(updated));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div className="home-page-pro" initial="hidden" animate="visible" variants={containerVariants}>
      <div className="app-container">
        {/* Header Section */}
        <motion.header className="header-section" variants={itemVariants}>
          <motion.div className="header-content">
            <h1>🍽️ Discover Your Next Favorite Recipe</h1>
            <p className="lead">Explore thousands of delicious meals, search by ingredients, and save your favorites</p>
          </motion.div>

          {/* Search Form */}
          <motion.form className="search-form-pro" onSubmit={handleSearch} variants={itemVariants}>
            <div className="search-inputs">
              <motion.select
                className="form-select"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="ingredient">Search by Ingredient</option>
                <option value="name">Search by Meal Name</option>
              </motion.select>

              <motion.input
                type="text"
                className="form-control search-input"
                placeholder={
                  searchType === "ingredient"
                    ? "e.g., chicken, egg, tomato..."
                    : "e.g., Arrabiata, Curry..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                whileFocus={{ scale: 1.02 }}
              />

              <motion.button
                type="submit"
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Search 🔍
              </motion.button>
            </div>

            {/* Quick Tags */}
            <div className="quick-tags">
              {["Chicken", "Egg", "Rice", "Tomato"].map((tag, i) => (
                <motion.button
                  key={tag}
                  type="button"
                  className="quick-tag"
                  onClick={() => {
                    setSearchTerm(tag.toLowerCase());
                    setTimeout(() => handleSearch({ preventDefault: () => {} }), 0);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.form>
        </motion.header>

        {/* Today's Special */}
        {todaysSpecial && (
          <motion.section className="todays-special-section" variants={itemVariants}>
            <div className="section-header">
              <h3>✨ Today's Special</h3>
              <p className="text-secondary">Handpicked for you</p>
            </div>
            <motion.div
              className="special-card-container"
              whileHover={{ y: -10 }}
            >
              <img
                src={todaysSpecial.strMealThumb}
                alt={todaysSpecial.strMeal}
                className="special-card-image"
              />
              <div className="special-card-content">
                <h4>{todaysSpecial.strMeal}</h4>
                <p className="text-secondary">
                  {todaysSpecial.strCategory} • {todaysSpecial.strArea}
                </p>
                <motion.button
                  className="btn btn-primary btn-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Recipe →
                </motion.button>
              </div>
            </motion.div>
          </motion.section>
        )}

        {/* Recent Categories */}
        {recentCategories.length > 0 && (
          <motion.section className="categories-section" variants={itemVariants}>
            <div className="section-header">
              <h3>🕘 Recently Viewed</h3>
              <p className="text-secondary">Quick access to your favorites</p>
            </div>
            <div className="category-grid">
              {recentCategories.map((cat, i) => (
                <motion.button
                  key={i}
                  className="category-button"
                  onClick={() => handleCategoryClick(cat)}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="category-text">{cat}</span>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {/* Popular Categories */}
        <motion.section className="categories-section" variants={itemVariants}>
          <div className="section-header">
            <h3>🔥 Popular Categories</h3>
            <p className="text-secondary">Explore trending cuisines</p>
          </div>
          <div className="category-grid">
            {popularCategories.map((cat, i) => (
              <motion.button
                key={i}
                className="category-button popular"
                onClick={() => handleCategoryClick(cat)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="category-text">{cat}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Results */}
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        {loading ? (
          <Loader />
        ) : meals.length > 0 ? (
          <motion.section className="recipes-section" variants={containerVariants}>
            <div className="section-header">
              <h3>Found {meals.length} Recipes</h3>
            </div>
            <motion.div className="recipes-grid" variants={containerVariants}>
              {meals.map((meal, i) => (
                <motion.div key={`${meal.idMeal}_${i}`} variants={itemVariants}>
                  <RecipeCard meal={meal} />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        ) : (
          !error && (
            <motion.div className="empty-state-pro" variants={itemVariants}>
              <div className="empty-icon">🔍</div>
              <h4>Start Exploring</h4>
              <p>Use the search bar above or browse popular categories to find recipes</p>
            </motion.div>
          )
        )}
      </div>

      <style>{`
        .home-page-pro {
          min-height: 100vh;
          padding: 7rem 0 3rem;
        }

        .header-section {
          margin-bottom: 4rem;
          text-align: center;
        }

        .header-content {
          margin-bottom: 2rem;
        }

        .header-content h1 {
          margin-bottom: 1rem;
          font-size: 3.5rem;
          line-height: 1.2;
        }

        .header-content .lead {
          font-size: 1.25rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-form-pro {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          box-shadow: 0 8px 32px 0 rgba(0, 212, 255, 0.1);
        }

        .search-inputs {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .search-input {
          font-size: 1rem;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .quick-tags {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .quick-tag {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(0, 212, 255, 0.3);
          color: #00d4ff;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quick-tag:hover {
          background: rgba(0, 212, 255, 0.15);
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }

        .todays-special-section {
          margin-bottom: 4rem;
        }

        .section-header {
          margin-bottom: 2rem;
        }

        .section-header h3 {
          margin-bottom: 0.5rem;
          font-size: 2rem;
        }

        .section-header .text-secondary {
          font-size: 1rem;
          margin: 0;
        }

        .special-card-container {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          align-items: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          box-shadow: 0 8px 32px 0 rgba(0, 212, 255, 0.1);
        }

        .special-card-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 12px;
        }

        .special-card-content h4 {
          margin-bottom: 0.5rem;
          font-size: 1.75rem;
        }

        .special-card-content .text-secondary {
          margin-bottom: 1.5rem;
        }

        .categories-section {
          margin-bottom: 4rem;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .category-button {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid rgba(0, 212, 255, 0.3);
          border-radius: 12px;
          color: #00d4ff;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .category-button:hover {
          background: rgba(0, 212, 255, 0.15);
          border-color: #00d4ff;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }

        .category-button.popular {
          border-color: rgba(123, 47, 247, 0.3);
          color: #7b2ff7;
        }

        .category-button.popular:hover {
          background: rgba(123, 47, 247, 0.15);
          border-color: #7b2ff7;
          box-shadow: 0 0 20px rgba(123, 47, 247, 0.3);
        }

        .error-message {
          padding: 1rem 1.5rem;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          color: #fca5a5;
          margin-bottom: 2rem;
          font-weight: 600;
        }

        .recipes-section {
          margin-bottom: 3rem;
        }

        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }

        .empty-state-pro {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          margin: 3rem 0;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state-pro h4 {
          margin-bottom: 0.5rem;
        }

        .empty-state-pro p {
          margin: 0;
          color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 1024px) {
          .search-inputs {
            grid-template-columns: 1fr;
          }

          .special-card-container {
            grid-template-columns: 1fr;
          }

          .special-card-image {
            height: 250px;
          }
        }

        @media (max-width: 768px) {
          .header-content h1 {
            font-size: 2rem;
          }

          .search-form-pro {
            padding: 1.5rem;
          }

          .recipes-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1.5rem;
          }

          .category-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .home-page-pro {
            padding: 6rem 0 2rem;
          }

          .header-content h1 {
            font-size: 1.5rem;
          }

          .search-form-pro {
            padding: 1rem;
          }

          .quick-tags {
            gap: 0.5rem;
          }

          .quick-tag {
            padding: 0.4rem 0.8rem;
            font-size: 0.875rem;
          }

          .recipes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Home;