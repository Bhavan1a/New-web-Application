import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getFavorites, getRecent } from '../utils/localStorageUtils';

export default function Navbar({ favoritesCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [recentCount, setRecentCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setRecentCount(getRecent().length);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleFavoritesUpdate = () => {
      setRecentCount(getRecent().length);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('favorites-updated', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('favorites-updated', handleFavoritesUpdate);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  const menuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
    open: { opacity: 1, height: 'auto', transition: { duration: 0.3 } }
  };

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1 }
    })
  };

  const badgeVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 500 } }
  };

  return (
    <>
      <motion.nav
        className={`navbar-pro ${scrolled ? 'navbar-scrolled' : ''}`}
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-brand">
            <motion.div
              className="brand-icon"
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              🍽️
            </motion.div>
            <div className="brand-text">
              <span className="brand-title">Recipe</span>
              <span className="brand-subtitle">Ideas</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="navbar-menu-desktop">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <motion.span whileHover={{ scale: 1.05 }} className="nav-link-content">
                🏠 Home
                {recentCount > 0 && (
                  <motion.span
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    className="badge badge-primary ms-2"
                  >
                    {recentCount}
                  </motion.span>
                )}
              </motion.span>
            </NavLink>

            <NavLink
              to="/favorites"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <motion.span whileHover={{ scale: 1.05 }} className="nav-link-content">
                ❤️ Favorites
                {favoritesCount > 0 && (
                  <motion.span
                    variants={badgeVariants}
                    initial="initial"
                    animate="animate"
                    className="badge badge-secondary ms-2"
                  >
                    {favoritesCount}
                  </motion.span>
                )}
              </motion.span>
            </NavLink>
          </div>

          {/* Mobile Toggle */}
          <motion.button
            className="navbar-toggler"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={`hamburger ${isMenuOpen ? 'open' : ''}`}
              animate={isMenuOpen ? { rotate: 90 } : { rotate: 0 }}
            >
              <span></span>
              <span></span>
              <span></span>
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="navbar-menu-mobile"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <motion.div className="mobile-menu-items">
                {[
                  { to: '/', label: '🏠 Home', badge: recentCount },
                  { to: '/favorites', label: '❤️ Favorites', badge: favoritesCount }
                ].map((item, i) => (
                  <motion.div key={item.to} custom={i} variants={itemVariants}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                    >
                      {item.label}
                      {item.badge > 0 && (
                        <span className="badge badge-primary ms-auto">{item.badge}</span>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <style>{`
        .navbar-pro {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1030;
          background: rgba(10, 14, 39, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          padding: 1rem 0;
        }

        .navbar-pro.navbar-scrolled {
          background: rgba(10, 14, 39, 0.95);
          box-shadow: 0 20px 60px 0 rgba(0, 0, 0, 0.3);
          padding: 0.75rem 0;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .navbar-brand:hover {
          transform: translateY(-2px);
        }

        .brand-icon {
          font-size: 2rem;
          display: flex;
          align-items: center;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .brand-title {
          font-size: 1.25rem;
          font-weight: 700;
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-subtitle {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .navbar-menu-desktop {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          position: relative;
        }

        .nav-link:hover {
          color: #00d4ff;
          background: rgba(0, 212, 255, 0.1);
        }

        .nav-link.active {
          color: #00d4ff;
          background: rgba(0, 212, 255, 0.15);
          box-shadow: inset 0 0 20px rgba(0, 212, 255, 0.1);
        }

        .nav-link-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .navbar-toggler {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .hamburger span {
          width: 24px;
          height: 2.5px;
          background: #00d4ff;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(8px, 8px);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }

        .navbar-menu-mobile {
          overflow: hidden;
          margin-top: 1rem;
        }

        .mobile-menu-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.5rem;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: rgba(0, 212, 255, 0.15);
          color: #00d4ff;
          border-color: rgba(0, 212, 255, 0.3);
        }

        @media (max-width: 768px) {
          .navbar-menu-desktop {
            display: none;
          }

          .navbar-toggler {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .navbar-menu-mobile {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(10, 14, 39, 0.95);
            backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .mobile-menu-items {
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}