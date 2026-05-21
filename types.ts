export interface ClubMember {
  id: number;
  name: string;
  avatarUrl: string;
}

export interface Club {
  id: number;
  clubId?: string;
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
  activityId?: string;
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

export interface UpdateUserInfoRequest {
  userName: string;
  phoneNumber: string;
  userMailbox: string;
  realName: string;
  gender: string;
  degree: string;
  school: string;
}

export interface UserInfo {
  userId: string;
  userName: string;
  phoneNumber: string;
  userMailbox: string | null;
  realName: string | null;
  gender: string | null;
  degree: string | null;
  school: string | null;
  registerTime: string;
}

export interface RegistrationRecord {
  registrationId: string;
  activityId: string;
  title: string;
  userId: string;
  realName: string;
  phoneNumber: string;
  reviewState: string;
}

export interface MyRegistrationRecord {
  registrationId: string;
  activityId: string;
  clubId: string;
  title: string;
  content: string;
  publishTime: string;
  reviewState: string;
  activityState: string;
}

export interface AdminUpdateUserRequest {
  targetUserID: string;
  userName: string;
  phoneNumber: string;
  userMailbox: string;
  realName: string;
  gender: string;
  degree: string;
  school: string;
  userPassword: string;
}

export interface AdminUserRecord {
  userId: string;
  userName: string;
  realName: string | null;
  phoneNumber: string;
  userMailbox: string | null;
  gender: string | null;
  degree: string | null;
  school: string | null;
  registerTime: string;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
  pages: number;
}