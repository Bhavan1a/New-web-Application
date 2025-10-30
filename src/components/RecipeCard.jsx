import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isFavorite, addFavorite, removeFavorite } from '../utils/localStorageUtils';

export default function RecipeCard({ meal, onToggleFav }) {
  const [isFav, setIsFav] = React.useState(isFavorite(meal.idMeal));

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    if (isFav) {
      removeFavorite(meal.idMeal);
    } else {
      addFavorite({
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb,
        strCategory: meal.strCategory,
        strArea: meal.strArea
      });
    }
    setIsFav(!isFav);
    window.dispatchEvent(new Event('favorites-updated'));
    if (onToggleFav) onToggleFav(meal);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { y: -12, transition: { duration: 0.3 } }
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.08, transition: { duration: 0.4 } }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { delay: 0.2 } }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.1 } }
  };

  return (
    <motion.div
      className="recipe-card-pro"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link to={`/meal/${meal.idMeal}`} className="recipe-card-link">
        {/* Image Container */}
        <motion.div className="recipe-image-container" variants={imageVariants}>
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="recipe-image"
            loading="lazy"
          />
          
          {/* Gradient Overlays */}
          <div className="image-overlay-bottom"></div>
          <div className="image-overlay-top"></div>

          {/* Category Badge */}
          {meal.strCategory && (
            <motion.div
              className="category-badge"
              variants={badgeVariants}
              initial="hidden"
              animate="visible"
            >
              <span className="badge-icon">🏷️</span>
              <span className="badge-text">{meal.strCategory}</span>
            </motion.div>
          )}

          {/* Favorite Button */}
          <motion.button
            className={`favorite-btn ${isFav ? 'favorited' : ''}`}
            onClick={handleToggleFavorite}
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
            whileTap={{ scale: 0.85 }}
          >
            <motion.span
              animate={{ scale: isFav ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.4 }}
              className="favorite-icon"
            >
              {isFav ? '❤️' : '🤍'}
            </motion.span>
          </motion.button>

          {/* Quick View Badge */}
          <motion.div
            className="quick-view-badge"
            whileHover={{ opacity: 1 }}
          >
            👁️ Quick View
          </motion.div>
        </motion.div>

        {/* Content Section */}
        <motion.div className="recipe-content" variants={contentVariants}>
          {/* Title */}
          <div className="recipe-title-wrapper">
            <h5 className="recipe-title">{meal.strMeal}</h5>
            {meal.strArea && (
              <span className="recipe-area">
                🌍 {meal.strArea}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="content-divider"></div>

          {/* Info Row */}
          <div className="recipe-info-row">
            {meal.strCategory && (
              <div className="info-item">
                <span className="info-label">Type</span>
                <span className="info-value">{meal.strCategory}</span>
              </div>
            )}
            {meal.strArea && (
              <div className="info-item">
                <span className="info-label">Cuisine</span>
                <span className="info-value">{meal.strArea}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <motion.div
            className="recipe-actions"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="action-text">View Full Recipe</span>
            <motion.span
              className="action-arrow"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.div>
        </motion.div>
      </Link>

      {/* Card Styles */}
      <style>{`
        /* ==================== RECIPE CARD CONTAINER ==================== */
        .recipe-card-pro {
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-clip-padding: padding-box;
        }

        .recipe-card-pro::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(123, 47, 247, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          border-radius: 20px;
        }

        .recipe-card-pro:hover::before {
          opacity: 1;
        }

        .recipe-card-pro:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(0, 212, 255, 0.3);
          box-shadow: 0 20px 60px 0 rgba(0, 212, 255, 0.15);
        }

        /* ==================== CARD LINK ==================== */
        .recipe-card-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
          position: relative;
          z-index: 1;
        }

        /* ==================== IMAGE CONTAINER ==================== */
        .recipe-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1f3a 0%, #252d47 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .recipe-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
        }

        .recipe-card-pro:hover .recipe-image {
          transform: scale(1.08);
        }

        /* ==================== IMAGE OVERLAYS ==================== */
        .image-overlay-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(10, 14, 39, 0.3) 50%,
            rgba(10, 14, 39, 0.6) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .recipe-card-pro:hover .image-overlay-bottom {
          opacity: 1;
        }

        .image-overlay-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%
          );
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .recipe-card-pro:hover .image-overlay-top {
          opacity: 1;
        }

        /* ==================== CATEGORY BADGE ==================== */
        .category-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
          color: #0a0e27;
          padding: 0.6rem 1.1rem;
          border-radius: 25px;
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          z-index: 5;
        }

        .badge-icon {
          font-size: 0.9rem;
          display: flex;
          align-items: center;
        }

        .badge-text {
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* ==================== FAVORITE BUTTON ==================== */
        .favorite-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.5);
          font-size: 1.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
          z-index: 10;
          padding: 0;
        }

        .favorite-btn:hover {
          background: rgba(255, 255, 255, 0.35);
          border-color: #00d4ff;
          box-shadow: 0 0 30px rgba(0, 212, 255, 0.6);
          transform: scale(1.15);
        }

        .favorite-btn.favorited {
          background: rgba(239, 68, 68, 0.35);
          border-color: #ef4444;
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.5);
        }

        .favorite-btn.favorited:hover {
          background: rgba(239, 68, 68, 0.45);
          box-shadow: 0 0 35px rgba(239, 68, 68, 0.7);
        }

        .favorite-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ==================== QUICK VIEW BADGE ==================== */
        .quick-view-badge {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 212, 255, 0.3);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 212, 255, 0.6);
          color: #000000;
          padding: 0.6rem 1.2rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.85rem;
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 8;
          white-space: nowrap;
        }

        .recipe-card-pro:hover .quick-view-badge {
          opacity: 1;
          transform: translateX(-50%) translateY(-5px);
        }

        /* ==================== CONTENT SECTION ==================== */
        .recipe-content {
          flex: 1;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
        }

        /* ==================== TITLE SECTION ==================== */
        .recipe-title-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .recipe-title {
          color: #000000;
          font-weight: 700;
          font-size: 1.15rem;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
          transition: color 0.3s ease;
        }

        .recipe-card-pro:hover .recipe-title {
          color: #00d4ff;
        }

        .recipe-area {
          color: #000000;
          font-size: 0.875rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: color 0.3s ease;
        }

        .recipe-card-pro:hover .recipe-area {
          color: #7b2ff7;
        }

        /* ==================== DIVIDER ==================== */
        .content-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 0, 0, 0.15) 50%,
            transparent 100%
          );
        }

        /* ==================== INFO ROW ==================== */
        .recipe-info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          padding: 0.75rem;
          background: rgba(0, 212, 255, 0.08);
          border: 1px solid rgba(0, 212, 255, 0.2);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .recipe-card-pro:hover .info-item {
          background: rgba(0, 212, 255, 0.15);
          border-color: rgba(0, 212, 255, 0.4);
        }

        .info-label {
          color: #000000;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.7;
        }

        .info-value {
          color: #000000;
          font-size: 0.9rem;
          font-weight: 700;
        }

        /* ==================== ACTION BUTTON ==================== */
        .recipe-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.8rem;
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.25) 0%, rgba(123, 47, 247, 0.15) 100%);
          border: 2px solid rgba(0, 212, 255, 0.4);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
        }

        .recipe-card-pro:hover .recipe-actions {
          background: linear-gradient(135deg, rgba(0, 212, 255, 0.35) 0%, rgba(123, 47, 247, 0.25) 100%);
          border-color: rgba(0, 212, 255, 0.6);
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
        }

        .action-text {
          color: #000000;
          font-weight: 700;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .recipe-card-pro:hover .action-text {
          color: #00d4ff;
        }

        .action-arrow {
          color: #000000;
          font-weight: 700;
          display: flex;
          align-items: center;
          transition: color 0.3s ease;
        }

        .recipe-card-pro:hover .action-arrow {
          color: #7b2ff7;
        }

        /* ==================== RESPONSIVE ==================== */
        @media (max-width: 1024px) {
          .recipe-card-pro {
            border-radius: 16px;
          }

          .recipe-image-container {
            border-radius: 16px 16px 0 0;
          }

          .category-badge {
            top: 10px;
            left: 10px;
            padding: 0.5rem 1rem;
            font-size: 0.7rem;
          }

          .favorite-btn {
            top: 10px;
            right: 10px;
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
          }

          .recipe-content {
            padding: 1.25rem;
          }

          .recipe-title {
            font-size: 1.05rem;
          }
        }

        @media (max-width: 768px) {
          .recipe-card-pro {
            border-radius: 14px;
          }

          .category-badge {
            top: 8px;
            left: 8px;
            padding: 0.4rem 0.8rem;
            font-size: 0.65rem;
            gap: 0.3rem;
          }

          .badge-icon {
            font-size: 0.8rem;
          }

          .favorite-btn {
            top: 8px;
            right: 8px;
            width: 45px;
            height: 45px;
            font-size: 1.3rem;
          }

          .quick-view-badge {
            bottom: 8px;
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
          }

          .recipe-content {
            padding: 1rem;
            gap: 0.75rem;
          }

          .recipe-title {
            font-size: 1rem;
            -webkit-line-clamp: 1;
          }

          .recipe-area {
            font-size: 0.8rem;
          }

          .recipe-info-row {
            gap: 0.5rem;
          }

          .info-item {
            padding: 0.6rem;
          }

          .info-label {
            font-size: 0.7rem;
          }

          .info-value {
            font-size: 0.85rem;
          }

          .recipe-actions {
            padding: 0.7rem;
            margin-top: 0.3rem;
          }

          .action-text {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .recipe-card-pro {
            border-radius: 12px;
          }

          .recipe-image-container {
            aspect-ratio: 1.2;
          }

          .category-badge {
            top: 6px;
            left: 6px;
            padding: 0.35rem 0.7rem;
            font-size: 0.6rem;
          }

          .favorite-btn {
            top: 6px;
            right: 6px;
            width: 40px;
            height: 40px;
            font-size: 1.1rem;
          }

          .quick-view-badge {
            bottom: 6px;
            padding: 0.4rem 0.8rem;
            font-size: 0.75rem;
          }

          .recipe-content {
            padding: 0.9rem;
            gap: 0.6rem;
          }

          .recipe-title {
            font-size: 0.95rem;
            -webkit-line-clamp: 1;
          }

          .recipe-info-row {
            display: none;
          }

          .content-divider {
            display: none;
          }

          .recipe-actions {
            padding: 0.6rem;
            font-size: 0.8rem;
          }

          .action-text {
            font-size: 0.8rem;
          }
        }

        /* ==================== DARK MODE & THEME ==================== */
        @media (prefers-color-scheme: dark) {
          .recipe-card-pro {
            background: rgba(255, 255, 255, 0.06);
          }

          .recipe-image-container {
            background: linear-gradient(135deg, #0f1533 0%, #1a1f3a 100%);
          }
        }

        /* ==================== ANIMATIONS ==================== */
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        /* Accessibility - Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .recipe-card-pro,
          .recipe-image,
          .favorite-btn,
          .category-badge,
          .recipe-actions {
            transition: none;
          }
        }
      `}</style>
    </motion.div>
  );
}