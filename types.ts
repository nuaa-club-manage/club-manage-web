export interface ClubMember {
  id: number;
  name: string;
  avatarUrl: string;
}

export interface Club {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  imageUrl: string;
  rating: {
    score: number;
    count: number;
  };
  members: ClubMember[];
  joinRequests: ClubMember[];
  status: 'pending' | 'approved';
}

export interface Activity {
  id: number;
  title: string;
  club: string;
  clubId: number;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  status: 'pending' | 'approved';
}

export interface UserRating {
  clubId: number;
  score: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  joinedClubs: number[];
  registeredActivities: number[];
  managedClubs: number[];
  ratings: UserRating[];
  role: 'user' | 'admin';
}