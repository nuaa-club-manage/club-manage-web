import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUser, mockClubs } from '../data/mockData';

const PublishActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const managedClubs = mockClubs.filter(club => mockUser.managedClubs.includes(club.id));
  
  const [formData, setFormData] = useState({
    title: '',
    clubId: managedClubs[0]?.id.toString() || '',
    date: '',
    time: '',
    location: '',
    description: '',
    imageUrl: '',
  });

  if (managedClubs.length === 0) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <h1 className="text-2xl font-bold">您没有管理任何社团</h1>
            <p className="mt-4 text-gray-600 dark:text-gray-300">您需要先创建一个社团才能发布活动。</p>
            <button onClick={() => navigate('/profile')} className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg">返回个人中心</button>
        </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to a backend API to create the activity
    const clubName = managedClubs.find(c => c.id === parseInt(formData.clubId))?.name;
    console.log('Publishing new activity:', { ...formData, club: clubName });
    alert(`活动 "${formData.title}" 已成功发布！ (这是一个模拟操作)`);
    navigate('/profile');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">发布新活动</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">活动标题</label>
            <input
              type="text" id="title" name="title" value={formData.title}
              onChange={handleChange} required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="例如：年度编程马拉松"
            />
          </div>
           <div>
            <label htmlFor="clubId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">选择社团</label>
            <select
              id="clubId" name="clubId" value={formData.clubId}
              onChange={handleChange} required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {managedClubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">日期</label>
                <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">时间</label>
                <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>
           <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">地点</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="例如：将军路校区教学楼 A1-201" />
           </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">活动描述</label>
            <textarea
              id="description" name="description" value={formData.description}
              onChange={handleChange} required rows={4}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="详细介绍您的活动内容。"
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">活动宣传图片 URL</label>
            <input
              type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl}
              onChange={handleChange} required
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://example.com/activity-banner.jpg"
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              发布活动
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishActivityPage;
