import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { ErrorBoundary } from './ErrorBoundary'
import { useImageLoader } from '../hooks/useImageLoader'

interface ImageGalleryProps {
  images: Array<{ src: string }>
  title: string
}

function ImageGalleryContent({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const { isLoading, error, handleLoad, handleError } = useImageLoader(
    images[currentIndex]?.src
  )

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious()
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'Escape') setIsZoomed(false)
  }

  if (error) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg border border-white/10 bg-black/20 backdrop-blur-sm">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
        <Image
          src={images[currentIndex]?.src || '/placeholder.jpg'}
          alt={`${title} - View ${currentIndex + 1}`}
          fill
          className={`object-contain p-6 transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          onLoad={handleLoad}
          onError={handleError}
        />

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute bottom-4 right-4 rounded-full bg-black/80 p-2 text-white hover:bg-black transition-colors"
          aria-label="Zoom image"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/80 p-2 text-white hover:bg-black transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/80 p-2 text-white hover:bg-black transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => {
            const { isLoading: thumbLoading, handleLoad: handleThumbLoad, handleError: handleThumbError } = useImageLoader(image.src)
            
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-square overflow-hidden rounded-lg bg-white transition-all ${
                  currentIndex === index 
                    ? 'ring-2 ring-blue-500' 
                    : 'hover:ring-2 hover:ring-blue-500/50'
                }`}
              >
                {thumbLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  </div>
                )}
                <Image
                  src={image.src}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  fill
                  className={`object-contain p-2 transition-opacity duration-300 ${
                    thumbLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  sizes="25vw"
                  onLoad={handleThumbLoad}
                  onError={handleThumbError}
                />
              </button>
            )
          })}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
          <div className="absolute right-4 top-4 z-10">
            <button
              onClick={() => setIsZoomed(false)}
              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              aria-label="Close zoom view"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={4}
            centerOnInit
            wheel={{ step: 0.1 }}
          >
            <TransformComponent
              wrapperClass="w-full h-full"
              contentClass="w-full h-full flex items-center justify-center"
            >
              <div className="relative h-full w-full">
                <Image
                  src={images[currentIndex]?.src || '/placeholder.jpg'}
                  alt={`${title} - Zoomed View`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </TransformComponent>
          </TransformWrapper>

          {/* Navigation in Zoom View */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function ImageGallery(props: ImageGalleryProps) {
  return (
    <ErrorBoundary>
      <ImageGalleryContent {...props} />
    </ErrorBoundary>
  )
} 