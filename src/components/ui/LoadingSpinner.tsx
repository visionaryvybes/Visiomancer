import React from 'react';
import { motion } from 'framer-motion';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'circle' | 'dots' | 'pulse' | 'wave';
type SpinnerColor = 'primary' | 'secondary' | 'accent' | 'white' | 'black';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  color?: SpinnerColor;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'circle',
  color = 'primary',
  text,
  fullScreen = false,
  className = '',
}) => {
  // Size mapping
  const sizeMap = {
    xs: { container: '16px', dot: '4px', gap: '3px', text: 'text-xs' },
    sm: { container: '24px', dot: '6px', gap: '4px', text: 'text-sm' },
    md: { container: '36px', dot: '8px', gap: '5px', text: 'text-base' },
    lg: { container: '48px', dot: '10px', gap: '6px', text: 'text-lg' },
    xl: { container: '64px', dot: '12px', gap: '8px', text: 'text-xl' },
  };

  // Color mapping
  const colorMap = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    white: 'bg-white',
    black: 'bg-black',
  };

  const textColorMap = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    white: 'text-white',
    black: 'text-black',
  };

  // Container style
  const containerStyle = fullScreen
    ? "fixed inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center";

  // Render spinner based on variant
  const renderSpinner = () => {
    switch (variant) {
      case 'circle':
        return (
          <motion.div
            className={`rounded-full border-t-transparent border-2 ${colorMap[color].replace('bg-', 'border-')} animate-spin`}
            style={{
              width: sizeMap[size].container,
              height: sizeMap[size].container,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`rounded-full ${colorMap[color]}`}
                style={{
                  width: sizeMap[size].dot,
                  height: sizeMap[size].dot,
                }}
                animate={{
                  y: ["0%", "-50%", "0%"],
                }}
                transition={{
                  duration: 0.7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={`rounded-full ${colorMap[color]}`}
            style={{
              width: sizeMap[size].container,
              height: sizeMap[size].container,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );

      case 'wave':
        return (
          <div className="flex items-end space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={`rounded-sm ${colorMap[color]}`}
                style={{
                  width: sizeMap[size].dot,
                  height: sizeMap[size].dot,
                }}
                animate={{
                  height: [
                    sizeMap[size].dot,
                    `calc(${sizeMap[size].container} * 0.6)`,
                    sizeMap[size].dot,
                  ],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`${containerStyle} ${className}`}>
      {renderSpinner()}
      {text && (
        <motion.p
          className={`mt-3 ${textColorMap[color]} ${sizeMap[size].text}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner; 