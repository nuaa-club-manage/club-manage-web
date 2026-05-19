import React, { useState, useEffect, useCallback } from 'react';
import ClubCard from '../components/ClubCard';
import { SearchIcon } from '../components/icons';
import { getClubAverageScores } from '../services/ratingApi';
import type { ClubAverageScore } from '../services/ratingApi';
import { getClubs } from '../services/clubApi';
import type { ApiClub } from '../services/clubApi';
import { getMemberCountMap } from '../services/clubApi';
import type { Club } from '../types';

function apiClubToClub(c: ApiClub): Club {
  return {
    id: 0,
    name: c.clubName,
    description: c.clubInformation || '',
    memberCount: 0,
    category: c.school || '未分类',
    imageUrl: `https://picsum.photos/seed/${c.clubId}/600/400`,
    rating: { score: 0, count: 0 },
    members: [],
    joinRequests: [],
    status: 'approved',
    clubId: c.clubId,
  };
}

const ClubListPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [averageScores, setAverageScores] = useState<ClubAverageScore[]>([]);

  const fetchClubs = useCallback((query: string) => {
    setLoading(true);
    getClubs(query || undefined)
      .then(async (data) => {
        const memberCountMap = await getMemberCountMap(data.map(c => c.clubId));
        setClubs(data.map(c => ({ ...apiClubToClub(c), memberCount: memberCountMap[c.clubId] ?? 0 })));
      })
      .catch(() => setClubs([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchClubs(searchQuery);
  }, [searchQuery, fetchClubs]);

  useEffect(() => {
    getClubAverageScores()
      .then(setAverageScores)
      .catch(() => {});
  }, []);

  const getScore = (clubId: string) =>
    averageScores.find(s => s.clubId === clubId);

  const handleSearch = () => setSearchQuery(searchInput);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">发现我们的社团</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">浏览各种类型的社团，找到最适合您的一个。</p>
      </div>

      <div className="mb-10 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder="搜索社团..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
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
      ) : clubs.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">暂无社团</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {clubs.map(club => (
            <ClubCard key={club.clubId} club={club} averageScore={getScore(club.clubId!)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubListPage;
