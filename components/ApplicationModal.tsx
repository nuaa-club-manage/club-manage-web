import React, { useState } from 'react';
import { XIcon, UsersIcon, PhoneIcon } from './icons';

interface ApplicationData {
  realName: string;
  phoneNumber: string;
}

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ApplicationData) => void;
  title: string;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, onSubmit, title }) => {
  const [formData, setFormData] = useState<ApplicationData>({
    realName: '',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ realName: '', phoneNumber: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-label="关闭">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            <div className="relative">
              <label htmlFor="realName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">真实姓名</label>
              <UsersIcon className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="realName"
                name="realName"
                value={formData.realName}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
                placeholder="请输入您的真实姓名"
              />
            </div>
            <div className="relative">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">联系电话</label>
              <PhoneIcon className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-white"
                placeholder="请输入您的联系电话"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
            <button type="button" onClick={onClose}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              取消
            </button>
            <button type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              提交报名
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
