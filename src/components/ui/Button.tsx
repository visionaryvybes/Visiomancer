import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils' // Assuming a utility for classname merging exists
import { motion } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glow'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  disableAnimation?: boolean
}

const MotionComp = motion.button;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    asChild = false, 
    icon,
    iconPosition = 'left',
    disableAnimation = false,
    children,
    ...props 
  }, ref) => {
    const Comp = (asChild ? Slot : disableAnimation ? 'button' : MotionComp) as any
    
    // Expanded variants with enhanced styling
    const variants = {
      default:
        'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
      outline:
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
      glow: 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]',
    }
    
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    }

    const motionProps = !disableAnimation ? {
      whileHover: { scale: 1.03 },
      whileTap: { scale: 0.97 },
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 15 
      }
    } : {}

    // Render content with icon if provided
    const renderContent = () => {
      if (!icon) return children;
      
      return (
        <span className="inline-flex items-center gap-2">
          {iconPosition === 'left' && icon}
          {children}
          {iconPosition === 'right' && icon}
        </span>
      )
    }

    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...(!asChild && motionProps)}
        {...props}
      >
        {renderContent()}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export default Button 