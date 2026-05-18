import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from '../services/userApi';
import { LockClosedIcon } from '../components/icons';

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('两次输入的新密码不一致');
      return;
    }
    setLoading(true);
    try {
      const msg = await updatePassword(formData.oldPassword, formData.newPassword);
      alert(msg);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err: any) {
      alert(err.message ?? '修改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 pl-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">修改密码</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-5">
        <div className="relative">
          <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">旧密码</label>
          <LockClosedIcon className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
          <input id="oldPassword" name="oldPassword" type="password" required autoComplete="current-password"
            value={formData.oldPassword} onChange={handleChange} className={inputClass} placeholder="请输入旧密码" />
        </div>
        <div className="relative">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">新密码</label>
          <LockClosedIcon className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
          <input id="newPassword" name="newPassword" type="password" required autoComplete="new-password"
            value={formData.newPassword} onChange={handleChange} className={inputClass} placeholder="请输入新密码" />
        </div>
        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">确认新密码</label>
          <LockClosedIcon className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
          <input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password"
            value={formData.confirmPassword} onChange={handleChange} className={inputClass} placeholder="请再次输入新密码" />
        </div>
        <div className="flex justify-end space-x-4 pt-2">
          <button type="button" onClick={() => navigate('/profile')}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            取消
          </button>
          <button type="submit" disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            {loading ? '提交中...' : '确认修改'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
