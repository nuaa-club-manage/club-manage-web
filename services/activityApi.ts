import type { RegistrationRecord, MyRegistrationRecord, Activity } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface ApiActivity {
  activityId: string;
  clubId: string;
  clubName: string;
  userId: string;
  title: string;
  content: string;
  location: string;
  capacityLimit: number;
  activityState: string;
  publishTime: string;
}

export function apiActivityToActivity(a: ApiActivity): Activity {
  const date = a.publishTime ? a.publishTime.slice(0, 10) : '2024-01-01';
  return {
    id: 0,
    activityId: a.activityId,
    title: a.title,
    club: a.clubName,
    clubId: 0,
    date,
    time: a.publishTime ? a.publishTime.slice(11, 16) : '00:00',
    location: a.location || '',
    description: a.content || '',
    imageUrl: `https://picsum.photos/seed/${a.activityId}/600/400`,
    status: 'approved',
  };
}

export async function getPublishedActivities(title?: string): Promise<ApiActivity[]> {
  const params = title ? `?title=${encodeURIComponent(title)}` : '';
  const res = await fetch(`${BASE_URL}/api/activities${params}`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  if (!Array.isArray(json.data)) return [];
  return json.data as ApiActivity[];
}

export async function getActivityDetail(activityId: string): Promise<ApiActivity> {
  const res = await fetch(`${BASE_URL}/api/activities/detail?activityId=${encodeURIComponent(activityId)}`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message ?? '活动不存在');
  if (!json.data) throw new Error('活动不存在');
  return json.data as ApiActivity;
}

export async function getMyActivities(): Promise<ApiActivity[]> {
  const res = await fetch(`${BASE_URL}/api/activities/my`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  if (!Array.isArray(json.data)) return [];
  return json.data as ApiActivity[];
}

export async function getClubActivities(clubId: string): Promise<ApiActivity[]> {
  const res = await fetch(`${BASE_URL}/api/activities/club?clubId=${encodeURIComponent(clubId)}`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  if (!Array.isArray(json.data)) return [];
  return json.data as ApiActivity[];
}

export async function publishActivity(
  clubId: string,
  title: string,
  content: string,
  location: string,
  capacityLimit: number
): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/activities`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubId, title, content, location, capacityLimit }),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  return json.data as string;
}

export async function updateActivity(
  activityId: string,
  title: string,
  content: string,
  location: string,
  capacityLimit: number
): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/activities`, {
    method: 'PUT',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ activityId, title, content, location, capacityLimit }),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  return json.data as string;
}

export async function endActivity(activityId: string, summary: string, participantList: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/activities/end`, {
    method: 'PUT',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ activityId, summary, participantList }),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  return json.data as string;
}

export async function deleteActivity(activityId: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/activities?activityId=${encodeURIComponent(activityId)}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  return json.data as string;
}

export async function registerActivity(
  activityId: string,
  realName: string,
  phoneNumber: string
): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/registration/register`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ activityId, realName, phoneNumber }),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as string;
}

export async function getRegistrationList(): Promise<RegistrationRecord[]> {
  const res = await fetch(`${BASE_URL}/api/registration/admin/list`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as RegistrationRecord[];
}

export async function auditRegistration(registrationId: string, pass: boolean): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/registration/admin/audit`, {
    method: 'PUT',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ registrationId, pass }),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as string;
}

export async function getMyRegistrations(): Promise<MyRegistrationRecord[]> {
  const res = await fetch(`${BASE_URL}/api/registration/my`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as MyRegistrationRecord[];
}

export interface ActivityParticipant {
  userId: string;
  realName: string;
  phoneNumber: string;
}

export async function getActivityParticipants(activityID: string): Promise<ActivityParticipant[]> {
  const res = await fetch(`${BASE_URL}/api/registration/admin/participants?activityID=${encodeURIComponent(activityID)}`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as ActivityParticipant[];
}

export async function cancelRegistration(registrationID: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/registration/cancel`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ registrationID }),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as string;
}
