import React, { useState, useEffect, useCallback } from 'react';
import { SearchIcon } from '../../components/icons';
import type { ClubMember } from '../../services/memberApi';
import { setClubManager } from '../../services/adminApi';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function getAllClubMembers(search?: string): Promise<ClubMember[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`${BASE_URL}/api/admin/clubs/members${params}`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  if (!Array.isArray(json.data)) return [];
  return json.data as ClubMember[];
}

function isManager(m: ClubMember): boolean {
  return m.clubManager === 'true' || m.clubManager === '1' || m.clubManager === '是';
}

const AdminClubMembersPage: React.FC = () => {
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [settingId, setSettingId] = useState<string | null>(null);

  const fetchMembers = useCallback((query: string) => {
    setLoading(true);
    getAllClubMembers(query || undefined)
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchMembers(searchQuery);
  }, [searchQuery, fetchMembers]);

  const handleSearch = () => setSearchQuery(searchInput);

  const handleSetManager = async (m: ClubMember) => {
    const toManager = !isManager(m);
    const action = toManager ? '设为管理员' : '取消管理员';
    if (!window.confirm(`确认将「${m.realName || m.userName}」${action}？`)) return;
    setSettingId(`${m.clubId}-${m.userId}`);
    try {
      const msg = await setClubManager(m.clubId, m.userId, toManager);
      alert(msg);
      setMembers(prev => prev.map(item =>
        item.clubId === m.clubId && item.userId === m.userId
          ? { ...item, clubManager: toManager ? '是' : '否' }
          : item
      ));
    } catch (err: any) {
      alert(err.message ?? '操作失败，请重试');
    } finally {
      setSettingId(null);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">所有社团成员</h1>

      <div className="mb-6 flex gap-3">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="搜索姓名 / 学号..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
        >
          搜索
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="px-6 py-10 text-center text-gray-400">加载中...</p>
        ) : members.length === 0 ? (
          <p className="px-6 py-10 text-center text-gray-400">暂无成员数据</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">学号</th>
                  <th className="px-6 py-3">用户名</th>
                  <th className="px-6 py-3">真实姓名</th>
                  <th className="px-6 py-3">学院</th>
                  <th className="px-6 py-3">学历</th>
                  <th className="px-6 py-3">联系电话</th>
                  <th className="px-6 py-3">所属社团</th>
                  <th className="px-6 py-3">身份</th>
                  <th className="px-6 py-3">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {members.map((m, idx) => (
                  <tr key={`${m.clubId}-${m.userId}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{m.userId}</td>
                    <td className="px-6 py-4">{m.userName}</td>
                    <td className="px-6 py-4">{m.realName || '-'}</td>
                    <td className="px-6 py-4">{m.school || '-'}</td>
                    <td className="px-6 py-4">{m.degree || '-'}</td>
                    <td className="px-6 py-4">{m.phoneNumber || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                        {m.clubName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isManager(m) ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">管理员</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">普通成员</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSetManager(m)}
                        disabled={settingId === `${m.clubId}-${m.userId}`}
                        className={`text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors disabled:opacity-50 ${
                          isManager(m)
                            ? 'bg-gray-500 hover:bg-gray-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {settingId === `${m.clubId}-${m.userId}`
                          ? '处理中...'
                          : isManager(m) ? '取消管理员' : '设为管理员'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClubMembersPage;
