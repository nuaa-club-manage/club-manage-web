import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRegistrationList, auditRegistration } from '../services/activityApi';
import { dissolveClub, getManagedClubs, updateClub } from '../services/clubApi';
import type { ApiClub } from '../services/clubApi';
import type { RegistrationRecord } from '../types';
import { PlusCircleIcon } from '../components/icons';
import { getPendingMemberApplications, auditMemberApplication } from '../services/memberApi';
import type { PendingMemberApplication } from '../services/memberApi';
import { getClubActivities, updateActivity, endActivity, deleteActivity } from '../services/activityApi';
import type { ApiActivity } from '../services/activityApi';
import MemberInfoModal from '../components/MemberInfoModal';
import type { PersonInfo } from '../components/MemberInfoModal';

const ClubAdminPage: React.FC = () => {
  const [records, setRecords] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditing, setAuditing] = useState<string | null>(null);
  const [clubs, setClubs] = useState<ApiClub[]>([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [dissolvingId, setDissolvingId] = useState<string | null>(null);
  const [memberApplications, setMemberApplications] = useState<PendingMemberApplication[]>([]);
  const [memberAppLoading, setMemberAppLoading] = useState(true);
  const [auditingMember, setAuditingMember] = useState<string | null>(null);
  const [allActivities, setAllActivities] = useState<ApiActivity[]>([]);
  const [allActivitiesLoading, setAllActivitiesLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState<ApiActivity | null>(null);
  const [activityForm, setActivityForm] = useState({ title: '', content: '', location: '', capacityLimit: '' });
  const [updatingActivity, setUpdatingActivity] = useState(false);
  const [endingActivity, setEndingActivity] = useState<ApiActivity | null>(null);
  const [endForm, setEndForm] = useState({ summary: '', participantList: '' });
  const [submittingEnd, setSubmittingEnd] = useState(false);

  const [editingClub, setEditingClub] = useState<ApiClub | null>(null);
  const [editForm, setEditForm] = useState({ clubName: '', clubInformation: '', school: '' });
  const [updating, setUpdating] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonInfo | null>(null);

  useEffect(() => {
    getManagedClubs()
      .then(setClubs)
      .catch(() => setClubs([]))
      .finally(() => setClubsLoading(false));

    getPendingMemberApplications()
      .then(setMemberApplications)
      .catch(() => setMemberApplications([]))
      .finally(() => setMemberAppLoading(false));

    setLoading(true);
    getRegistrationList()
      .then(setRecords)
      .catch((err: any) => setError(err.message ?? '加载失败'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (clubs.length === 0) {
      setAllActivities([]);
      setAllActivitiesLoading(false);
      return;
    }
    setAllActivitiesLoading(true);
    Promise.all(clubs.map(c => getClubActivities(c.clubId)))
      .then(results => {
        const merged = new Map<string, ApiActivity>();
        results.forEach(arr => arr.forEach(a => merged.set(a.activityId, a)));
        setAllActivities(Array.from(merged.values()));
      })
      .catch(() => setAllActivities([]))
      .finally(() => setAllActivitiesLoading(false));
  }, [clubs]);

  const handleAuditMember = async (app: PendingMemberApplication, pass: boolean) => {
    setAuditingMember(app.userId);
    try {
      const msg = await auditMemberApplication(app.clubId, app.userId, pass);
      alert(msg);
      setMemberApplications(prev => prev.filter(a => a.userId !== app.userId));
    } catch (err: any) {
      alert(err.message ?? '审核失败，请重试');
    } finally {
      setAuditingMember(null);
    }
  };

  const handleAudit = async (registrationId: string, pass: boolean) => {
    setAuditing(registrationId);
    try {
      const msg = await auditRegistration(registrationId, pass);
      alert(msg);
      setRecords(prev => prev.filter(r => r.registrationId !== registrationId));
    } catch (err: any) {
      alert(err.message ?? '审核失败，请重试');
    } finally {
      setAuditing(null);
    }
  };

  const handleDissolve = async (club: ApiClub) => {
    if (!window.confirm(`确认解散「${club.clubName}」？此操作不可撤销。`)) return;
    setDissolvingId(club.clubId);
    try {
      await dissolveClub(club.clubId);
      alert(`「${club.clubName}」已成功解散`);
      setClubs(prev => prev.filter(c => c.clubId !== club.clubId));
    } catch (err: any) {
      alert(err.message ?? '解散社团失败，请重试');
    } finally {
      setDissolvingId(null);
    }
  };

  const openEdit = (club: ApiClub) => {    setEditingClub(club);
    setEditForm({ clubName: club.clubName, clubInformation: club.clubInformation || '', school: club.school || '' });
  };

  const openEditActivity = (a: ApiActivity) => {
    setEditingActivity(a);
    setActivityForm({ title: a.title, content: a.content || '', location: a.location || '', capacityLimit: String(a.capacityLimit ?? '') });
  };

  const handleUpdateActivity = async () => {    if (!editingActivity) return;
    setUpdatingActivity(true);
    try {
      const msg = await updateActivity(
        editingActivity.activityId,
        activityForm.title,
        activityForm.content,
        activityForm.location,
        parseInt(activityForm.capacityLimit),
      );
      alert(msg || '活动信息修改成功');
      setAllActivities(prev => prev.map(a =>
        a.activityId === editingActivity.activityId
          ? { ...a, title: activityForm.title, content: activityForm.content, location: activityForm.location, capacityLimit: parseInt(activityForm.capacityLimit) }
          : a
      ));
      setEditingActivity(null);
    } catch (err: any) {
      alert(err.message ?? '修改失败，请重试');
    } finally {
      setUpdatingActivity(false);
    }
  };

  const handleEndActivity = async () => {    if (!endingActivity) return;
    setSubmittingEnd(true);
    try {
      const msg = await endActivity(endingActivity.activityId, endForm.summary, endForm.participantList);
      alert(msg || '活动已结束');
      setAllActivities(prev => prev.map(a =>
        a.activityId === endingActivity.activityId ? { ...a, activityState: '已结束' } : a
      ));
      setEndingActivity(null);
    } catch (err: any) {
      alert(err.message ?? '操作失败，请重试');
    } finally {
      setSubmittingEnd(false);
    }
  };

  const handleDeleteActivity = async (a: ApiActivity) => {
    if (!window.confirm(`确认删除活动「${a.title}」？此操作不可撤销。`)) return;
    try {
      const msg = await deleteActivity(a.activityId);
      alert(msg || '活动已删除');
      setAllActivities(prev => prev.filter(item => item.activityId !== a.activityId));
    } catch (err: any) {
      alert(err.message ?? '删除失败，请重试');
    }
  };

  const handleUpdate = async () => {
    if (!editingClub) return;
    setUpdating(true);
    try {
      await updateClub(editingClub.clubId, editForm.clubName, editForm.clubInformation, editForm.school);
      alert('社团信息修改成功');
      setClubs(prev => prev.map(c =>
        c.clubId === editingClub.clubId
          ? { ...c, clubName: editForm.clubName, clubInformation: editForm.clubInformation, school: editForm.school }
          : c
      ));
      setEditingClub(null);
    } catch (err: any) {
      alert(err.message ?? '修改失败，请重试');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">社团管理</h1>

      {/* 我管理的社团 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">我管理的社团</h2>
          <Link
            to="/clubs/create"
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            <PlusCircleIcon className="w-4 h-4 mr-2" />
            成立社团
          </Link>
        </div>
        {clubsLoading ? (
          <p className="px-6 py-10 text-center text-gray-400">加载中...</p>
        ) : clubs.length === 0 ? (
          <p className="px-6 py-10 text-center text-gray-400">暂无管理的社团</p>
        ) : (
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">社团名称</th>
                <th className="px-6 py-3">所属学院</th>
                <th className="px-6 py-3">社团简介</th>
                <th className="px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {clubs.map(club => (
                <tr key={club.clubId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{club.clubName}</td>
                  <td className="px-6 py-4">{club.school || '-'}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{club.clubInformation || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/club-admin/${club.clubId}/members`}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
                      >
                        查看成员
                      </Link>
                      <button
                        onClick={() => openEdit(club)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
                      >
                        修改信息
                      </button>
                      <button
                        onClick={() => handleDissolve(club)}
                        disabled={dissolvingId === club.clubId}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
                      >
                        {dissolvingId === club.clubId ? '解散中...' : '解散社团'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 社团活动管理 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">社团活动管理</h2>
          <Link
            to="/activities/publish"
            className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            <PlusCircleIcon className="w-4 h-4 mr-2" />
            发布活动
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">活动标题</th>
                <th className="px-6 py-3">所属社团</th>
                <th className="px-6 py-3">地点</th>
                <th className="px-6 py-3">人数限制</th>
                <th className="px-6 py-3">状态</th>
                <th className="px-6 py-3">发布时间</th>
                <th className="px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {allActivitiesLoading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">加载中...</td></tr>
              ) : allActivities.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-gray-400">暂无活动</td></tr>
              ) : allActivities.map(a => (
                <tr key={a.activityId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{a.title}</td>
                  <td className="px-6 py-4">{a.clubName}</td>
                  <td className="px-6 py-4">{a.location || '-'}</td>
                  <td className="px-6 py-4">{a.capacityLimit ?? '-'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {a.activityState}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {a.publishTime ? new Date(a.publishTime).toLocaleDateString('zh-CN') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditActivity(a)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
                      >
                        修改信息
                      </button>
                      {a.activityState !== '已结束' && (
                        <button
                          onClick={() => { setEndingActivity(a); setEndForm({ summary: '', participantList: '' }); }}
                          className="bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
                        >
                          结束活动
                        </button>
                      )}
                      {a.activityState !== '已结束' && (
                        <button
                          onClick={() => handleDeleteActivity(a)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
                        >
                          删除活动
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 入社待审核申请 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">入社待审核申请</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">姓名</th>
                <th className="px-6 py-3">用户名</th>
                <th className="px-6 py-3">学号</th>
                <th className="px-6 py-3">学院</th>
                <th className="px-6 py-3">社团</th>
                <th className="px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {memberAppLoading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">加载中...</td></tr>
              ) : memberApplications.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">暂无待审核的入社申请</td></tr>
              ) : memberApplications.map(app => (
                <tr key={app.userId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer" onClick={() => setSelectedPerson({
                  userId: app.userId,
                  userName: app.userName,
                  realName: app.realName,
                  school: app.school,
                  degree: app.degree,
                  clubName: app.clubName,
                })}>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{app.realName || '-'}</td>
                  <td className="px-6 py-4">{app.userName}</td>
                  <td className="px-6 py-4">{app.studentId || '-'}</td>
                  <td className="px-6 py-4">{app.school || '-'}</td>
                  <td className="px-6 py-4">{app.clubName}</td>
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAuditMember(app, true)}
                        disabled={auditingMember === app.userId}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
                      >
                        通过
                      </button>
                      <button
                        onClick={() => handleAuditMember(app, false)}
                        disabled={auditingMember === app.userId}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
                      >
                        拒绝
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 待审核报名列表 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">待审核报名列表</h2>
        </div>
        {error && (
          <div className="px-6 py-4 text-red-600 dark:text-red-400 text-sm">{error}</div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">活动名称</th>
                <th className="px-6 py-3">用户学号</th>
                <th className="px-6 py-3">真实姓名</th>
                <th className="px-6 py-3">联系电话</th>
                <th className="px-6 py-3">审核状态</th>
                <th className="px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">加载中...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">暂无待审核的报名记录</td></tr>
              ) : records.map(record => (
                <tr key={record.registrationId} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer" onClick={() => setSelectedPerson({
                  userId: record.userId,
                  realName: record.realName,
                  phoneNumber: record.phoneNumber,
                  clubName: record.title,
                })}>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{record.title}</td>
                  <td className="px-6 py-4">{record.userId}</td>
                  <td className="px-6 py-4">{record.realName}</td>
                  <td className="px-6 py-4">{record.phoneNumber}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      {record.reviewState}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAudit(record.registrationId, true)}
                        disabled={auditing === record.registrationId}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
                      >
                        通过
                      </button>
                      <button
                        onClick={() => handleAudit(record.registrationId, false)}
                        disabled={auditing === record.registrationId}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors"
                      >
                        退回
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 编辑社团弹窗 */}
      {editingClub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              修改社团信息 — {editingClub.clubName}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">社团名称</label>
                <input
                  type="text"
                  value={editForm.clubName}
                  onChange={e => setEditForm(f => ({ ...f, clubName: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">所属学院</label>
                <input
                  type="text"
                  value={editForm.school}
                  onChange={e => setEditForm(f => ({ ...f, school: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">社团简介</label>
                <textarea
                  rows={3}
                  value={editForm.clubInformation}
                  onChange={e => setEditForm(f => ({ ...f, clubInformation: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingClub(null)}
                disabled={updating}
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {updating ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
      {endingActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              结束活动 — {endingActivity.title}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">活动总结 *</label>
                <textarea
                  rows={3}
                  value={endForm.summary}
                  onChange={e => setEndForm(f => ({ ...f, summary: e.target.value }))}
                  placeholder="填写本次活动的总结内容"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">到场名单 *</label>
                <textarea
                  rows={3}
                  value={endForm.participantList}
                  onChange={e => setEndForm(f => ({ ...f, participantList: e.target.value }))}
                  placeholder="填写到场人员名单，如：张三、李四、王五"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEndingActivity(null)}
                disabled={submittingEnd}
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleEndActivity}
                disabled={submittingEnd || !endForm.summary || !endForm.participantList}
                className="px-4 py-2 text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {submittingEnd ? '提交中...' : '确认结束'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              修改活动信息
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">活动标题</label>
                <input
                  type="text"
                  value={activityForm.title}
                  onChange={e => setActivityForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">活动地点</label>
                <input
                  type="text"
                  value={activityForm.location}
                  onChange={e => setActivityForm(f => ({ ...f, location: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">人数上限</label>
                <input
                  type="number"
                  min={1}
                  value={activityForm.capacityLimit}
                  onChange={e => setActivityForm(f => ({ ...f, capacityLimit: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">活动详情</label>
                <textarea
                  rows={3}
                  value={activityForm.content}
                  onChange={e => setActivityForm(f => ({ ...f, content: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingActivity(null)}
                disabled={updatingActivity}
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleUpdateActivity}
                disabled={updatingActivity}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {updatingActivity ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPerson && (
        <MemberInfoModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
      )}
    </div>
  );
};

export default ClubAdminPage;
