
import React from 'react';
import { motion } from 'framer-motion';

interface DecorativePatternProps {
  className?: string;
  variant?: 'squares' | 'dots' | 'lines';
  color?: string;
}

const DecorativePattern = ({ className, variant = 'squares', color = 'currentColor' }: DecorativePatternProps) => {
  // Helper function to generate unique patterns
  const renderPattern = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="relative w-full h-full">
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  backgroundColor: color,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3 + 0.1,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: Math.random() * 0.3 + 0.1 }}
                transition={{ 
                  duration: Math.random() * 2 + 1,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
            ))}
          </div>
        );
        
      case 'lines':
        return (
          <div className="relative w-full h-full">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  backgroundColor: color,
                  height: '1px',
                  width: `${Math.random() * 30 + 10}%`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3 + 0.1,
                  transform: `rotate(${Math.random() * 180}deg)`,
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: Math.random() * 0.3 + 0.1, x: 0 }}
                transition={{ 
                  duration: Math.random() * 3 + 2,
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        );
        
      case 'squares':
      default:
        return (
          <div className="relative w-full h-full">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  border: `1px solid ${color}`,
                  width: `${Math.random() * 50 + 20}px`,
                  height: `${Math.random() * 50 + 20}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.15 + 0.05,
                }}
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ 
                  opacity: Math.random() * 0.15 + 0.05,
                  rotate: Math.random() > 0.5 ? 45 : 0
                }}
                transition={{ 
                  duration: Math.random() * 5 + 3,
                  delay: Math.random(),
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      {renderPattern()}
    </div>
  );
};

export default DecorativePattern;
