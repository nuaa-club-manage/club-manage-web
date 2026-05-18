import React from 'react';
import { Link } from 'react-router-dom';
import type { Activity } from '../types';
import { CalendarIcon, ClockIcon, LocationMarkerIcon, ArrowRightIcon } from './icons';

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const [year, month, day] = activity.date.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const monthName = date.toLocaleString('default', { month: 'short' });

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out group">
      <img className="w-full h-48 object-cover" src={activity.imageUrl} alt={activity.title} />
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-start">
            <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400">{activity.club}</p>
            <div className="text-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1 flex-shrink-0">
              <p className="text-xs font-bold text-red-500">{monthName.toUpperCase()}</p>
              <p className="text-xl font-extrabold text-gray-800 dark:text-gray-100">{day}</p>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-2">{activity.title}</h3>
          <div className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4" />
              <span>{new Date(activity.date).toDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4" />
              <span>{activity.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LocationMarkerIcon className="w-4 h-4" />
              <span>{activity.location}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 text-right">
          <Link to={`/activities/${activity.activityId ?? activity.id}`} className="inline-flex items-center font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300">
            查看详情
            <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;