const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface MyClubApplication {
  clubId: string;
  clubName: string;
  reviewState: string;
}

export interface ClubMember {
  userId: string;
  userName: string;
  realName: string;
  school: string;
  degree: string;
  phoneNumber: string;
  clubId: string;
  clubName: string;
  clubManager: string;
  reviewState: string;
}

export async function getClubMembers(clubId: string): Promise<ClubMember[]> {
  const res = await fetch(`${BASE_URL}/api/member/list?clubId=${encodeURIComponent(clubId)}`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  if (!Array.isArray(json.data)) return [];
  return json.data as ClubMember[];
}

export async function getMyClubApplications(): Promise<MyClubApplication[]> {
  const res = await fetch(`${BASE_URL}/api/member/my`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  if (!Array.isArray(json.data)) return [];
  return json.data as MyClubApplication[];
}

export interface PendingMemberApplication {
  userId: string;
  userName: string;
  realName: string;
  studentId: string;
  school: string;
  degree: string;
  clubId: string;
  clubName: string;
  reviewState: string;
}

export async function getPendingMemberApplications(): Promise<PendingMemberApplication[]> {
  const res = await fetch(`${BASE_URL}/api/member/pending`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  if (!Array.isArray(json.data)) return [];
  return json.data as PendingMemberApplication[];
}

export async function auditMemberApplication(clubId: string, userId: string, pass: boolean): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/member/audit`, {
    method: 'PUT',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubId, userId, pass }),
  });
  if (!res.ok) throw new Error('审核失败，请重试');
  const text = await res.text();
  if (!text) return '审核操作成功';
  const json = JSON.parse(text);
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  return json.data ?? '审核操作成功';
}

export async function joinClub(clubId: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/member/join`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubId }),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  return json.data as string;
}

export async function leaveClub(clubId: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/member/leave`, {
    method: 'DELETE',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubId }),
  });
  if (!res.ok) throw new Error('退出社团失败，请重试');
  const text = await res.text();
  if (!text) return '已退出社团';
  const json = JSON.parse(text);
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  return json.data ?? '已退出社团';
}
