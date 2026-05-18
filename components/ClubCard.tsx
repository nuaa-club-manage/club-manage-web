import React from 'react';
import { Link } from 'react-router-dom';
import type { Club } from '../types';
import { UsersIcon, ArrowRightIcon } from './icons';
import StarRating from './StarRating';
import type { ClubAverageScore } from '../services/ratingApi';

interface ClubCardProps {
  club: Club;
  averageScore?: ClubAverageScore;
}

const ClubCard: React.FC<ClubCardProps> = ({ club, averageScore }) => {
  const score = averageScore ? averageScore.averageScore : club.rating.score;
  const count = averageScore ? averageScore.ratingCount : club.rating.count;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group">
      <div className="relative">
        <img className="w-full h-48 object-cover" src={club.imageUrl} alt={club.name} />
        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 m-2 rounded-full">{club.category}</div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{club.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 h-12 overflow-hidden text-ellipsis">{club.description}</p>
        <div className="flex items-center justify-between mb-4">
          <StarRating rating={score} readOnly />
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({count} 评价)</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <UsersIcon className="w-5 h-5" />
            <span>{club.memberCount} 成员</span>
          </div>
          <Link
            to={`/clubs/${club.clubId ?? club.id}`}
            className="inline-flex items-center font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300"
          >
            查看详情
            <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
