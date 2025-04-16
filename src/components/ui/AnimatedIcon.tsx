import React from 'react';
import { motion, MotionProps, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

// Animation types expanded with modern options for 2025
export type AnimationType = 
  | 'pulse' 
  | 'bounce' 
  | 'rotate' 
  | 'float' 
  | 'glow' 
  | 'scale' 
  | 'morphing' 
  | 'blob' 
  | 'breathe'
  | 'liquid'      // New fluid animation
  | 'neon'        // New neon glow effect 
  | 'spatial'     // New spatial animation for 3D depth
  | 'adaptive'    // New animation that changes based on context
  | 'tactile';    // New modern skeuomorphic animation

// Hover effect types enhanced with modern options
export type HoverEffectType = 
  | 'grow' 
  | 'shrink' 
  | 'highlight'
  | 'pop' 
  | 'shake'
  | 'glare'      // New glare/shimmer effect
  | 'depth'      // New 3D depth effect 
  | 'ripple'     // New interactive ripple
  | 'magnetic';  // New magnetic cursor effect

// Size options with more granular control
export type SizeType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'custom';

export interface AnimatedIconProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  icon: React.ReactNode;
  type?: AnimationType | AnimationType[];
  duration?: number;
  delay?: number;
  hoverEffect?: HoverEffectType;
  size?: SizeType;
  sizeValue?: string;
  glowColor?: string;
  glowIntensity?: number;
  reducedMotion?: boolean;       // New prop for accessibility
  mobileOptimized?: boolean;     // New prop for mobile performance
  glassmorphism?: boolean;       // New prop for glassmorphism effect
  isInteractive?: boolean;       // New prop for interactive animations
  customTransition?: any;        // Custom transition settings
  className?: string;
}

