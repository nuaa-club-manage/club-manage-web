import React from 'react';
import { mockActivities, mockClubs } from '../data/mockData';
import ActivityCard from '../components/ActivityCard';
import { SearchIcon, ChevronDownIcon } from '../components/icons';

const ActivityListPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">近期活动</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">不要错过即将举行的精彩活动。</p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="mb-10 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder="搜索活动..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="relative w-full md:w-64">
           <select className="w-full appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>所有社团</option>
                {[...new Set(mockClubs.map(c => c.name))].map(name => (
                    <option key={name}>{name}</option>
                ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
         <div className="relative w-full md:w-64">
           <input
            type="date"
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Activity List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockActivities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default ActivityListPage;