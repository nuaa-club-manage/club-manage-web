import React, { useState, useEffect, useCallback } from 'react';
import { getClubs } from '../../services/clubApi';
import type { ApiClub } from '../../services/clubApi';
import { getClubAverageScores } from '../../services/ratingApi';
import type { ClubAverageScore } from '../../services/ratingApi';
import StarRating from '../../components/StarRating';
import { SearchIcon, UsersIcon, ArrowLeftIcon } from '../../components/icons';
import type { ClubMember } from '../../services/memberApi';
import { setClubManager } from '../../services/adminApi';
import MemberInfoModal from '../../components/MemberInfoModal';
import type { PersonInfo } from '../../components/MemberInfoModal';

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

const AdminClubListPage: React.FC = () => {
  const [clubs, setClubs] = useState<ApiClub[]>([]);
  const [allMembers, setAllMembers] = useState<ClubMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [averageScores, setAverageScores] = useState<ClubAverageScore[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<PersonInfo | null>(null);

  const fetchData = useCallback((query: string) => {
    setLoading(true);
    setSelectedClubId(null);
    Promise.all([
      getClubs(query || undefined),
      getAllClubMembers(),
    ])
      .then(([clubData, memberData]) => {
        setClubs(clubData);
        setAllMembers(memberData);
      })
      .catch(() => { setClubs([]); setAllMembers([]); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData(searchQuery);
  }, [searchQuery, fetchData]);

  useEffect(() => {
    getClubAverageScores().then(setAverageScores).catch(() => {});
  }, []);

  const getScore = (clubId: string) =>
    averageScores.find(s => s.clubId === clubId);

  const handleSearch = () => setSearchQuery(searchInput);

  const selectedClub = clubs.find(c => c.clubId === selectedClubId);
  const clubMembers = selectedClubId
    ? allMembers.filter(m => m.clubId === selectedClubId)
    : [];

  const handleSetManager = async (m: ClubMember) => {
    const toManager = !isManager(m);
    const action = toManager ? '设为管理员' : '取消管理员';
    if (!window.confirm(`确认将「${m.realName || m.userName}」${action}？`)) return;
    setSettingId(`${m.clubId}-${m.userId}`);
    try {
      const msg = await setClubManager(m.clubId, m.userId, toManager);
      alert(msg);
      setAllMembers(prev => prev.map(item =>
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
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">社团列表</h1>

      <div className="mb-6 flex gap-3">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="搜索社团名称..."
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

      {selectedClubId ? (
        /* 成员列表视图 — 完全替换社团列表 */
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              「{selectedClub?.clubName ?? '未知社团'}」成员列表 ({clubMembers.length})
            </h2>
            <button
              onClick={() => setSelectedClubId(null)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeftIcon className="w-4 h-4" /> 返回
            </button>
          </div>
          {clubMembers.length === 0 ? (
            <p className="px-6 py-10 text-center text-gray-400">该社团暂无成员</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">学号</th>
                    <th className="px-6 py-3">用户名</th>
                    <th className="px-6 py-3">真实姓名</th>
                    <th className="px-6 py-3">学院</th>
                    <th className="px-6 py-3">学历</th>
                    <th className="px-6 py-3">联系电话</th>
                    <th className="px-6 py-3">身份</th>
                    <th className="px-6 py-3">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {clubMembers.map(m => {
                    const person: PersonInfo = {
                      userId: m.userId,
                      userName: m.userName,
                      realName: m.realName,
                      school: m.school,
                      degree: m.degree,
                      phoneNumber: m.phoneNumber,
                      role: isManager(m) ? '管理员' : '普通成员',
                    };
                    return (
                    <tr key={`${m.clubId}-${m.userId}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer" onClick={() => setSelectedPerson(person)}>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{m.userId}</td>
                      <td className="px-6 py-4">{m.userName}</td>
                      <td className="px-6 py-4">{m.realName || '-'}</td>
                      <td className="px-6 py-4">{m.school || '-'}</td>
                      <td className="px-6 py-4">{m.degree || '-'}</td>
                      <td className="px-6 py-4">{m.phoneNumber || '-'}</td>
                      <td className="px-6 py-4">
                        {isManager(m) ? (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">管理员</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">普通成员</span>
                        )}
                      </td>
                      <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : loading ? (
        <div className="text-center py-20 text-gray-500">加载中...</div>
      ) : clubs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">暂无社团</div>
      ) : (
        /* 社团列表视图 */
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">社团名称</th>
                <th className="px-6 py-3 text-left">学院</th>
                <th className="px-6 py-3 text-left">状态</th>
                <th className="px-6 py-3 text-left">成立时间</th>
                <th className="px-6 py-3 text-left">评分</th>
                <th className="px-6 py-3 text-left">评价人数</th>
                <th className="px-6 py-3 text-left">成员</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {clubs.map(club => {
                const score = getScore(club.clubId);
                const memberCount = allMembers.filter(m => m.clubId === club.clubId).length;
                return (
                  <tr
                    key={club.clubId}
                    onClick={() => setSelectedClubId(club.clubId)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {club.clubName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {club.school || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        {club.clubState}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {club.establishmentTime
                        ? new Date(club.establishmentTime).toLocaleDateString('zh-CN')
                        : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {score ? (
                        <div className="flex items-center gap-2">
                          <StarRating rating={score.averageScore} readOnly size="w-4 h-4" />
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {score.averageScore.toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">暂无</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {score ? score.ratingCount : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <UsersIcon className="w-5 h-5 text-gray-400 inline-block mr-1" />
                      <span className="text-gray-700 dark:text-gray-300">{memberCount}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedPerson && (
        <MemberInfoModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
      )}
    </div>
  );
};

export default AdminClubListPage;
