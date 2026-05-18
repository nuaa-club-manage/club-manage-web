import type { UserInfo, UpdateUserInfoRequest } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchUserInfo(): Promise<UserInfo> {
  const res = await fetch(`${BASE_URL}/api/user/info`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as UserInfo;
}

export async function updateUserInfo(data: UpdateUserInfoRequest): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/user/info`, {
    method: 'PUT',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as string;
}

export async function updatePassword(oldPassword: string, newPassword: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/user/password`, {
    method: 'PUT',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as string;
}

export async function deleteAccount(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/user/account`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as string;
}
