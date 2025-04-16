'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroScene() {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageSrc, setImageSrc] = useState('/images/nasa.jpeg');

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate particles with improved appearance
  const generateParticles = () => {
    const particles = [];
    const count = 200; // Increased number of particles

    // Use fixed speeds instead of random speeds to avoid hydration errors
    const speeds = [0.5, 0.8, 1.0, 1.2, 1.5, 1.8, 2.0, 2.5];

    for (let i = 0; i < count; i++) {
      // Larger size range for stars
      const size = Math.floor(Math.random() * 3) + 1; // Random size between 1-4px
      const speed = speeds[i % speeds.length]; // Use fixed speeds from the array
      const initialX = Math.floor(Math.random() * 100);
      const initialY = Math.floor(Math.random() * 100);
      const delay = Math.floor(Math.random() * 8); // Longer animation delay spread
      const duration = Math.floor(Math.random() * 3) + 3; // Random duration between 3-6s

      // Add more larger "brighter" stars
      const isBright = i % 8 === 0;
      const brightness = isBright ? 1 : 0.7 + (Math.floor(Math.random() * 3) / 10);

      particles.push(
        <div
          key={i}
          className={`particle absolute rounded-full ${isBright ? 'twinkle' : ''}`}
          data-speed={speed.toString()} // Convert to string to ensure consistency
          style={{
            width: `${isBright ? size + 1 : size}px`,
            height: `${isBright ? size + 1 : size}px`,
            left: `${initialX}%`,
            top: `${initialY}%`,
            backgroundColor: isBright ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)',
            boxShadow: isBright ? '0 0 8px 2px rgba(255, 255, 255, 0.8)' : 'none',
            filter: `brightness(${brightness})`,
            animationDelay: `${delay}s`,
            '--twinkle-duration': `${duration}s`,
            '--twinkle-delay': `${delay}s`,
            transform: `translate(${mousePosition.x * -10 * speed}px, ${mousePosition.y * -10 * speed}px)`,
            transition: 'transform 0.2s ease-out'
          } as React.CSSProperties}
        />
      );
    }

    return particles;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-black rounded-lg"
    >
      {/* Main galaxy image container with parallax */}
      <motion.div 
        className="absolute inset-0 galaxy-image"
        animate={{
          x: mousePosition.x * -20,
          y: mousePosition.y * -20,
          scale: 1.6
        }}
        transition={{ type: "spring", stiffness: 60, damping: 30 }}
      >
        <Image
          src={imageSrc}
          alt="Cosmic background"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={100}
          priority
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            console.log("Failed to load galaxy image, using fallback");
            setImageSrc('/images/nasa.jpeg');
            setIsLoaded(true);
          }}
          className={`object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </motion.div>

      {/* Circular vignette overlay for the cosmic effect */}
      <div className="absolute inset-0 rounded-lg opacity-80"
           style={{
             background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.9) 100%)',
             transform: 'scale(1.6)'
           }} />

      {/* Stars layer with different parallax speed */}
      <motion.div 
        className="absolute inset-0 stars-layer"
        animate={{
          x: mousePosition.x * -10,
          y: mousePosition.y * -10
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <div className="absolute inset-0 opacity-80" style={{
          backgroundImage: `radial-gradient(white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </motion.div>

      {/* Animated glow effects */}
      <div className="absolute left-1/4 top-1/3 w-32 h-32 rounded-full bg-purple-500/30 blur-3xl animate-pulse"></div>
      <div className="absolute right-1/3 bottom-1/3 w-24 h-24 rounded-full bg-blue-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40 rounded-lg" />

      {/* Particles effect with mouse parallax */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {generateParticles()}
      </div>
    </div>
  );
} 