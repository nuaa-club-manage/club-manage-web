
import React, { useState } from 'react';
import { StarIcon } from './icons';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (newRating: number) => void;
  readOnly?: boolean;
  size?: string;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, readOnly = false, size = 'h-5 w-5', className = '' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (rate: number) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(rate);
    }
  };

  const handleMouseEnter = (rate: number) => {
    if (!readOnly) {
      setHoverRating(rate);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const currentRating = hoverRating || rating;

  return (
    <div className={`flex items-center ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readOnly}
          className={`text-gray-300 dark:text-gray-600 transition-colors ${!readOnly ? 'cursor-pointer' : ''} ${
            currentRating >= star ? 'text-yellow-400 dark:text-yellow-500' : ''
          }`}
          aria-label={`评价 ${star} 星`}
        >
          <StarIcon className={size} />
        </button>
      ))}
    </div>
  );
};

export default StarRating;