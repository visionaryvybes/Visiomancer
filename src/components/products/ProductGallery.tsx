import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isVideo?: boolean;
  videoUrl?: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  className?: string;
}

export default function ProductGallery({ 
  images, 
  className = '' 
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(
    images.length > 0 ? images[0] : null
  );
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  
  const mainImageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (images.length > 0 && !selectedImage) {
      setSelectedImage(images[0]);
    }
  }, [images, selectedImage]);
  
  useEffect(() => {
    setLoading(true);
    
    if (selectedImage?.isVideo && videoRef.current) {
      videoRef.current.load();
      videoRef.current.onloadeddata = () => setLoading(false);
    }
  }, [selectedImage]);
  
  const handleImageLoad = () => {
    setLoading(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current || !isZoomed) return;
    
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    setZoomPosition({ x, y });
  };
  
  const toggleZoom = () => {
    if (selectedImage?.isVideo) return;
    setIsZoomed(!isZoomed);
  };
  
  if (images.length === 0) {
    return (
      <div className={`relative aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`}>
        <div className="flex h-full items-center justify-center">
          <svg className="h-16 w-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-12 gap-4">
        {/* Thumbnails - Desktop */}
        <div className="col-span-2 hidden flex-col gap-4 sm:flex">
          {images.slice(0, 5).map((image, index) => (
            <motion.button
              key={image.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedImage(image)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                selectedImage?.id === image.id 
                  ? 'border-primary-500' 
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {image.isVideo ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : null}
              <img
                src={image.url}
                alt={image.alt}
                className="h-full w-full object-cover"
              />
              {index === 4 && images.length > 5 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <span className="text-sm font-medium text-white">+{images.length - 5}</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
        
        {/* Main Image */}
        <div 
          ref={mainImageRef}
          className={`relative col-span-12 aspect-square sm:col-span-10 ${
            selectedImage?.isVideo ? '' : 'cursor-zoom-in'
          } ${isZoomed ? 'cursor-zoom-out' : ''}`}
          onClick={toggleZoom}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isZoomed && setIsZoomed(false)}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"></div>
            </div>
          )}
          
          <AnimatePresence mode="wait">
            {selectedImage && (
              <motion.div
                key={selectedImage.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full overflow-hidden rounded-lg bg-white dark:bg-gray-800"
              >
                {selectedImage.isVideo ? (
                  <video
                    ref={videoRef}
                    controls
                    className="h-full w-full object-cover"
                    onLoadedData={handleImageLoad}
                    poster={selectedImage.url}
                  >
                    <source src={selectedImage.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="relative h-full w-full">
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.alt}
                      className="h-full w-full object-contain"
                      onLoad={handleImageLoad}
                      style={{ opacity: isZoomed ? 0.4 : 1 }}
                    />
                    
                    {isZoomed && (
                      <div
                        className="absolute inset-0 bg-no-repeat"
                        style={{
                          backgroundImage: `url(${selectedImage.url})`,
                          backgroundSize: '200%',
                          backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }}
                      />
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Navigation arrows */}
          {images.length > 1 && !isZoomed && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = images.findIndex(img => img.id === selectedImage?.id);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                  setSelectedImage(images[prevIndex]);
                }}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md transition-colors hover:bg-white dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = images.findIndex(img => img.id === selectedImage?.id);
                  const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                  setSelectedImage(images[nextIndex]);
                }}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md transition-colors hover:bg-white dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile thumbnails */}
      <div className="mt-4 flex gap-2 overflow-x-auto sm:hidden">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${
              selectedImage?.id === image.id 
                ? 'border-primary-500' 
                : 'border-transparent'
            }`}
          >
            {image.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <img
              src={image.url}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
} 