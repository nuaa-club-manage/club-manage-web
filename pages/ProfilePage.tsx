import React, { useState } from 'react';
import { mockUser, mockClubs, mockActivities } from '../data/mockData';
import { Link } from 'react-router-dom';
import { UsersIcon, CalendarIcon, ArrowRightIcon, StarRatingIcon, PlusCircleIcon, CogIcon } from '../components/icons';
import StarRating from '../components/StarRating';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('joinedClubs');

  const userJoinedClubs = mockClubs.filter(club => mockUser.joinedClubs.includes(club.id));
  const userManagedClubs = mockClubs.filter(club => mockUser.managedClubs.includes(club.id));
  const userRegisteredActivities = mockActivities.filter(activity => mockUser.registeredActivities.includes(activity.id));
  const userPublishedActivities = mockActivities.filter(activity => mockUser.managedClubs.includes(activity.clubId));
  
  const userRatings = mockUser.ratings.map(rating => {
    const club = mockClubs.find(c => c.id === rating.clubId);
    return { ...rating, club };
  }).filter(item => item.club);


  const tabClass = (tabName: string) =>
    `flex-1 md:flex-none px-4 py-3 font-semibold transition-colors cursor-pointer text-sm sm:text-base whitespace-nowrap text-center ${
      activeTab === tabName
        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
    }`;

  const tabs = [
    { id: 'joinedClubs', label: '我加入的社团', icon: UsersIcon },
    { id: 'createdClubs', label: '我创建的社团', icon: UsersIcon },
    { id: 'registeredActivities', label: '我报名的活动', icon: CalendarIcon },
    { id: 'publishedActivities', label: '我发布的活动', icon: CalendarIcon },
    { id: 'ratings', label: '我的评分', icon: StarRatingIcon },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Profile Info */}
        <aside className="lg:w-1/3 xl:w-1/4">
          <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <img src={mockUser.avatarUrl} alt={mockUser.name} className="w-28 h-28 mx-auto rounded-full border-4 border-indigo-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{mockUser.name}</h1>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-1">{mockUser.email}</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/profile/edit" className="w-full inline-block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                编辑个人资料
              </Link>
              <Link to="/clubs/create" className="w-full inline-flex justify-center items-center bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                <PlusCircleIcon className="w-5 h-5 mr-2" />
                成立社团
              </Link>
              {mockUser.managedClubs.length > 0 && (
                  <Link to="/activities/publish" className="w-full inline-flex justify-center items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      <PlusCircleIcon className="w-5 h-5 mr-2" />
                      发布活动
                  </Link>
              )}
            </div>
          </div>
        </aside>

        {/* Right Content - Tabs */}
        <div className="lg:w-2/3 xl:w-3/4">
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <nav className="flex">
              {tabs.map(tab => (
                 <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={tabClass(tab.id)}>
                    <span className="flex items-center justify-center"><tab.icon className="w-5 h-5 mr-2 hidden sm:inline" />{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'joinedClubs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userJoinedClubs.map(club => (
                  <div key={club.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between">
                    <div>
                      <img src={club.imageUrl} alt={club.name} className="w-full h-32 object-cover rounded-md mb-4" />
                      <h3 className="text-lg font-bold">{club.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm h-12 overflow-hidden text-ellipsis">{club.description}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                        <Link to={`/clubs/${club.id}`} className="inline-flex items-center font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm">
                            查看社团
                            <ArrowRightIcon className="w-4 h-4 ml-1" />
                        </Link>
                        {!userManagedClubs.find(c => c.id === club.id) && (
                            <button className="border border-red-500 text-red-500 font-semibold py-1 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors text-xs">
                                退出社团
                            </button>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'createdClubs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userManagedClubs.map(club => (
                  <div key={club.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between">
                    <div>
                      <img src={club.imageUrl} alt={club.name} className="w-full h-32 object-cover rounded-md mb-4" />
                      <h3 className="text-lg font-bold">{club.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm h-12 overflow-hidden text-ellipsis">{club.description}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t dark:border-gray-700 flex justify-end items-center">
                        <Link to={`/clubs/${club.id}/manage`} className="inline-flex items-center font-semibold bg-gray-600 text-white hover:bg-gray-700 py-2 px-3 rounded-lg text-sm">
                            管理社团
                            <CogIcon className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'registeredActivities' && (
              <div className="space-y-4">
                {userRegisteredActivities.map(activity => (
                   <div key={activity.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={activity.imageUrl} alt={activity.title} className="w-16 h-16 object-cover rounded-md" />
                      <div className="flex-grow">
                        <h3 className="text-base font-bold">
                           <Link to={`/activities/${activity.id}`} className="hover:underline">{activity.title}</Link>
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{activity.club}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(activity.date).toDateString()} at {activity.time}</p>
                      </div>
                    </div>
                    <button className="border border-red-500 text-red-500 font-semibold py-1 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors text-xs flex-shrink-0">
                      取消
                    </button>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'publishedActivities' && (
              <div className="space-y-4">
                {userPublishedActivities.length > 0 ? userPublishedActivities.map(activity => (
                   <div key={activity.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={activity.imageUrl} alt={activity.title} className="w-16 h-16 object-cover rounded-md" />
                      <div>
                        <h3 className="text-base font-bold">
                            <Link to={`/activities/${activity.id}`} className="hover:underline">{activity.title}</Link>
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{activity.club}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(activity.date).toDateString()} at {activity.time}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0">
                        <button className="border border-gray-400 text-gray-600 dark:border-gray-500 dark:text-gray-300 font-semibold py-1 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs">
                          编辑
                        </button>
                        <button className="border border-red-500 text-red-500 font-semibold py-1 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors text-xs">
                          取消
                        </button>
                    </div>
                  </div>
                )) : <p className="text-center text-gray-500 dark:text-gray-400">您还没有发布任何活动。</p>}
              </div>
            )}
            {activeTab === 'ratings' && (
               <div className="space-y-4">
                {userRatings.map(ratingItem => (
                   <div key={ratingItem.clubId} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={ratingItem.club.imageUrl} alt={ratingItem.club.name} className="w-16 h-16 object-cover rounded-md" />
                      <div>
                        <h3 className="text-base font-bold">{ratingItem.club.name}</h3>
                        <div className="flex items-center mt-1">
                          <StarRating rating={ratingItem.score} readOnly size="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <button className="border border-gray-400 text-gray-600 dark:border-gray-500 dark:text-gray-300 font-semibold py-1 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs">
                      取消评分
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;