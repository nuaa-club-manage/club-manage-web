import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '../../components/icons';
import { getPendingActivities, auditActivity } from '../../services/adminApi';
import type { ApiActivity } from '../../services/activityApi';

const AdminActivityApprovalPage: React.FC = () => {
  const [pendingActivities, setPendingActivities] = useState<ApiActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState<string | null>(null);

  useEffect(() => {
    getPendingActivities()
      .then(setPendingActivities)
      .catch(() => setPendingActivities([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAudit = async (activity: ApiActivity, pass: boolean) => {
    setAuditing(activity.activityId);
    try {
      const msg = await auditActivity(activity.activityId, pass);
      alert(msg);
      setPendingActivities(prev => prev.filter(a => a.activityId !== activity.activityId));
    } catch (err: any) {
      alert(err.message ?? '审核失败，请重试');
    } finally {
      setAuditing(null);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">活动发布审核</h1>

      {loading ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-xl text-gray-500 dark:text-gray-400">加载中...</p>
        </div>
      ) : pendingActivities.length > 0 ? (
        <div className="space-y-6">
          {pendingActivities.map(activity => (
            <div key={activity.activityId} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activity.title}</h2>
                <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 mt-1">{activity.clubName}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm max-w-lg">{activity.content || '暂无简介'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  地点：{activity.location || '-'} · 人数限制：{activity.capacityLimit ?? '-'} ·
                  发布时间：{activity.publishTime ? new Date(activity.publishTime).toLocaleString('zh-CN') : '-'}
                </p>
              </div>
              <div className="flex-shrink-0 flex space-x-3">
                <button
                  onClick={() => handleAudit(activity, true)}
                  disabled={auditing === activity.activityId}
                  className="inline-flex items-center justify-center px-5 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
                >
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  批准
                </button>
                <button
                  onClick={() => handleAudit(activity, false)}
                  disabled={auditing === activity.activityId}
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
          <p className="text-xl text-gray-500 dark:text-gray-400">当前没有待审核的活动。</p>
        </div>
      )}
    </div>
  );
};

export default AdminActivityApprovalPage;
