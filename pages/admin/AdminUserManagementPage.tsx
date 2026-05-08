import React from 'react';
import { mockUsers } from '../../data/mockData';
import { ShieldCheckIcon } from '../../components/icons';

const AdminUserManagementPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">用户管理</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  用户
                </th>
                <th scope="col" className="px-6 py-3">
                  角色
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">操作</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(user => (
                <tr key={user.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <img className="w-10 h-10 rounded-full" src={user.avatarUrl} alt={user.name} />
                      <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                    }`}>
                      {user.role === 'admin' && <ShieldCheckIcon className="w-4 h-4 mr-1.5" />}
                      {user.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline">编辑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagementPage;