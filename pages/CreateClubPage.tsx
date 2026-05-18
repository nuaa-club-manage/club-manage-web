import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClub } from '../services/clubApi';

const CreateClubPage: React.FC = () => {
  const navigate = useNavigate();
  const [clubName, setClubName] = useState('');
  const [clubInformation, setClubInformation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createClub(clubName, clubInformation);
      alert(`社团"${clubName}"已成功提交，等待管理员审核！`);
      navigate('/club-admin');
    } catch (err: any) {
      alert(err.message ?? '创建社团失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">成立一个新社团</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
          <div>
            <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">社团名称</label>
            <input
              type="text"
              id="clubName"
              value={clubName}
              onChange={e => setClubName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="例如：南京航空航天大学编程俱乐部"
            />
          </div>
          <div>
            <label htmlFor="clubInformation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">社团简介</label>
            <textarea
              id="clubInformation"
              value={clubInformation}
              onChange={e => setClubInformation(e.target.value)}
              required
              rows={4}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="详细介绍您的社团，包括其宗旨、常规活动等。"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '提交中...' : '创建社团'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClubPage;