// Animation variants expanded with new modern effects
const animationVariants: Record<AnimationType, Variants> = {
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  bounce: {
    animate: {
      y: ["0%", "-15%", "0%"],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  rotate: {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },
  float: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  glow: {
    animate: {
      boxShadow: [
        "0 0 5px 0 rgba(255, 255, 255, 0.3)",
        "0 0 15px 2px rgba(255, 255, 255, 0.5)",
        "0 0 5px 0 rgba(255, 255, 255, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  scale: {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  morphing: {
    animate: {
      borderRadius: ["25%", "50%", "25%"],
      rotate: [0, 5, 0, -5, 0],
      scale: [1, 1.05, 1, 1.05, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  blob: {
    animate: {
      scale: [1, 1.05, 0.95, 1.05, 1],
      borderRadius: ["40% 60% 60% 40% / 60% 40% 60% 40%", "50% 50% 50% 50% / 50% 50% 50% 50%", "40% 60% 60% 40% / 40% 60% 40% 60%"],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  breathe: {
    animate: {
      scale: [1, 1.03, 1],
      opacity: [0.95, 1, 0.95],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  // New animation styles for 2025
  liquid: {
    animate: {
      scale: [1, 1.03, 0.97, 1.03, 1],
      borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 40% 60% / 60% 30% 70% 40%", "30% 70% 70% 30% / 50% 60% 40% 50%"],
      rotate: [0, 3, 0, -3, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  neon: {
    animate: {
      filter: [
        "drop-shadow(0 0 3px rgba(128, 0, 255, 0.7))",
        "drop-shadow(0 0 8px rgba(128, 0, 255, 0.9))",
        "drop-shadow(0 0 3px rgba(128, 0, 255, 0.7))"
      ],
      opacity: [0.85, 1, 0.85],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  spatial: {
    animate: {
      rotateX: [0, 5, 0, -5, 0],
      rotateY: [0, -5, 0, 5, 0],
      z: [0, 20, 0],
      filter: [
        "drop-shadow(0 5px 10px rgba(0, 0, 0, 0.1))",
        "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.15))",
        "drop-shadow(0 5px 10px rgba(0, 0, 0, 0.1))"
      ],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  adaptive: {
    animate: ({ cycle = 0 }) => ({
      scale: [1, 1.03, 0.98, 1],
      rotate: [0, cycle % 2 === 0 ? 3 : -3, 0],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 3 + Math.random(),
        repeat: Infinity,
        ease: "easeInOut"
      }
    }) as any // Type assertion to resolve TypeScript error
  },
  tactile: {
    animate: {
      scale: [1, 1.02, 0.98, 1],
      boxShadow: [
        "0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)", 
        "0 4px 8px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)",
        "0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)"
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

// Enhanced hover effects for better interactivity
const hoverVariants: Record<HoverEffectType, Variants> = {
  grow: {
    hover: {
      scale: 1.15,
      transition: { duration: 0.2 }
    }
  },
  shrink: {
    hover: {
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  },
  highlight: {
    hover: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transition: { duration: 0.2 }
    }
  },
  pop: {
    hover: {
      scale: 1.15,
      rotate: [0, 5, -5, 0],
      transition: { duration: 0.4 }
    }
  },
  shake: {
    hover: {
      x: [0, -3, 3, -3, 3, 0],
      transition: { duration: 0.4 }
    }
  },
  // New hover effects for 2025
  glare: {
    hover: {
      background: "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 100%)",
      backgroundSize: "200% 200%",
      backgroundPosition: ["0% 0%", "100% 100%"],
      transition: { duration: 0.8, ease: "easeOut" }
    }
  },
  depth: {
    hover: {
      z: 20,
      rotateX: 5,
      rotateY: 5,
      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 5px 10px -5px rgba(0,0,0,0.05)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  },
  ripple: {
    hover: {
      boxShadow: [
        "0 0 0 0 rgba(255,255,255,0)",
        "0 0 0 10px rgba(255,255,255,0.1)",
        "0 0 0 20px rgba(255,255,255,0)"
      ],
      transition: { duration: 0.7, ease: "easeOut" }
    }
  },
  magnetic: {
    hover: ({ clientX, clientY, rect }) => {
      if (!rect) return {};
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;
      const maxMove = 10;
      const moveX = (x / rect.width) * maxMove;
      const moveY = (y / rect.height) * maxMove;
      
      return {
        x: moveX,
        y: moveY,
        transition: { duration: 0.2, ease: "easeOut" }
      };
    }
  }
};

const getSizeClass = (size: SizeType): string => {
  switch (size) {
    case 'xs': return 'w-4 h-4';
    case 'sm': return 'w-5 h-5';
    case 'md': return 'w-6 h-6';
    case 'lg': return 'w-8 h-8';
    case 'xl': return 'w-10 h-10';
    case '2xl': return 'w-12 h-12';
    case '3xl': return 'w-16 h-16';
    case 'custom': return '';
    default: return 'w-6 h-6';
  }
};

export default function AnimatedIcon({ 
  icon, 
  type = 'pulse', 
  duration, 
  delay = 0, 
  hoverEffect, 
  size = 'md', 
  sizeValue,
  glowColor = "rgba(255, 255, 255, 0.7)",
  glowIntensity = 0.7,
  reducedMotion = false,
  mobileOptimized = true,
  glassmorphism = false,
  isInteractive = false,
  customTransition = {},
  className, 
  ...props 
}: AnimatedIconProps) {
  // Handle multiple animation types
  const animationTypes = Array.isArray(type) ? type : [type];
  
  // Cast the animation variants to any to safely access transition properties
  const animationProps = animationTypes.reduce<any>((acc, currentType) => {
    const currentVariants = animationVariants[currentType] as any;
    if (!currentVariants) return acc;
    
    // Merge the animation properties
    const animate = {
      ...(acc.animate || {}),
      ...(currentVariants.animate || {})
    };
    
    // Safely access the transition
    const variantTransition = 
      (currentVariants.animate && currentVariants.animate.transition) 
        ? currentVariants.animate.transition 
        : {};
    
    // Merge the transitions or use custom duration if provided
    const transition = duration ? {
      ...variantTransition,
      duration,
      delay,
      ...customTransition
    } : {
      ...variantTransition,
      delay,
      ...customTransition
    };
    
    return {
      ...acc,
      animate,
      transition
    };
  }, { animate: {}, transition: {} });
  
  // Get hover variants if specified
  const hoverProps = hoverEffect ? hoverVariants[hoverEffect] : undefined;
  const hoverVariant = hoverProps?.hover;
  
  // Create a clean version of props without the hover property
  const cleanProps = { ...props };
  if ('hover' in cleanProps) {
    delete cleanProps.hover;
  }
  
  // Apply glow effect if specified in animation types
  const hasGlow = animationTypes.includes('glow') || animationTypes.includes('neon');
  
  // Construct size classes
  const sizeClass = size === 'custom' && sizeValue 
    ? sizeValue 
    : getSizeClass(size);
  
  // Apply mobile optimizations if needed - reduce animation complexity
  const optimizedAnimation = mobileOptimized ? {
    ...animationProps,
    transition: {
      ...animationProps.transition,
      // Simplify animations on mobile to improve performance
      ...(typeof window !== 'undefined' && window.innerWidth < 768 && {
        duration: duration ? duration * 0.8 : (animationProps.transition?.duration as number) * 0.8,
        ease: "linear"
      })
    }
  } : animationProps;
  
  // Apply reduced motion settings for accessibility
  const accessibleAnimation = reducedMotion ? {
    animate: {}, // No animation when reduced motion is preferred
    transition: {}
  } : optimizedAnimation;

  // Glassmorphism effect
  const glassmorphismStyle = glassmorphism ? {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
  } : {};
  
  return (
    <motion.div
      className={cn(
        'relative flex items-center justify-center rounded-full overflow-hidden',
        sizeClass,
        className
      )}
      style={{
        ...glassmorphismStyle,
        // Set perspective for 3D effects
        perspective: '1000px',
      }}
      {...accessibleAnimation}
      whileHover={hoverVariant}
      {...cleanProps}
    >
      {/* Icon element */}
      <div className="relative z-10">
        {icon}
      </div>
      
      {/* Glow effect, if enabled */}
      {hasGlow && (
        <motion.div
          className="absolute inset-0 rounded-full z-0"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, rgba(255, 255, 255, 0) 70%)`,
            opacity: glowIntensity,
          }}
          animate={{
            opacity: [glowIntensity * 0.7, glowIntensity, glowIntensity * 0.7]
          }}
          transition={{
            duration: duration || 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Interactive ripple effect when clicked - only shows if isInteractive is true */}
      {isInteractive && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ 
            scale: 1.5, 
            opacity: [0, 0.3, 0],
            transition: { duration: 0.6 } 
          }}
          style={{
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)"
          }}
        />
      )}
    </motion.div>
  );
} 