import type { Club, Activity, User, ClubMember } from '../types';

export const mockClubMembers: ClubMember[] = [
  { id: 101, name: 'Alex Doe', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 102, name: 'Jane Smith', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
  { id: 103, name: 'Sam Wilson', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
  { id: 104, name: 'Emily Brown', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704a' },
  { id: 105, name: 'Chris Lee', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' },
  { id: 106, name: 'Maria Garcia', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704c' },
  { id: 107, name: 'Peter Jones', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704g' },
];

export const mockClubs: Club[] = [
  { id: 1, name: 'Photography Club', description: 'Capture moments, tell stories. Join us to explore the art of photography.', memberCount: 124, category: 'Arts', imageUrl: 'https://picsum.photos/seed/photoclub/600/400', rating: { score: 4.5, count: 88 }, members: mockClubMembers.slice(0,4), joinRequests: [mockClubMembers[6]], status: 'approved' },
  { id: 2, name: 'Coding Hub', description: 'From Python to React, we code it all. All skill levels are welcome.', memberCount: 256, category: 'Tech', imageUrl: 'https://picsum.photos/seed/codehub/600/400', rating: { score: 4.8, count: 152 }, members: mockClubMembers.slice(1,5), joinRequests: [], status: 'approved' },
  { id: 3, name: 'Mountain Trekkers', description: 'Explore scenic trails and conquer peaks with fellow nature lovers.', memberCount: 88, category: 'Sports', imageUrl: 'https://picsum.photos/seed/trekkers/600/400', rating: { score: 4.7, count: 70 }, members: mockClubMembers.slice(2,6), joinRequests: [], status: 'approved' },
  { id: 4, name: 'Bookworm Society', description: 'A cozy corner for readers to discuss everything from classic literature to modern sci-fi.', memberCount: 150, category: 'Arts', imageUrl: 'https://picsum.photos/seed/bookworms/600/400', rating: { score: 4.6, count: 110 }, members: mockClubMembers.slice(0,3), joinRequests: [], status: 'approved' },
  { id: 5, name: 'AI Innovators', description: 'Dive into the world of Artificial Intelligence and Machine Learning projects.', memberCount: 180, category: 'Tech', imageUrl: 'https://picsum.photos/seed/aiinnovators/600/400', rating: { score: 4.9, count: 130 }, members: mockClubMembers.slice(3,6), joinRequests: [], status: 'approved' },
  { id: 6, name: 'Stargazers Astronomy Club', description: 'Discover the cosmos with our telescopes and night sky observation sessions.', memberCount: 75, category: 'Science', imageUrl: 'https://picsum.photos/seed/stargazers/600/400', rating: { score: 4.8, count: 65 }, members: mockClubMembers.slice(1,4), joinRequests: [], status: 'approved' },
  { id: 7, name: 'Culinary Creators', description: 'Share recipes, a cooking techniques, and enjoy delicious food together.', memberCount: 110, category: 'Lifestyle', imageUrl: 'https://picsum.photos/seed/culinary/600/400', rating: { score: 4.4, count: 90 }, members: mockClubMembers.slice(2,5), joinRequests: [], status: 'approved' },
  { id: 8, name: 'Film Buffs', description: 'Weekly movie screenings and discussions about cinematography and storytelling.', memberCount: 95, category: 'Arts', imageUrl: 'https://picsum.photos/seed/filmbuffs/600/400', rating: { score: 4.5, count: 82 }, members: mockClubMembers.slice(0,5), joinRequests: [], status: 'approved' },
];

export const mockActivities: Activity[] = [
  { id: 1, title: 'Night Sky Observation', club: 'Stargazers Astronomy Club', clubId: 6, date: '2024-08-15', time: '9:00 PM', location: 'Observatory Hill', description: 'Join us for a magical night under the stars to observe the Perseid meteor shower.', imageUrl: 'https://picsum.photos/seed/activity1/600/400', status: 'approved' },
  { id: 2, title: 'React Workshop', club: 'Coding Hub', clubId: 2, date: '2024-08-18', time: '10:00 AM', location: 'Tech Hall, Room 301', description: 'A hands-on workshop for beginners to learn the fundamentals of React.', imageUrl: 'https://picsum.photos/seed/activity2/600/400', status: 'approved' },
  { id: 3, title: 'Sunrise Hike', club: 'Mountain Trekkers', clubId: 3, date: '2024-08-22', time: '5:00 AM', location: 'Eagle Peak Trailhead', description: 'An early morning hike to catch the breathtaking sunrise from Eagle Peak.', imageUrl: 'https://picsum.photos/seed/activity3/600/400', status: 'approved' },
  { id: 4, title: 'Portrait Photography Session', club: 'Photography Club', clubId: 1, date: '2024-08-25', time: '2:00 PM', location: 'City Botanical Gardens', description: 'Practice your portrait skills with fellow photographers in a beautiful setting.', imageUrl: 'https://picsum.photos/seed/activity4/600/400', status: 'approved' },
  { id: 5, title: 'Book Exchange & Social', club: 'Bookworm Society', clubId: 4, date: '2024-09-01', time: '4:00 PM', location: 'Campus Library Lounge', description: 'Bring a book, take a book! Meet fellow readers and chat about your favorite stories.', imageUrl: 'https://picsum.photos/seed/activity5/600/400', status: 'approved' },
];

export const mockUser: User = {
  id: 101,
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  joinedClubs: [1, 3, 4],
  registeredActivities: [3, 4],
  managedClubs: [1],
  ratings: [
    { clubId: 2, score: 5 },
    { clubId: 3, score: 4 },
    { clubId: 6, score: 5 },
  ],
  role: 'admin',
};

export const mockUsers: User[] = [
    mockUser,
    { id: 102, name: 'Jane Smith', email: 'jane.smith@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', joinedClubs: [2, 5], registeredActivities: [], managedClubs: [], ratings: [], role: 'user' },
    { id: 103, name: 'Sam Wilson', email: 'sam.wilson@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', joinedClubs: [3], registeredActivities: [], managedClubs: [3], ratings: [], role: 'admin' },
    { id: 104, name: 'Emily Brown', email: 'emily.brown@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704a', joinedClubs: [1, 4], registeredActivities: [], managedClubs: [], ratings: [], role: 'user' },
    { id: 105, name: 'Chris Lee', email: 'chris.lee@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704b', joinedClubs: [2, 5, 7], registeredActivities: [], managedClubs: [], ratings: [], role: 'user' },
];

export const mockPendingClubs: Club[] = [
    { id: 9, name: 'Debate Society', description: 'Engage in thoughtful debates and sharpen your public speaking skills.', memberCount: 0, category: 'Academic', imageUrl: 'https://picsum.photos/seed/debate/600/400', rating: { score: 0, count: 0 }, members: [], joinRequests: [], status: 'pending' },
    { id: 10, name: 'Go Green Initiative', description: 'A club dedicated to promoting environmental awareness and sustainability on campus.', memberCount: 0, category: 'Social', imageUrl: 'https://picsum.photos/seed/gogreen/600/400', rating: { score: 0, count: 0 }, members: [], joinRequests: [], status: 'pending' },
];

export const mockPendingActivities: Activity[] = [
    { id: 6, title: 'Intro to Machine Learning', club: 'AI Innovators', clubId: 5, date: '2024-09-05', time: '6:00 PM', location: 'Science Building, Lecture Hall 2', description: 'A seminar covering the basics of machine learning and its applications.', imageUrl: 'https://picsum.photos/seed/activity6/600/400', status: 'pending' },
    { id: 7, title: 'Italian Cuisine Night', club: 'Culinary Creators', clubId: 7, date: '2024-09-10', time: '7:00 PM', location: 'Student Union Kitchen', description: 'Learn to make authentic pasta from scratch and enjoy a delicious Italian dinner.', imageUrl: 'https://picsum.photos/seed/activity7/600/400', status: 'pending' },
];