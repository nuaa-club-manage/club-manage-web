import React, { useState, useEffect, useCallback } from 'react';
import ActivityCard from '../components/ActivityCard';
import { SearchIcon } from '../components/icons';
import { getPublishedActivities, apiActivityToActivity } from '../services/activityApi';
import type { Activity } from '../types';

const ActivityListPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchActivities = useCallback((query: string) => {
    setLoading(true);
    getPublishedActivities(query || undefined)
      .then(data => setActivities(data.map(apiActivityToActivity)))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchActivities(searchQuery);
  }, [searchQuery, fetchActivities]);

  const handleSearch = () => setSearchQuery(searchInput);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">近期活动</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">不要错过即将举行的精彩活动。</p>
      </div>

      <div className="mb-10 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder="搜索活动..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
        >
          搜索
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">加载中...</div>
      ) : activities.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">暂无活动</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map(activity => (
            <ActivityCard key={activity.activityId} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityListPage;
