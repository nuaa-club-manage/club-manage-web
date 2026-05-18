import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '../../components/icons';
import { getPendingClubs, auditClub } from '../../services/adminApi';
import type { ApiClub } from '../../services/clubApi';

const AdminClubApprovalPage: React.FC = () => {
  const [pendingClubs, setPendingClubs] = useState<ApiClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState<string | null>(null);

  useEffect(() => {
    getPendingClubs()
      .then(setPendingClubs)
      .catch(() => setPendingClubs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAudit = async (club: ApiClub, pass: boolean) => {
    setAuditing(club.clubId);
    try {
      const msg = await auditClub(club.clubId, pass);
      alert(msg);
      setPendingClubs(prev => prev.filter(c => c.clubId !== club.clubId));
    } catch (err: any) {
      alert(err.message ?? '审核失败，请重试');
    } finally {
      setAuditing(null);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">社团成立审核</h1>

      {loading ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-xl text-gray-500 dark:text-gray-400">加载中...</p>
        </div>
      ) : pendingClubs.length > 0 ? (
        <div className="space-y-6">
          {pendingClubs.map(club => (
            <div key={club.clubId} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{club.clubName}</h2>
                <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 mt-1">{club.school || '未填写学院'}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm max-w-lg">{club.clubInformation || '暂无简介'}</p>
                <p className="text-xs text-gray-400 mt-2">
                  申请时间：{club.establishmentTime ? new Date(club.establishmentTime).toLocaleString('zh-CN') : '-'}
                </p>
              </div>
              <div className="flex-shrink-0 flex space-x-3">
                <button
                  onClick={() => handleAudit(club, true)}
                  disabled={auditing === club.clubId}
                  className="inline-flex items-center justify-center px-5 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
                >
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  批准
                </button>
                <button
                  onClick={() => handleAudit(club, false)}
                  disabled={auditing === club.clubId}
                  className="inline-flex items-center justify-center px-5 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
                >
                  <XCircleIcon className="w-5 h-5 mr-2" />
                  拒绝
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-xl text-gray-500 dark:text-gray-400">当前没有待审核的社团。</p>
        </div>
      )}
    </div>
  );
};

export default AdminClubApprovalPage;
