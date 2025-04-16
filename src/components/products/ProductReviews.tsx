import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  className?: string;
}

export default function ProductReviews({
  reviews,
  averageRating,
  totalReviews,
  className = '',
}: ProductReviewsProps) {
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent');
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);

  // Filter reviews based on star rating filter
  const filteredReviews = useMemo(() => {
    if (activeFilter === null) return reviews;
    return reviews.filter(review => review.rating === activeFilter);
  }, [reviews, activeFilter]);

  // Sort filtered reviews
  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.helpful - a.helpful;
      }
    });
  }, [filteredReviews, sortBy]);

  // Calculate rating distribution
  const ratingDistribution = useMemo(() => {
    const distribution = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
    
    reviews.forEach(review => {
      distribution[5 - review.rating]++;
    });
    
    return distribution.map(count => {
      const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
      return {
        count,
        percentage: Math.round(percentage),
      };
    });
  }, [reviews, totalReviews]);

  const toggleReviewExpand = (reviewId: string) => {
    setExpandedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
      <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
      
      <div className="mb-8 grid gap-8 sm:grid-cols-1 md:grid-cols-12">
        {/* Rating Overview */}
        <div className="col-span-4 md:border-r md:border-gray-200 md:pr-8 md:dark:border-gray-700">
          <div className="mb-4 text-center">
            <div className="mb-1 text-5xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="mb-2 flex justify-center">{renderStars(Math.round(averageRating))}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Based on {totalReviews} reviews</div>
          </div>
          
          <div className="mb-6 space-y-3">
            {ratingDistribution.map((data, index) => (
              <div key={5 - index} className="flex items-center">
                <span className="mr-2 w-10 text-sm">{5 - index} star</span>
                <div className="flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-2.5 rounded-full bg-yellow-400"
                    style={{ width: `${data.percentage}%` }}
                  ></motion.div>
                </div>
                <span className="ml-2 w-10 text-right text-sm text-gray-500 dark:text-gray-400">
                  {data.count}
                </span>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => setActiveFilter(null)}
              className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeFilter === null
                  ? 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All Reviews
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                onClick={() => setActiveFilter(prev => prev === rating ? null : rating)}
                className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === rating
                    ? 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {rating} Star
              </button>
            ))}
          </div>
        </div>
        
        {/* Reviews List */}
        <div className="col-span-8">
          {/* Sorting options */}
          <div className="mb-6 flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
              {activeFilter !== null && ` with ${activeFilter} ${activeFilter === 1 ? 'star' : 'stars'}`}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setSortBy('recent')}
                className={`rounded-lg px-3 py-1 text-sm transition-colors ${
                  sortBy === 'recent'
                    ? 'bg-gray-800 text-white dark:bg-gray-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Most Recent
              </button>
              <button
                onClick={() => setSortBy('helpful')}
                className={`rounded-lg px-3 py-1 text-sm transition-colors ${
                  sortBy === 'helpful'
                    ? 'bg-gray-800 text-white dark:bg-gray-700'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Most Helpful
              </button>
            </div>
          </div>
          
          {/* Reviews */}
          <AnimatePresence mode="wait">
            {sortedReviews.length > 0 ? (
              <motion.div
                key="reviews-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {sortedReviews.map(review => {
                  const isExpanded = expandedReviews.includes(review.id);
                  const isLongContent = review.content.length > 250;
                  
                  return (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-200 pb-6 last:border-0 last:pb-0 dark:border-gray-700"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center">
                          {review.userAvatar ? (
                            <img
                              src={review.userAvatar}
                              alt={review.userName}
                              className="mr-3 h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-800 dark:bg-primary-900 dark:text-primary-100">
                              {review.userName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{review.userName}</div>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              {review.verified && (
                                <span className="mr-2 flex items-center text-green-600 dark:text-green-400">
                                  <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Verified Purchase
                                </span>
                              )}
                              {formatDate(review.date)}
                            </div>
                          </div>
                        </div>
                        <div>
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      
                      <h3 className="mb-2 font-semibold">{review.title}</h3>
                      
                      <div className="mb-3 text-gray-700 dark:text-gray-300">
                        {isLongContent && !isExpanded
                          ? `${review.content.substring(0, 250)}...`
                          : review.content}
                          
                        {isLongContent && (
                          <button
                            onClick={() => toggleReviewExpand(review.id)}
                            className="ml-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            {isExpanded ? 'Read less' : 'Read more'}
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <button className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          Helpful ({review.helpful})
                        </button>
                        <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          Report
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="no-reviews"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-700"
              >
                <p className="text-gray-600 dark:text-gray-300">
                  {activeFilter
                    ? `No reviews with ${activeFilter} stars found.`
                    : 'No reviews yet.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Simple thumbs up/down icons
function ThumbsUpIcon({ className = 'h-5 w-5' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
    </svg>
  );
}

function ThumbsDownIcon({ className = 'h-5 w-5' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
    </svg>
  );
}

function XMarkIcon({ className = 'h-5 w-5' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
} 