import type { AdminUserRecord, AdminUpdateUserRequest, PageResult } from '../types';
import type { ApiClub } from './clubApi';
import type { ApiActivity } from './activityApi';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function searchUsers(
  pageNo: number,
  pageSize: number,
  search: string
): Promise<PageResult<AdminUserRecord>> {
  const res = await fetch(`${BASE_URL}/api/admin/users/search`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageNo, pageSize, search }),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as PageResult<AdminUserRecord>;
}

export async function updateUserProfile(data: AdminUpdateUserRequest): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/admin/user/profile`, {
    method: 'PUT',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as string;
}

export async function setClubManager(clubId: string, userId: string, setManager: boolean): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/admin/club/manager`, {
    method: 'PUT',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubId, userId, setManager }),
  });
  if (!res.ok) throw new Error('操作失败，请重试');
  const text = await res.text();
  if (!text) return setManager ? '管理员权限设置成功' : '管理员权限已取消';
  const json = JSON.parse(text);
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  return json.data ?? (setManager ? '管理员权限设置成功' : '管理员权限已取消');
}

export async function getPendingClubs(): Promise<ApiClub[]> {
  const res = await fetch(`${BASE_URL}/api/admin/clubs/pending`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  if (!Array.isArray(json.data)) return [];
  return json.data as ApiClub[];
}

export async function auditClub(clubId: string, pass: boolean): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/admin/club/audit`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubId, pass }),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  return json.data as string;
}

export async function getPendingActivities(): Promise<ApiActivity[]> {
  const res = await fetch(`${BASE_URL}/api/admin/activities/pending`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  if (!Array.isArray(json.data)) return [];
  return json.data as ApiActivity[];
}

export async function auditActivity(activityId: string, pass: boolean): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/admin/activity/audit`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ activityId, pass }),
  });
  if (!res.ok) throw new Error('审核失败，请重试');
  const text = await res.text();
  if (!text) return pass ? '活动审核通过' : '活动已拒绝';
  const json = JSON.parse(text);
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  return json.data ?? (pass ? '活动审核通过' : '活动已拒绝');
}
