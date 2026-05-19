import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateUserProfile } from '../../services/adminApi';
import type { AdminUserRecord } from '../../types';

const AdminEditUserPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state as AdminUserRecord | undefined;

  const [formData, setFormData] = useState({
    targetUserID: user?.userId ?? '',
    userName: user?.userName ?? '',
    realName: user?.realName ?? '',
    phoneNumber: user?.phoneNumber ?? '',
    userMailbox: user?.userMailbox ?? '',
    gender: user?.gender ?? '',
    degree: user?.degree ?? '',
    school: user?.school ?? '',
    userPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const msg = await updateUserProfile(formData);
      alert(msg);
      navigate('/admin/users');
    } catch (err: any) {
      alert(err.message ?? '修改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
        修改用户资料
        {user && <span className="ml-3 text-lg font-normal text-gray-500 dark:text-gray-400">— {user.userId}</span>}
      </h1>
      <form onSubmit={handleSubmit} className="max-w-3xl bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>学号（不可修改）</label>
            <input type="text" value={formData.targetUserID} disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md sm:text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed" />
          </div>
          <div>
            <label htmlFor="userName" className={labelClass}>用户名</label>
            <input id="userName" name="userName" type="text" value={formData.userName} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="realName" className={labelClass}>真实姓名</label>
            <input id="realName" name="realName" type="text" value={formData.realName} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="phoneNumber" className={labelClass}>手机号</label>
            <input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="userMailbox" className={labelClass}>邮箱</label>
            <input id="userMailbox" name="userMailbox" type="email" value={formData.userMailbox} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="gender" className={labelClass}>性别</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
              <option value="">请选择</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div>
            <label htmlFor="degree" className={labelClass}>学历</label>
            <select id="degree" name="degree" value={formData.degree} onChange={handleChange} className={inputClass}>
              <option value="">请选择</option>
              <option value="专科">专科</option>
              <option value="本科">本科</option>
              <option value="硕士">硕士</option>
              <option value="博士">博士</option>
            </select>
          </div>
          <div>
            <label htmlFor="school" className={labelClass}>学校</label>
            <input id="school" name="school" type="text" value={formData.school} onChange={handleChange} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="userPassword" className={labelClass}>新密码（留空则不修改）</label>
            <input id="userPassword" name="userPassword" type="password" value={formData.userPassword}
              onChange={handleChange} className={inputClass} placeholder="留空则不修改密码" autoComplete="new-password" />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-2">
          <button type="button" onClick={() => navigate('/admin/users')}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            取消
          </button>
          <button type="submit" disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            {loading ? '保存中...' : '保存更改'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditUserPage;
