import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  perspective?: number;
  intensity?: number;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  scale?: number;
  speed?: number;
  reset?: boolean;
  glareEffect?: boolean;
  glareMaxOpacity?: number;
  glareColor?: string;
  glarePosition?: 'all' | 'top' | 'left' | 'right' | 'bottom';
  disabled?: boolean;
}

export default function TiltCard({
  children,
  className = '',
  perspective = 1000,
  intensity = 1,
  tiltMaxAngleX = 20,
  tiltMaxAngleY = 20,
  scale = 1.05,
  speed = 400,
  reset = true,
  glareEffect = false,
  glareMaxOpacity = 0.5,
  glareColor = 'rgba(255, 255, 255, 0.4)',
  glarePosition = 'all',
  disabled = false,
}: TiltCardProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glareOpacity, setGlareOpacity] = useState(0);
  const [glareCoordinates, setGlareCoordinates] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Calculate transforms based on mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate cursor position relative to card center (in %)
    const centerX = (rect.left + rect.width / 2);
    const centerY = (rect.top + rect.height / 2);
    
    // Mouse position relative to center (-1 to 1)
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);
    
    // Apply intensity factor and calculate tilt angles
    const tiltX = -relativeY * tiltMaxAngleX * intensity;
    const tiltY = relativeX * tiltMaxAngleY * intensity;
    
    // Update state
    setRotation({ x: tiltX, y: tiltY });
    
    // Update glare effect if enabled
    if (glareEffect) {
      setGlareOpacity(Math.min(Math.sqrt(relativeX ** 2 + relativeY ** 2), 1) * glareMaxOpacity);
      setGlareCoordinates({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    }
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setIsHovered(false);
    if (reset) {
      setRotation({ x: 0, y: 0 });
      if (glareEffect) {
        setGlareOpacity(0);
      }
    }
  };

  // Generate glare styles based on position setting
  const getGlareStyles = () => {
    if (!glareEffect) return {};

    let backgroundImage = '';
    let backgroundPosition = '';

    switch (glarePosition) {
      case 'top':
        backgroundImage = `linear-gradient(to bottom, ${glareColor} 0%, rgba(255,255,255,0) 100%)`;
        backgroundPosition = `50% 0%`;
        break;
      case 'bottom':
        backgroundImage = `linear-gradient(to top, ${glareColor} 0%, rgba(255,255,255,0) 100%)`;
        backgroundPosition = `50% 100%`;
        break;
      case 'left':
        backgroundImage = `linear-gradient(to right, ${glareColor} 0%, rgba(255,255,255,0) 100%)`;
        backgroundPosition = `0% 50%`;
        break;
      case 'right':
        backgroundImage = `linear-gradient(to left, ${glareColor} 0%, rgba(255,255,255,0) 100%)`;
        backgroundPosition = `100% 50%`;
        break;
      case 'all':
      default:
        // Construct the coordinate string safely
        const coordString = (isHovered && glareCoordinates.x !== undefined && glareCoordinates.y !== undefined) 
                          ? `${glareCoordinates.x}px ${glareCoordinates.y}px` 
                          : 'center'; // Default to center if not hovered or coords invalid
        backgroundImage = `radial-gradient(circle at ${coordString}, ${glareColor} 0%, rgba(255,255,255,0) 80%)`;
        backgroundPosition = 'center'; 
        break; // Added break statement
    }

    // Return individual properties
    return {
      backgroundImage,
      backgroundPosition,
      backgroundRepeat: 'no-repeat',
      opacity: isHovered ? glareOpacity : 0, // Ensure opacity is 0 when not hovered
    };
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn('relative transform-gpu overflow-hidden', className)}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotation.x,
        rotateY: rotation.y,
        scale: isHovered ? scale : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: speed / 1000,
      }}
    >
      {children}
      
      {/* Glare effect overlay */}
      {glareEffect && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={getGlareStyles()}
        />
      )}
    </motion.div>
  );
} 