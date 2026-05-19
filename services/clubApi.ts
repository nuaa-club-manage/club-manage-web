const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface ApiClub {
  clubId: string;
  userId: string;
  clubName: string;
  clubInformation: string;
  school: string;
  clubState: string;
  establishmentTime: string;
}

export async function getClubs(clubName?: string): Promise<ApiClub[]> {
  const params = clubName ? `?clubName=${encodeURIComponent(clubName)}` : '';
  const res = await fetch(`${BASE_URL}/api/club/list${params}`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  if (!Array.isArray(json.data)) return [];
  return json.data as ApiClub[];
}

/** 批量获取每个社团的成员数，返回 Map<clubId, count> */
export async function getMemberCountMap(clubIds: string[]): Promise<Record<string, number>> {
  const results: Record<string, number> = {};
  const counts = await Promise.all(
    clubIds.map(async (clubId) => {
      try {
        const res = await fetch(`${BASE_URL}/api/member/count?clubId=${encodeURIComponent(clubId)}`);
        const json = await res.json();
        if (json.code === 200 && typeof json.data === 'number') return { clubId, count: json.data };
      } catch (_) {}
      return { clubId, count: 0 };
    })
  );
  counts.forEach(({ clubId, count }) => { results[clubId] = count; });
  return results;
}

export async function getClubDetail(clubId: string): Promise<ApiClub> {
  const res = await fetch(`${BASE_URL}/api/club/detail?clubId=${encodeURIComponent(clubId)}`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message ?? '获取社团详情失败');
  if (!json.data) throw new Error('社团不存在');
  return json.data as ApiClub;
}

export async function getManagedClubs(): Promise<ApiClub[]> {
  const res = await fetch(`${BASE_URL}/api/club/managed`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  if (!Array.isArray(json.data)) return [];
  return json.data as ApiClub[];
}

export async function updateClub(clubId: string, clubName: string, clubInformation: string, school: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/club/update`, {
    method: 'PUT',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubId, clubName, clubInformation, school }),
  });
  if (!res.ok) throw new Error('修改社团信息失败，请重试');
  const text = await res.text();
  if (text) {
    const json = JSON.parse(text);
    if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  }
}

export async function createClub(clubName: string, clubInformation: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/club/create`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubName, clubInformation }),
  });
  if (!res.ok) throw new Error('创建社团失败，请重试');
  const text = await res.text();
  if (text) {
    const json = JSON.parse(text);
    if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  }
}

export async function dissolveClub(clubId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/club/dissolve`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubId }),
  });
  if (!res.ok) throw new Error('解散社团失败，请重试');
  const text = await res.text();
  if (text) {
    const json = JSON.parse(text);
    if (json.code !== undefined && json.code !== 200) throw new Error(json.message);
  }
}
