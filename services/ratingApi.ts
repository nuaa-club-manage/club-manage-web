const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface ClubAverageScore {
  clubId: string;
  clubName: string;
  averageScore: number;
  ratingCount: number;
}

export async function getClubAverageScores(): Promise<ClubAverageScore[]> {
  const res = await fetch(`${BASE_URL}/api/rating/public/average-scores`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as ClubAverageScore[];
}

export interface MyRatingRecord {
  ratingId: string;
  clubId: string;
  clubName: string;
  rating: string;
  ratingTime: string;
}

export async function submitRating(clubId: string, rating: number): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/rating/submit`, {
    method: 'POST',
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubId, rating: String(rating) }),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as string;
}

export async function cancelRating(clubID: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/rating/cancel?clubID=${encodeURIComponent(clubID)}`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as string;
}

export async function getMyRatings(): Promise<MyRatingRecord[]> {
  const res = await fetch(`${BASE_URL}/api/rating/my/list`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as MyRatingRecord[];
}

export async function getMyClubRating(clubID: string): Promise<MyRatingRecord | null> {
  const res = await fetch(`${BASE_URL}/api/rating/my/detail?clubID=${encodeURIComponent(clubID)}`, {
    headers: getAuthHeader(),
  });
  const json = await res.json();
  if (json.code !== 200) throw new Error(json.message);
  return json.data as MyRatingRecord | null;
}
