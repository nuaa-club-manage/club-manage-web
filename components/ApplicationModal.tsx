import React, { useState } from 'react';
import { mockUser } from '../data/mockData';
import { XIcon, UsersIcon, IdentificationIcon, PhoneIcon, PencilAltIcon } from './icons';

interface ApplicationData {
  studentId: string;
  phone: string;
  reason: string;
}

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: ApplicationData) => void;
  title: string;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose, onSubmit, title }) => {
  const [formData, setFormData] = useState<ApplicationData>({
    studentId: '',
    phone: '',
    reason: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Optionally reset form after submission
    setFormData({ studentId: '', phone: '', reason: '' });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg transform transition-transform duration-300 scale-95 animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-label="关闭">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            {/* Name (Read-only) */}
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">姓名</label>
              <UsersIcon className="absolute left-3 top-10 w-5 h-5 text-gray-400"/>
              <input
                type="text"
                id="name"
                name="name"
                value={mockUser.name}
                readOnly
                className="mt-1 block w-full pl-10 pr-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm sm:text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
             {/* Student ID */}
            <div className="relative">
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">学号</label>
              <IdentificationIcon className="absolute left-3 top-10 w-5 h-5 text-gray-400"/>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="请输入您的学号"
              />
            </div>
             {/* Phone */}
            <div className="relative">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">联系电话</label>
              <PhoneIcon className="absolute left-3 top-10 w-5 h-5 text-gray-400"/>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="请输入您的联系电话"
              />
            </div>
             {/* Reason */}
            <div className="relative">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">申请/报名理由</label>
               <PencilAltIcon className="absolute left-3 top-10 w-5 h-5 text-gray-400"/>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full pl-10 pr-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="请简单说明您申请加入或报名的原因..."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              提交
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
            animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ApplicationModal;