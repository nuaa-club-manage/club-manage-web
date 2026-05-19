import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockActivities } from '../data/mockData';
import { getActivityParticipants } from '../services/activityApi';
import type { ActivityParticipant } from '../services/activityApi';
import MemberInfoModal from '../components/MemberInfoModal';
import type { PersonInfo } from '../components/MemberInfoModal';

const ActivityParticipantsPage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const activity = mockActivities.find(a => a.id === parseInt(activityId || ''));

  const [participants, setParticipants] = useState<ActivityParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<PersonInfo | null>(null);

  useEffect(() => {
    if (!activityId) return;
    setLoading(true);
    getActivityParticipants(activityId)
      .then(setParticipants)
      .catch(err => setError(err.message ?? '加载失败'))
      .finally(() => setLoading(false));
  }, [activityId]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
      <Link to="/profile" className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-6">
        ← 返回个人主页
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">报名人员列表</h1>
      {activity && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{activity.title}</p>
      )}

      {loading ? (
        <p className="text-center text-gray-400 py-20">加载中...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-20">{error}</p>
      ) : participants.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-20">暂无报名人员</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">#</th>
                <th className="px-6 py-3 text-left font-semibold">姓名</th>
                <th className="px-6 py-3 text-left font-semibold">学号 / 用户ID</th>
                <th className="px-6 py-3 text-left font-semibold">联系电话</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {participants.map((p, index) => (
                <tr key={p.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => setSelectedPerson({
                  userId: p.userId,
                  realName: p.realName,
                  phoneNumber: p.phoneNumber,
                })}>
                  <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.realName}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{p.userId}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{p.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 text-right text-xs text-gray-400">
            共 {participants.length} 人报名
          </div>
        </div>
      )}
      {selectedPerson && (
        <MemberInfoModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
      )}
    </div>
  );
};

export default ActivityParticipantsPage;
