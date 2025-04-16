import { Heart, ShoppingCart, Star, Eye, Sparkles, Tag, Award, Zap } from 'lucide-react';
import { Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define confetti properties for the wishlist animation
interface Confetti {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}

// Function to generate confetti pieces
const generateConfetti = (count: number): Confetti[] => {
  const colors = ['#FF5E5B', '#D8D8D8', '#FF9D5C', '#8A4FFF', '#0CD15B'];
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 60 - 30, // -30 to 30
    y: Math.random() * -40 - 10, // -50 to -10
    size: Math.random() * 8 + 4, // 4 to 12
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360, // 0 to 360
  }));
};

interface ProductCardProps {
  product: any; // Use any to accommodate both Product types
  index?: number; // For staggered animations
}

// Helper to safely get image URL from different Product types
const getImageUrl = (product: any): string => {
  if (!product.images) return '/placeholder.svg';
  
  // Handle array of strings (from types/index.ts)
  if (typeof product.images[0] === 'string') {
    return product.images[0];
  }
  
  // Handle array of objects with url property (from lib/types.ts)
  if (product.images[0]?.url) {
    return product.images[0].url;
  }
  
  return '/placeholder.svg';
};

// Function to get badge info based on product properties
const getBadgeInfo = (product: any) => {
  if (product.tags?.includes('new') || product.isNew) {
    return { text: 'NEW', icon: <Sparkles size={12} />, color: 'bg-purple-600' };
  }
  if (product.tags?.includes('sale') || product.isSale) {
    return { text: 'SALE', icon: <Tag size={12} />, color: 'bg-rose-600' };
  }
  if (product.tags?.includes('bestseller') || product.isBestSeller) {
    return { text: 'BEST SELLER', icon: <Award size={12} />, color: 'bg-amber-500' };
  }
  if (product.rating?.value && product.rating.value >= 4.5) {
    return { text: 'TOP RATED', icon: <Star size={12} />, color: 'bg-blue-600' };
  }
  return { text: 'NEW', icon: <Sparkles size={12} />, color: 'bg-purple-600' };
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const isWishlisted = isInWishlist(product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isWishlistAnimating, setIsWishlistAnimating] = useState(false);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCartAnimation, setShowCartAnimation] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Badge info
  const badge = getBadgeInfo(product);

  // Calculate animation delay based on index
  const animationDelay = index * 0.1;
  
  // 3D Tilt effect - using custom logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  
  const resetTilt = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    // Simulate adding to cart with loading state
    setTimeout(() => {
      addItem(product, 1);
      setIsAddingToCart(false);
      setIsAddedToCart(true);
      
      // Show cart animation
      setShowCartAnimation(true);
      
      // Hide animation after it completes
      setTimeout(() => {
        setShowCartAnimation(false);
      }, 1000);
      
      // Reset success state after 2 seconds
      setTimeout(() => {
        setIsAddedToCart(false);
      }, 2000);
      
      toast.success(`${product.name} added to cart!`, {
        icon: '🛒',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }, 600);
  };
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsWishlistAnimating(true);
    
    // If we're adding to wishlist (not already in wishlist), show confetti
    if (!isWishlisted) {
      setConfetti(generateConfetti(30));
      setShowConfetti(true);
      
      // Hide confetti after animation completes
      setTimeout(() => {
        setShowConfetti(false);
      }, 2000);
    }
    
    toggleWishlist(product.id);
    
    setTimeout(() => {
      setIsWishlistAnimating(false);
    }, 1000);
  };
  
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Get image URL from product
  const imageUrl = getImageUrl(product);
  // Get rating info safely
  const rating = product.rating?.value || 0;
  const ratingCount = product.rating?.count || 0;
  // Get stock info
  const stock = product.stock || 0;
  // Get pricing info
  const price = product.price || 0;
  const compareAtPrice = product.salePrice || product.compareAtPrice || null;
  
  // State for parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Handle mouse move for parallax effect
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    setMousePosition({ x, y });
  };

  // Reset mouse position when mouse leaves
  const handleImageMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  // Framer-motion animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: animationDelay,
        ease: [0.19, 1.0, 0.22, 1.0], // Ease out expo for smooth entrance
      }
    },
    hover: {
      y: -12,
      transition: {
        duration: 0.4,
        ease: [0.19, 1.0, 0.22, 1.0],
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const badgeVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: animationDelay + 0.2
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  const priceVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    },
    jump: {
      y: [0, -8, 0],
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    success: { 
      backgroundColor: "#10b981", // green-500
      transition: { duration: 0.3 }
    }
  };

  const heartVariants = {
    beat: {
      scale: [1, 1.3, 1, 1.3, 1],
      transition: {
        duration: 0.8,
        times: [0, 0.2, 0.4, 0.6, 1],
        ease: "easeInOut"
      }
    }
  };

  // Add cart animation variants - Temporarily removed to debug compile error
  // const cartAnimationVariants = {
  //   initial: { 
  //     scale: 0.5, 
  //     x: 0, 
  //     y: 0, 
  //     opacity: 0 
  //   },
  //   animate: { 
  //     scale: 1, 
  //     opacity: 1,
  //     transition: { duration: 0.2 } 
  //   },
  //   exit: { 
  //     scale: 0.5, 
  //     x: -100, 
  //     y: -100, 
  //     opacity: 0,
  //     transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  //   }
  // };

  return (
    <motion.div 
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover="hover"
      className="glass-effect rounded-xl overflow-hidden transition-all duration-500 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        resetTilt();
      }}
      onMouseMove={handleMouseMove}
    >
      <Link href={`/products/${product.id}`} className="block relative">
        <div 
          ref={imageRef} 
          className="relative h-60 overflow-hidden bg-gray-800"
          onMouseMove={handleImageMouseMove}
          onMouseLeave={handleImageMouseLeave}
        >
          <motion.div 
            className="absolute inset-0"
            variants={imageVariants}
            style={{ 
              x: mousePosition.x * 15, 
              y: mousePosition.y * 15,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 120,
              mass: 0.5
            }}
          >
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="transition-all duration-700"
            />
          </motion.div>
          
          {/* Cart animation - Temporarily removed to debug compile error */}
          {/* <AnimatePresence>
            {showCartAnimation && (
              <motion.div
                className="absolute z-30 pointer-events-none"
                style={{ 
                  top: '50%', 
                  left: '50%',
                  marginLeft: '-20px',
                  marginTop: '-20px' 
                }}
                variants={cartAnimationVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="bg-green-500 text-white rounded-full p-3 shadow-lg">
                  <ShoppingCart size={16} />
                </div>
              </motion.div>
            )}
          </AnimatePresence> */}
          
          {/* Confetti effect for wishlist animation */}
          <AnimatePresence>
            {showConfetti && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
                {confetti.map((piece) => (
                  <motion.div
                    key={piece.id}
                    className="absolute"
                    style={{
                      width: piece.size,
                      height: piece.size,
                      backgroundColor: piece.color,
                      borderRadius: '50%',
                      top: '50%',
                      left: '50%',
                      rotate: piece.rotation,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: piece.x * 5,
                      y: piece.y * 8,
                      opacity: 0,
                      rotate: piece.rotation + Math.random() * 360,
                    }}
                    transition={{
                      duration: 1.5 + Math.random() * 1.5,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
          
          {/* Overlay that appears on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center"
              >
                <div className="flex items-center gap-4">
                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileHover={!isAddingToCart && !isAddedToCart ? "hover" : undefined}
                    whileTap={!isAddingToCart && !isAddedToCart ? "tap" : undefined}
                    animate={isAddedToCart ? "success" : "initial"}
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`p-2.5 backdrop-blur-sm rounded-full text-white hover:text-gray-900 ${
                      isAddedToCart 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white/10 hover:bg-white'
                    }`}
                  >
                    {isAddingToCart ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : isAddedToCart ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <ShoppingCart size={18} />
                    )}
                  </motion.button>
                  <motion.button 
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleToggleWishlist}
                    className={`p-2.5 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-gray-900 ${
                      isWishlisted ? 'bg-red-600' : 'bg-white/10'
                    }`}
                  >
                    <motion.div
                      variants={heartVariants}
                      animate={isWishlistAnimating ? "beat" : ""}
                    >
                      <Heart 
                        size={18} 
                        className={isWishlisted ? 'fill-current' : ''} 
                      />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Product badge */}
          <motion.div 
            variants={badgeVariants}
            initial="initial"
            animate="animate"
            whileInView="pulse"
            className={`absolute top-2 left-2 px-3 py-1 ${badge.color} text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg`}
          >
            {badge.icon}
            {badge.text}
          </motion.div>
          
          {/* Stock indicator */}
          {stock > 0 && stock < 5 && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: animationDelay + 0.3 }}
              className="absolute top-2 right-2 px-3 py-1 bg-red-600/80 backdrop-blur-sm text-white text-xs font-bold rounded-full"
            >
              Only {stock} left
            </motion.div>
          )}
        </div>
      </Link>
      
      <div className="p-5 relative">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold mb-2 line-clamp-1 text-white transition-all duration-300 group-hover:text-purple-400">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-1 transition-all duration-300">
          Premium quality product
        </p>
        
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-white/10">
          <motion.div
            variants={priceVariants}
            initial="initial"
            animate="animate"
            whileHover="jump"
          >
            {compareAtPrice ? (
              <div className="flex flex-col">
                <p className="font-bold text-white">${price.toFixed(2)}</p>
                <p className="text-xs text-gray-400 line-through">${compareAtPrice.toFixed(2)}</p>
              </div>
            ) : (
              <p className="font-bold text-white">${price.toFixed(2)}</p>
            )}
          </motion.div>
          
          <motion.button 
            variants={buttonVariants}
            initial="initial"
            whileHover={!isAddingToCart && !isAddedToCart ? "hover" : undefined}
            whileTap={!isAddingToCart && !isAddedToCart ? "tap" : undefined}
            animate={isAddedToCart ? "success" : "initial"}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={`${
              isAddingToCart || isAddedToCart 
                ? 'w-10 h-10' 
                : 'p-2.5 w-10 h-10'
            } flex items-center justify-center bg-purple-600 rounded-full hover:bg-purple-500 overflow-hidden`}
          >
            {isAddingToCart ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isAddedToCart ? (
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <ShoppingCart size={18} className="text-white" />
            )}
          </motion.button>
        </div>
        
        {/* Shine effect is handled by CSS in animations.css */}
        <div className="tilt-card-shine"></div>
      </div>
    </motion.div>
  );
} 