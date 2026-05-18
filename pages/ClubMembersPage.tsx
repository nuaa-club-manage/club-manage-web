import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClubMembers } from '../services/memberApi';
import type { ClubMember } from '../services/memberApi';

const ClubMembersPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [clubName, setClubName] = useState('');

  useEffect(() => {
    if (!clubId) return;
    getClubMembers(clubId)
      .then(data => {
        setMembers(data);
        if (data.length > 0) setClubName(data[0].clubName);
      })
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, [clubId]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/club-admin" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">
          &larr; 返回社团管理
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          {clubName ? `${clubName} — 成员名单` : '成员名单'}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <p className="px-6 py-10 text-center text-gray-400">加载中...</p>
        ) : members.length === 0 ? (
          <p className="px-6 py-10 text-center text-gray-400">暂无成员</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">学号</th>
                  <th className="px-6 py-3">用户名</th>
                  <th className="px-6 py-3">真实姓名</th>
                  <th className="px-6 py-3">学院</th>
                  <th className="px-6 py-3">学历</th>
                  <th className="px-6 py-3">联系电话</th>
                  <th className="px-6 py-3">身份</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m, idx) => (
                  <tr key={m.userId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{m.userId}</td>
                    <td className="px-6 py-4">{m.userName}</td>
                    <td className="px-6 py-4">{m.realName || '-'}</td>
                    <td className="px-6 py-4">{m.school || '-'}</td>
                    <td className="px-6 py-4">{m.degree || '-'}</td>
                    <td className="px-6 py-4">{m.phoneNumber || '-'}</td>
                    <td className="px-6 py-4">
                      {m.clubManager === 'true' || m.clubManager === '1' ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">管理员</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">普通成员</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubMembersPage;
