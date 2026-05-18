import React, { useState, useEffect, useCallback } from 'react';
import { getClubs } from '../../services/clubApi';
import type { ApiClub } from '../../services/clubApi';
import { getClubAverageScores } from '../../services/ratingApi';
import type { ClubAverageScore } from '../../services/ratingApi';
import StarRating from '../../components/StarRating';
import { SearchIcon } from '../../components/icons';

const AdminClubListPage: React.FC = () => {
  const [clubs, setClubs] = useState<ApiClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [averageScores, setAverageScores] = useState<ClubAverageScore[]>([]);

  const fetchClubs = useCallback((query: string) => {
    setLoading(true);
    getClubs(query || undefined)
      .then(setClubs)
      .catch(() => setClubs([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchClubs(searchQuery);
  }, [searchQuery, fetchClubs]);

  useEffect(() => {
    getClubAverageScores().then(setAverageScores).catch(() => {});
  }, []);

  const getScore = (clubId: string) =>
    averageScores.find(s => s.clubId === clubId);

  const handleSearch = () => setSearchQuery(searchInput);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">社团列表</h1>

      <div className="mb-6 flex gap-3">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="搜索社团名称..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
        >
          搜索
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">加载中...</div>
      ) : clubs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">暂无社团</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">社团名称</th>
                <th className="px-6 py-3 text-left">学院</th>
                <th className="px-6 py-3 text-left">状态</th>
                <th className="px-6 py-3 text-left">成立时间</th>
                <th className="px-6 py-3 text-left">评分</th>
                <th className="px-6 py-3 text-left">评价人数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {clubs.map(club => {
                const score = getScore(club.clubId);
                return (
                  <tr key={club.clubId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {club.clubName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {club.school || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        {club.clubState}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {club.establishmentTime
                        ? new Date(club.establishmentTime).toLocaleDateString('zh-CN')
                        : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {score ? (
                        <div className="flex items-center gap-2">
                          <StarRating rating={score.averageScore} readOnly size="w-4 h-4" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {score.averageScore.toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">暂无</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {score ? score.ratingCount : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminClubListPage;
