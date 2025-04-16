import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'glow' | 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animate?: 'none' | 'pulse' | 'spin' | 'bounce' | 'wiggle';
  badge?: number | string;
  isActive?: boolean;
  tooltip?: string;
}

const MotionButton = motion.button;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({
    className,
    icon,
    variant = 'default',
    size = 'md',
    animate = 'none',
    badge,
    isActive = false,
    tooltip,
    ...props
  }, ref) => {
    // Size variants
    const sizeClasses = {
      sm: 'h-8 w-8 p-1 text-sm',
      md: 'h-10 w-10 p-1.5',
      lg: 'h-12 w-12 p-2 text-lg',
    };

    // Style variants
    const variantClasses = {
      default: 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200',
      outline: 'border border-gray-300 hover:border-gray-400 text-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-200',
      ghost: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
      glow: 'bg-primary text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.7)]',
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-purple-600 hover:bg-purple-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    };

    // Base animation variants
    const animationVariants = {
      pulse: {
        scale: [1, 1.1, 1],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop' as const,
        },
      },
      spin: {
        rotate: 360,
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        },
      },
      bounce: {
        y: [0, -6, 0],
        transition: {
          duration: 0.6,
          repeat: Infinity,
          repeatType: 'loop' as const,
        },
      },
      wiggle: {
        rotate: [-3, 3, -3],
        transition: {
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'loop' as const,
        },
      },
    };

    // Interactive motion props
    const motionProps = {
      whileHover: { 
        scale: animate === 'none' ? 1.1 : 1,
      },
      whileTap: { scale: 0.95 },
      // Add specific animation if requested
      animate: animate !== 'none' ? animationVariants[animate] : undefined,
      transition: { type: 'spring', stiffness: 400, damping: 17 },
    };

    return (
      <div className="relative inline-block group">
        <MotionButton
          ref={ref}
          className={cn(
            'relative flex items-center justify-center rounded-full transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            sizeClasses[size],
            variantClasses[variant],
            isActive && 'ring-2 ring-blue-500',
            className
          )}
          {...motionProps}
          {...props}
        >
          {icon}
        </MotionButton>
        
        {/* Badge indicator */}
        {badge !== undefined && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              'absolute -top-1 -right-1 flex items-center justify-center',
              'min-w-[18px] h-[18px] rounded-full text-xs font-bold text-white',
              'bg-red-500 px-1'
            )}
          >
            {badge}
          </motion.span>
        )}
        
        {/* Tooltip */}
        {tooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 
                          bg-gray-800 text-white text-xs rounded opacity-0 
                          group-hover:opacity-100 transition-opacity pointer-events-none 
                          whitespace-nowrap">
            {tooltip}
          </div>
        )}
      </div>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton; 