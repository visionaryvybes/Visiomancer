import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Default to first image if images array is empty
  const currentImage = images[selectedImageIndex] || { id: 'default', url: '/placeholder.jpg', alt: 'Product image' };

  // Handle mouse move for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setMousePosition({ x, y });
  };

  // Reset selected image when images change
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [images.length]);

  // Navigate to next/previous image
  const navigateImage = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        ref={mainImageRef}
        className="relative aspect-square overflow-hidden rounded-xl bg-gray-900/10 dark:bg-gray-800/20 
                 cursor-zoom-in border border-gray-200 dark:border-gray-700"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentImage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <Image
              src={currentImage.url}
              alt={currentImage.alt || `${productName} image`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={90}
              priority={selectedImageIndex === 0}
              className={`object-cover transition duration-300 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    }
                  : undefined
              }
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center 
                       rounded-full bg-white/80 text-gray-800 shadow-lg backdrop-blur-sm 
                       hover:bg-white dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center 
                       rounded-full bg-white/80 text-gray-800 shadow-lg backdrop-blur-sm 
                       hover:bg-white dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-md border transition 
                       ${selectedImageIndex === index 
                         ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' 
                         : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'}`}
              aria-label={`View ${image.alt || 'product image'}`}
              aria-current={selectedImageIndex === index}
            >
              <Image
                src={image.url}
                alt={image.alt || `${productName} thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 20vw, 10vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 