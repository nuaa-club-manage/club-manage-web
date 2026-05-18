import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserInfo, updateUserInfo } from '../services/userApi';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    realName: '',
    phoneNumber: '',
    userMailbox: '',
    gender: '',
    degree: '',
    school: '',
  });

  useEffect(() => {
    fetchUserInfo().then(info => {
      setFormData({
        userName: info.userName ?? '',
        realName: info.realName ?? '',
        phoneNumber: info.phoneNumber ?? '',
        userMailbox: info.userMailbox ?? '',
        gender: info.gender ?? '',
        degree: info.degree ?? '',
        school: info.school ?? '',
      });
    }).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const msg = await updateUserInfo(formData);
      alert(msg);
      navigate('/profile');
    } catch (err: any) {
      alert(err.message ?? '保存失败，请重试');
    }
  };

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">编辑个人资料</h1>
      <form onSubmit={handleSaveChanges} className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          <div className="sm:col-span-2">
            <label htmlFor="school" className={labelClass}>学院</label>
            <input id="school" name="school" type="text" value={formData.school} onChange={handleChange} className={inputClass} />
          </div>
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
            保存更改
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
