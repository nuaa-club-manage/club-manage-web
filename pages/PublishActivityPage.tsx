import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getManagedClubs } from '../services/clubApi';
import type { ApiClub } from '../services/clubApi';
import { publishActivity } from '../services/activityApi';

const PublishActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const [managedClubs, setManagedClubs] = useState<ApiClub[]>([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clubId: '',
    title: '',
    content: '',
    location: '',
    capacityLimit: '',
  });

  useEffect(() => {
    getManagedClubs()
      .then(data => {
        setManagedClubs(data);
        if (data.length > 0) setFormData(f => ({ ...f, clubId: data[0].clubId }));
      })
      .catch(() => {})
      .finally(() => setClubsLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.clubId) { alert('请选择社团'); return; }
    setSubmitting(true);
    try {
      const msg = await publishActivity(
        formData.clubId,
        formData.title,
        formData.content,
        formData.location,
        parseInt(formData.capacityLimit),
      );
      alert(msg || '活动发布成功，等待管理员审核');
      navigate('/club-admin');
    } catch (err: any) {
      alert(err.message ?? '发布失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (!clubsLoading && managedClubs.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold">您没有管理任何社团</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">您需要先创建一个社团才能发布活动。</p>
        <button onClick={() => navigate('/club-admin')} className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg">
          返回社团管理
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">发布新活动</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">选择社团 *</label>
            <select
              name="clubId" value={formData.clubId} onChange={handleChange} required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {clubsLoading ? (
                <option>加载中...</option>
              ) : managedClubs.map(club => (
                <option key={club.clubId} value={club.clubId}>{club.clubName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">活动标题 *</label>
            <input
              type="text" name="title" value={formData.title} onChange={handleChange} required
              placeholder="例如：年度编程马拉松"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">活动地点 *</label>
            <input
              type="text" name="location" value={formData.location} onChange={handleChange} required
              placeholder="例如：将军路校区教学楼 A1-201"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">人数上限 *</label>
            <input
              type="number" name="capacityLimit" value={formData.capacityLimit} onChange={handleChange} required min={1}
              placeholder="例如：100"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">活动详情 *</label>
            <textarea
              name="content" value={formData.content} onChange={handleChange} required rows={5}
              placeholder="详细介绍活动内容、流程、注意事项等。"
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button" onClick={() => navigate('/club-admin')}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              取消
            </button>
            <button
              type="submit" disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              {submitting ? '发布中...' : '发布活动'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishActivityPage;
