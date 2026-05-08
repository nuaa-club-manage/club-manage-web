import React from 'react';
import { mockClubs } from '../data/mockData';
import ClubCard from '../components/ClubCard';
import { SearchIcon, ChevronDownIcon } from '../components/icons';

const ClubListPage: React.FC = () => {
  const categories = [...new Set(mockClubs.map(club => club.category))];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">发现我们的社团</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">浏览各种类型的社团，找到最适合您的一个。</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-10 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder="搜索社团..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <div className="relative w-full md:w-64">
           <select className="w-full appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>所有分类</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Club Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {mockClubs.map(club => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
};

export default ClubListPage;