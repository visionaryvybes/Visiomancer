import React from 'react';

interface ProductReviewStarsProps {
  rating: number;
  maxRating?: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function ProductReviewStars({
  rating,
  maxRating = 5,
  reviewCount,
  showCount = true,
  size = 'medium',
  className = '',
}: ProductReviewStarsProps) {
  // Normalize rating to ensure it's between 0 and maxRating
  const normalizedRating = Math.max(0, Math.min(rating, maxRating));
  
  // Calculate the percentage of the rating for the partial star
  const percent = (normalizedRating % 1) * 100;
  
  // Determine how many full, partial, and empty stars to show
  const fullStars = Math.floor(normalizedRating);
  const hasPartialStar = percent > 0;
  const emptyStars = maxRating - fullStars - (hasPartialStar ? 1 : 0);
  
  // Size variations
  const sizeVariants = {
    small: {
      starSize: 'w-3.5 h-3.5',
      text: 'text-xs',
      gap: 'gap-0.5',
    },
    medium: {
      starSize: 'w-5 h-5',
      text: 'text-sm',
      gap: 'gap-1',
    },
    large: {
      starSize: 'w-6 h-6',
      text: 'text-base',
      gap: 'gap-1.5',
    },
  };
  
  const { starSize, text, gap } = sizeVariants[size];
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`flex ${gap}`}>
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <StarIcon 
            key={`full-${i}`} 
            className={`${starSize} text-yellow-400`} 
            filled 
          />
        ))}
        
        {/* Partial star */}
        {hasPartialStar && (
          <div className="relative">
            {/* Empty star in the background */}
            <StarIcon 
              className={`${starSize} text-gray-300 dark:text-gray-600`} 
              filled={false} 
            />
            
            {/* Partial filled star as an overlay */}
            <div 
              className="absolute inset-0 overflow-hidden" 
              style={{ width: `${percent}%` }}
            >
              <StarIcon 
                className={`${starSize} text-yellow-400`} 
                filled 
              />
            </div>
          </div>
        )}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <StarIcon 
            key={`empty-${i}`} 
            className={`${starSize} text-gray-300 dark:text-gray-600`} 
            filled={false} 
          />
        ))}
      </div>
      
      {/* Review count */}
      {showCount && reviewCount !== undefined && (
        <span className={`ml-2 ${text} text-gray-500 dark:text-gray-400`}>
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
}

// Helper component for stars
type StarIconProps = {
  className?: string;
  filled?: boolean;
};

function StarIcon({ className = '', filled = true }: StarIconProps) {
  return filled ? (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
      />
    </svg>
  ) : (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
} 