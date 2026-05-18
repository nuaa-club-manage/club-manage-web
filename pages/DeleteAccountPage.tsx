import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../services/userApi';

const DeleteAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const msg = await deleteAccount();
      alert(msg);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err: any) {
      alert(err.message ?? '注销失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">确认注销账号</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">此操作将永久删除您的账号，包括：</p>
        <ul className="text-sm text-gray-500 dark:text-gray-400 mb-8 space-y-1">
          <li>· 个人资料与账号信息</li>
          <li>· 加入的所有社团记录</li>
          <li>· 报名的所有活动记录</li>
        </ul>
        <p className="text-red-500 font-semibold mb-8">此操作不可撤销，请谨慎确认。</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? '注销中...' : '确认注销'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
