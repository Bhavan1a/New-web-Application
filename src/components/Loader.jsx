import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({
  message = 'Loading...',
  size = 'medium',
  type = 'spinner',
  color = 'primary',
  overlay = false,
  fullScreen = false
}) {
  // Spinner Loader
  const SpinnerLoader = () => (
    <motion.div
      className="spinner-pro"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="spinner-inner"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="spinner-dot"></div>
      </motion.div>
    </motion.div>
  );

  // Dots Loader
  const DotsLoader = () => (
    <motion.div className="dots-loader">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="dot"
          animate={{
            y: [0, -15, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.15,
            ease: 'easeInOut'
          }}
        />
      ))}
    </motion.div>
  );

  // Pulse Loader
  const PulseLoader = () => (
    <motion.div
      className="pulse-loader"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      🍽️
    </motion.div>
  );

  // Bounce Loader
  const BounceLoader = () => (
    <motion.div className="bounce-loader">
      {['🍳', '🥘', '👨‍🍳'].map((emoji, index) => (
        <motion.div
          key={index}
          className="bounce-item"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut'
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </motion.div>
  );

  const LoaderContent = () => {
    switch (type) {
      case 'dots':
        return <DotsLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'bounce':
        return <BounceLoader />;
      case 'spinner':
      default:
        return <SpinnerLoader />;
    }
  };

  return (
    <motion.div
      className={`loader-container ${fullScreen ? 'fullscreen' : ''} ${size}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="loader-content">
        <LoaderContent />

        {message && (
          <motion.p
            className="loader-message"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {message}
          </motion.p>
        )}

        {type === 'spinner' && size === 'large' && (
          <motion.div
            className="loader-progress"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 120, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="progress-bar"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            />
          </motion.div>
        )}
      </div>

      <style>{`
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
        }

        .loader-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          background: linear-gradient(135deg, rgba(10, 14, 39, 0.8) 0%, rgba(15, 21, 51, 0.8) 100%);
          backdrop-filter: blur(5px);
          padding: 0;
        }

        .loader-container.small {
          padding: 1rem;
        }

        .loader-container.large {
          padding: 4rem;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        /* Spinner */
        .spinner-pro {
          width: 60px;
          height: 60px;
        }

        .spinner-inner {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .spinner-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          border-radius: 50%;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.6);
        }

        .spinner-dot::after {
          content: '';
          position: absolute;
          width: 60px;
          height: 60px;
          border: 2px solid rgba(0, 212, 255, 0.2);
          border-top-color: #00d4ff;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Dots */
        .dots-loader {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }

        .dot {
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #00d4ff 0%, #7b2ff7 100%);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.6);
        }

        /* Pulse */
        .pulse-loader {
          font-size: 3rem;
          animation: pulse-animation 1.5s ease-in-out infinite;
        }

        @keyframes pulse-animation {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        /* Bounce */
        .bounce-loader {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
        }

        .bounce-item {
          font-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Message */
        .loader-message {
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          font-weight: 500;
          font-size: 1rem;
          margin: 0;
        }

        /* Progress Bar */
        .loader-progress {
          width: 120px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: inset 0 0 10px rgba(0, 212, 255, 0.2);
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #00d4ff 0%, #7b2ff7 100%);
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.6);
        }

        @media (max-width: 480px) {
          .loader-container {
            padding: 2rem;
          }

          .loader-container.fullscreen {
            padding: 1rem;
          }

          .spinner-pro {
            width: 50px;
            height: 50px;
          }

          .pulse-loader {
            font-size: 2.5rem;
          }

          .bounce-item {
            font-size: 1.5rem;
          }

          .loader-message {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </motion.div>
  );
}

// Inline Loader
export function InlineLoader({ size = 'small', color = 'primary' }) {
  return (
    <motion.div
      className="inline-loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="inline-spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <div className="inline-spinner-dot"></div>
      </motion.div>
      <style>{`
        .inline-loader {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .inline-spinner {
          position: relative;
          width: 24px;
          height: 24px;
        }

        .inline-spinner-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #00d4ff;
          border-radius: 50%;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.6);
        }

        .inline-spinner-dot::after {
          content: '';
          position: absolute;
          width: 24px;
          height: 24px;
          border: 2px solid rgba(0, 212, 255, 0.2);
          border-top-color: #00d4ff;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </motion.div>
  );
}

// Skeleton Loader
export function SkeletonLoader({ type = 'card', count = 1, height = 'auto' }) {
  return (
    <motion.div className="skeleton-container">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`skeleton-item skeleton-${type}`}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          style={{ height }}
        >
          {type === 'card' && (
            <>
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-text"></div>
                <div className="skeleton-line skeleton-text-short"></div>
              </div>
            </>
          )}
          {type === 'text' && (
            <>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line skeleton-short"></div>
            </>
          )}
        </motion.div>
      ))}

      <style>{`
        .skeleton-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }

        .skeleton-item {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .skeleton-card {
          display: flex;
          flex-direction: column;
        }

        .skeleton-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .skeleton-content {
          padding: 1.5rem;
          flex: 1;
        }

        .skeleton-line {
          height: 12px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          border-radius: 6px;
          margin-bottom: 0.75rem;
          animation: shimmer 2s infinite;
        }

        .skeleton-title {
          height: 16px;
          width: 80%;
          margin-bottom: 1rem;
        }

        .skeleton-text {
          height: 12px;
          width: 100%;
        }

        .skeleton-text-short {
          width: 60%;
        }

        .skeleton-short {
          width: 40%;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @media (max-width: 768px) {
          .skeleton-container {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
    </motion.div>
  );
}