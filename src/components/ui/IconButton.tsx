import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// Define MotionButton type for clarity
type MotionButtonProps = HTMLMotionProps<'button'>;

// IconButtonProps now correctly only includes its specific props + standard button attributes
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'glow' | 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  // Keep the 'animate' prop to control which animation to use
  animate?: 'none' | 'pulse' | 'spin' | 'bounce' | 'wiggle'; 
  badge?: number | string;
  isActive?: boolean;
  tooltip?: string;
  // We remove explicit motion props like whileHover, whileTap from here
}

const MotionButton = motion.button;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      // Destructure only IconButton specific props + className
      icon,
      className,
      variant = 'default',
      size = 'md',
      animate = 'none', // Keep this to determine motion behavior
      badge,
      isActive = false,
      tooltip,
      // Gather the rest of the props (standard button attributes)
      ...buttonProps 
    },
    ref
  ) => {
    // --- (Existing sizeClasses, variantClasses, animationVariants logic remains the same) ---
    const sizeClasses = {
      sm: 'w-8 h-8 text-sm p-1',
      md: 'w-10 h-10 text-base p-2',
      lg: 'w-12 h-12 text-lg p-3',
    };

    const variantClasses = {
      default:
        'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
      outline:
        'border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
      ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300',
      glow: 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/50',
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
      secondary:
        'bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600',
      danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
    };

    const animationVariants = {
      pulse: { /* ... */ },
      spin: { /* ... */ },
      bounce: { /* ... */ },
      wiggle: { /* ... */ },
    };
    // Ensure full definitions are kept from original file if they existed
    animationVariants.pulse = {
        scale: [1, 1.1, 1],
        transition: { duration: 1, repeat: Infinity, repeatType: 'loop' as const },
    };
    animationVariants.spin = {
        rotate: 360,
        transition: { duration: 1, repeat: Infinity, ease: 'linear' as const },
    };
     animationVariants.bounce = {
        y: [0, -5, 0],
        transition: { duration: 0.5, repeat: Infinity, repeatType: 'loop' as const },
    };
    animationVariants.wiggle = {
        rotate: [-3, 3, -3],
        transition: { duration: 0.5, repeat: Infinity, repeatType: 'loop' as const },
    };


    // Construct the motion props based on the 'animate' prop
    const motionProps: MotionButtonProps = {
      whileHover: { 
        scale: animate === 'none' ? 1.1 : 1,
      },
      whileTap: { scale: 0.95 },
      // Use the 'animate' prop passed to IconButton to select the correct variant
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
          // Pass standard HTML button attributes collected in buttonProps
          {...buttonProps} 
          // Pass the explicitly constructed motion props
          {...motionProps}
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