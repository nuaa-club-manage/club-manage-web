import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../../services/adminApi';
import type { AdminUserRecord } from '../../types';

const PAGE_SIZE = 10;

const AdminUserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async (page: number, keyword: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchUsers(page, PAGE_SIZE, keyword);
      setUsers(result.records);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message ?? '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers(pageNo, search);
  }, [pageNo, search, loadUsers]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPageNo(1);
    setSearch(searchInput);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">用户管理</h1>

      {/* 搜索栏 */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="搜索用户名 / 学号 / 手机号..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          搜索
        </button>
      </form>

      {/* 表格 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {error && (
          <div className="px-6 py-4 text-red-600 dark:text-red-400 text-sm">{error}</div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">学号</th>
                <th className="px-6 py-3">用户名</th>
                <th className="px-6 py-3">真实姓名</th>
                <th className="px-6 py-3">手机号</th>
                <th className="px-6 py-3">学校</th>
                <th className="px-6 py-3">注册时间</th>
                <th className="px-6 py-3"><span className="sr-only">操作</span></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">加载中...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">暂无用户数据</td>
                </tr>
              ) : users.map(user => (
                <tr key={user.userId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.userId}</td>
                  <td className="px-6 py-4">{user.userName}</td>
                  <td className="px-6 py-4">{user.realName ?? '—'}</td>
                  <td className="px-6 py-4">{user.phoneNumber}</td>
                  <td className="px-6 py-4">{user.school ?? '—'}</td>
                  <td className="px-6 py-4">{user.registerTime}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate('/admin/users/edit', { state: user })}
                      className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      修改
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              共 {total} 条，第 {pageNo} / {totalPages} 页
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPageNo(p => Math.max(1, p - 1))}
                disabled={pageNo === 1}
                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                上一页
              </button>
              <button
                onClick={() => setPageNo(p => Math.min(totalPages, p + 1))}
                disabled={pageNo === totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagementPage;
