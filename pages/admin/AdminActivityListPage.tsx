import React, { useState, useEffect, useCallback } from 'react';
import { SearchIcon, CalendarIcon, LocationMarkerIcon, ClubIcon } from '../../components/icons';
import { getPublishedActivities, getActivityDetail } from '../../services/activityApi';
import type { ApiActivity } from '../../services/activityApi';

const AdminActivityListPage: React.FC = () => {
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<ApiActivity | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchActivities = useCallback((query: string) => {
    setLoading(true);
    getPublishedActivities(query || undefined)
      .then(setActivities)
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchActivities(searchQuery);
  }, [searchQuery, fetchActivities]);

  const handleSearch = () => setSearchQuery(searchInput);

  const handleViewDetail = (a: ApiActivity) => {
    setSelectedActivity(a);
    setDetailLoading(true);
    getActivityDetail(a.activityId)
      .then(setSelectedActivity)
      .catch(() => {})
      .finally(() => setDetailLoading(false));
  };

  const detail = selectedActivity;
  const displayDate = detail?.publishTime
    ? new Date(detail.publishTime).toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : '-';

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">活动列表</h1>

      <div className="mb-6 flex gap-3">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="搜索活动标题..."
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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="px-6 py-10 text-center text-gray-400">加载中...</p>
        ) : activities.length === 0 ? (
          <p className="px-6 py-10 text-center text-gray-400">暂无活动</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">活动标题</th>
                  <th className="px-6 py-3">所属社团</th>
                  <th className="px-6 py-3">地点</th>
                  <th className="px-6 py-3">人数限制</th>
                  <th className="px-6 py-3">状态</th>
                  <th className="px-6 py-3">发布时间</th>
                  <th className="px-6 py-3">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {activities.map((a, idx) => (
                  <tr key={a.activityId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{a.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                        {a.clubName}
                      </span>
                    </td>
                    <td className="px-6 py-4">{a.location || '-'}</td>
                    <td className="px-6 py-4">{a.capacityLimit ?? '-'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        {a.activityState}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {a.publishTime ? new Date(a.publishTime).toLocaleDateString('zh-CN') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetail(a)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs font-semibold"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 活动详情弹窗 */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* 封面 */}
            <div className="relative w-full h-48">
              <img
                src={`https://picsum.photos/seed/${detail!.activityId}/600/400`}
                alt={detail!.title}
                className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-xl"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <p className="text-sm font-semibold mb-1">{detail!.clubName}</p>
                <h2 className="text-2xl font-extrabold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>{detail!.title}</h2>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-3 right-3 text-white bg-black/40 hover:bg-black/60 rounded-full w-8 h-8 flex items-center justify-center text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {detailLoading ? (
                <p className="text-center text-gray-400 py-6">加载中...</p>
              ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* 关于活动 */}
                  <div className="lg:w-1/2">
                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl">
                      <h3 className="text-lg font-bold mb-3">关于活动</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {detail!.content || '暂无简介'}
                      </p>
                    </div>
                  </div>

                  {/* 活动信息 */}
                  <div className="lg:w-1/2">
                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-xl space-y-4">
                      <div className="flex items-center space-x-3">
                        <CalendarIcon className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                        <div>
                          <p className="font-bold">{displayDate}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">发布日期</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <LocationMarkerIcon className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                        <div>
                          <p className="font-bold">{detail!.location || '-'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">地点</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 pt-3 border-t dark:border-gray-600">
                        <ClubIcon className="w-6 h-6 text-indigo-500 flex-shrink-0" />
                        <div>
                          <p className="font-bold">{detail!.clubName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">主办社团</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-4 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivityListPage;
