import React, { useState, useEffect } from 'react';
import { mockUser } from '../data/mockData';
import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { UsersIcon, CalendarIcon, ArrowRightIcon, StarRatingIcon, LockClosedIcon } from '../components/icons';
import StarRating from '../components/StarRating';
import { fetchUserInfo } from '../services/userApi';
import { getMyRegistrations, cancelRegistration } from '../services/activityApi';
import { getMyRatings, cancelRating } from '../services/ratingApi';
import type { MyRatingRecord } from '../services/ratingApi';
import { getMyClubApplications } from '../services/memberApi';
import type { MyClubApplication } from '../services/memberApi';
import type { UserInfo, MyRegistrationRecord } from '../types';

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [myRegistrations, setMyRegistrations] = useState<MyRegistrationRecord[]>([]);
  const [regLoading, setRegLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [myRatings, setMyRatings] = useState<MyRatingRecord[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [cancellingRatingId, setCancellingRatingId] = useState<string | null>(null);
  const [myApplications, setMyApplications] = useState<MyClubApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  useEffect(() => {
    fetchUserInfo().then(setUserInfo).catch((err) => console.error('[userInfo]', err));
  }, []);

  useEffect(() => {
    if (activeTab === 'registeredActivities' && myRegistrations.length === 0) {
      setRegLoading(true);
      getMyRegistrations()
        .then(setMyRegistrations)
        .catch((err) => console.error('[myRegistrations]', err))
        .finally(() => setRegLoading(false));
    }
    if (activeTab === 'ratings' && myRatings.length === 0) {
      setRatingsLoading(true);
      getMyRatings()
        .then(setMyRatings)
        .catch((err) => console.error('[myRatings]', err))
        .finally(() => setRatingsLoading(false));
    }
    if ((activeTab === 'applications' || activeTab === 'joinedClubs') && myApplications.length === 0) {
      setApplicationsLoading(true);
      getMyClubApplications()
        .then(setMyApplications)
        .catch((err) => console.error('[myApplications]', err))
        .finally(() => setApplicationsLoading(false));
    }
  }, [activeTab]);

  const handleCancelRegistration = async (registrationId: string) => {
    setCancellingId(registrationId);
    try {
      const msg = await cancelRegistration(registrationId);
      alert(msg);
      setMyRegistrations(prev => prev.filter(r => r.registrationId !== registrationId));
    } catch (err: any) {
      alert(err.message ?? '取消报名失败，请重试');
    } finally {
      setCancellingId(null);
    }
  };

  const handleCancelRating = async (ratingId: string, clubId: string) => {
    setCancellingRatingId(ratingId);
    try {
      const msg = await cancelRating(clubId);
      alert(msg);
      setMyRatings(prev => prev.filter(r => r.ratingId !== ratingId));
    } catch (err: any) {
      alert(err.message ?? '取消评分失败，请重试');
    } finally {
      setCancellingRatingId(null);
    }
  };

  const tabClass = (tabName: string) =>
    `flex-1 md:flex-none px-4 py-3 font-semibold transition-colors cursor-pointer text-sm sm:text-base whitespace-nowrap text-center ${
      activeTab === tabName
        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
    }`;

  const tabs = [
    { id: 'applications', label: '我的入社申请', icon: UsersIcon },
    { id: 'joinedClubs', label: '我加入的社团', icon: UsersIcon },
    { id: 'registeredActivities', label: '我报名的活动', icon: CalendarIcon },
    { id: 'ratings', label: '我的评分', icon: StarRatingIcon },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Profile Info */}
        <aside className="lg:w-1/3 xl:w-1/4">
          <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <Avatar name={userInfo?.userName ?? mockUser.name} src={mockUser.avatarUrl} size={112} className="mx-auto border-4 border-indigo-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{userInfo?.realName ?? userInfo?.userName ?? mockUser.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">学号：{userInfo?.userId ?? '—'}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{userInfo?.userMailbox ?? userInfo?.phoneNumber ?? mockUser.email}</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/profile/edit" className="w-full inline-block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                编辑个人资料
              </Link>
              <Link to="/profile/change-password" className="w-full inline-flex justify-center items-center bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">
                <LockClosedIcon className="w-5 h-5 mr-2" />
                修改密码
              </Link>
              <Link to="/profile/delete-account" className="w-full inline-block text-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                注销账号
              </Link>
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
            {activeTab === 'applications' && (
              <div className="space-y-4">
                {applicationsLoading ? (
                  <p className="text-center text-gray-400 py-10">加载中...</p>
                ) : myApplications.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-10">暂无入社申请记录</p>
                ) : myApplications.map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">{item.clubName}</h3>
                      <p className="text-xs text-gray-400 mt-1">社团ID：{item.clubId}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.reviewState === '审核通过' || item.reviewState === '通过'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : item.reviewState === '审核退回' || item.reviewState === '拒绝'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {item.reviewState}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'joinedClubs' && (
              <div className="space-y-4">
                {applicationsLoading ? (
                  <p className="text-center text-gray-400 py-10">加载中...</p>
                ) : myApplications.filter(a => a.reviewState === '审核通过' || a.reviewState === '通过').length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-10">您还没有加入任何社团</p>
                ) : myApplications.filter(a => a.reviewState === '审核通过' || a.reviewState === '通过').map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.clubName}</h3>
                      <p className="text-xs text-gray-400 mt-1">社团ID：{item.clubId}</p>
                    </div>
                    <Link to={`/clubs/${item.clubId}`} className="inline-flex items-center font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm">
                      查看社团
                      <ArrowRightIcon className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'registeredActivities' && (
              <div className="space-y-4">
                {regLoading ? (
                  <p className="text-center text-gray-400 py-10">加载中...</p>
                ) : myRegistrations.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">您还没有报名任何活动</p>
                ) : myRegistrations.map(record => (
                  <div key={record.registrationId} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
                    <div className="flex-grow">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">{record.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 truncate max-w-md">{record.content}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(record.publishTime).toLocaleDateString('zh-CN')}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.reviewState === '审核通过'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : record.reviewState === '审核退回'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {record.reviewState}
                      </span>
                      {(record.reviewState === '审核中' || record.reviewState === '待审核' || record.reviewState === '审核通过') && (
                        <button
                          onClick={() => handleCancelRegistration(record.registrationId)}
                          disabled={cancellingId === record.registrationId}
                          className="border border-red-500 text-red-500 font-semibold py-1 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingId === record.registrationId ? '取消中...' : '取消报名'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'ratings' && (
              <div className="space-y-4">
                {ratingsLoading ? (
                  <p className="text-center text-gray-400 py-10">加载中...</p>
                ) : myRatings.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">您还没有评分记录</p>
                ) : myRatings.map(item => (
                  <div key={item.ratingId} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-md bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 dark:text-indigo-300 font-bold text-lg">{item.clubName.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">{item.clubName}</h3>
                        <div className="flex items-center mt-1">
                          <StarRating rating={Number(item.rating)} readOnly size="h-4 w-4" />
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{item.rating} / 5 星</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{new Date(item.ratingTime).toLocaleDateString('zh-CN')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancelRating(item.ratingId, item.clubId)}
                      disabled={cancellingRatingId === item.ratingId}
                      className="flex-shrink-0 border border-red-500 text-red-500 font-semibold py-1 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingRatingId === item.ratingId ? '取消中...' : '取消评分'}
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
