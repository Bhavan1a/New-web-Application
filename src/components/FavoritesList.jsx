import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getFavorites, removeFavorite } from '../utils/localStorageUtils';
import RecipeCard from '../components/RecipeCard';

export default function Favorites() {
  const [favorites, setFavorites] = useState(getFavorites());
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const handleFavoritesUpdate = () => {
      setFavorites(getFavorites());
    };

    window.addEventListener('favorites-updated', handleFavoritesUpdate);
    updateCategories();

    return () => {
      window.removeEventListener('favorites-updated', handleFavoritesUpdate);
    };
  }, []);

  const updateCategories = () => {
    const cats = [...new Set(getFavorites().map(f => f.strCategory).filter(Boolean))];
    setCategories(cats);
  };

  const handleRemove = (idMeal) => {
    removeFavorite(idMeal);
    setFavorites(getFavorites());
    window.dispatchEvent(new Event('favorites-updated'));
  };

  const getFilteredAndSorted = () => {
    let filtered = favorites;

    if (filterCategory) {
      filtered = filtered.filter(f => f.strCategory === filterCategory);
    }

    if (sortBy === 'recent') {
      filtered = filtered.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    } else if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
    }

    return filtered;
  };

  const filtered = getFilteredAndSorted();

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
    <motion.div
      className="favorites-page-pro"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="app-container">
        {/* Header */}
        <motion.header className="favorites-header" variants={itemVariants}>
          <div className="header-content">
            <h1>❤️ Your Favorites</h1>
            <p className="lead">
              {favorites.length > 0
                ? `You have ${favorites.length} favorite recipe${favorites.length !== 1 ? 's' : ''} saved`
                : 'No favorites yet, start adding some!'}
            </p>
          </div>

          {favorites.length > 0 && (
            <div className="header-controls">
              {categories.length > 0 && (
                <motion.select
                  className="form-select filter-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </motion.select>
              )}

              <motion.select
                className="form-select sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="recent">Most Recent</option>
                <option value="name">A-Z</option>
              </motion.select>
            </div>
          )}
        </motion.header>

        {/* Content */}
        {favorites.length === 0 ? (
          <motion.div className="empty-favorites" variants={itemVariants}>
            <div className="empty-icon">🍽️</div>
            <h3>No Favorites Yet</h3>
            <p>Start exploring recipes and add your favorites to see them here!</p>
            <Link to="/" className="btn btn-primary">
              Explore Recipes →
            </Link>
          </motion.div>
        ) : (
          <motion.div className="favorites-section" variants={containerVariants}>
            {filtered.length === 0 ? (
              <motion.div className="no-results" variants={itemVariants}>
                <p>No recipes found in this category.</p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  className="results-info"
                  variants={itemVariants}
                >
                  Showing {filtered.length} of {favorites.length}
                </motion.div>

                <motion.div className="favorites-grid" variants={containerVariants}>
                  {filtered.map((meal, i) => (
                    <motion.div
                      key={meal.idMeal}
                      className="favorite-card-wrapper"
                      variants={itemVariants}
                    >
                      <RecipeCard meal={meal} />
                      <motion.button
                        className="remove-favorite-btn"
                        onClick={() => handleRemove(meal.idMeal)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Remove from Favorites
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </div>

      <style>{`
        .favorites-page-pro {
          min-height: 100vh;
          padding: 7rem 0 3rem;
        }

        .favorites-header {
          margin-bottom: 3rem;
        }

        .header-content {
          margin-bottom: 2rem;
        }

        .header-content h1 {
          margin-bottom: 0.5rem;
          font-size: 3.5rem;
        }

        .header-content .lead {
          font-size: 1.25rem;
          margin: 0;
        }

        .header-controls {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .filter-select,
        .sort-select {
          min-width: 200px;
          flex: 1;
          min-width: 150px;
        }

        .empty-favorites {
          text-align: center;
          padding: 4rem 2rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          margin: 3rem 0;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 1.5rem;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .empty-favorites h3 {
          margin-bottom: 0.5rem;
          font-size: 2rem;
        }

        .empty-favorites p {
          margin-bottom: 2rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.1rem;
        }

        .favorites-section {
          margin-bottom: 3rem;
        }

        .results-info {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }

        .favorite-card-wrapper {
          position: relative;
        }

        .remove-favorite-btn {
          position: absolute;
          bottom: -50px;
          left: 0;
          right: 0;
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          padding: 0.75rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0;
          font-size: 0.875rem;
        }

        .favorite-card-wrapper:hover .remove-favorite-btn {
          opacity: 1;
          bottom: 0;
          position: relative;
          margin-top: 1rem;
        }

        .remove-favorite-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          border-color: #ef4444;
          color: #fecaca;
        }

        @media (max-width: 1024px) {
          .favorites-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .favorites-page-pro {
            padding: 6rem 0 2rem;
          }

          .header-content h1 {
            font-size: 2rem;
          }

          .header-controls {
            flex-direction: column;
            width: 100%;
          }

          .filter-select,
          .sort-select {
            width: 100%;
            min-width: auto;
          }

          .empty-favorites {
            padding: 2rem;
          }

          .empty-icon {
            font-size: 3.5rem;
          }

          .favorites-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .favorites-page-pro {
            padding: 5.5rem 0 1rem;
          }

          .header-content h1 {
            font-size: 1.5rem;
            margin-bottom: 0.25rem;
          }

          .header-content .lead {
            font-size: 1rem;
          }

          .favorites-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .empty-favorites {
            padding: 1.5rem;
          }

          .empty-icon {
            font-size: 3rem;
          }
        }
      `}</style>
    </motion.div>
  );
}