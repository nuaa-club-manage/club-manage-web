import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockClubs, mockUser } from '../data/mockData';
import { UsersIcon, CogIcon } from '../components/icons';
import StarRating from '../components/StarRating';
import Avatar from '../components/Avatar';
import { submitRating, getMyClubRating, getClubAverageScores, cancelRating } from '../services/ratingApi';
import type { MyRatingRecord, ClubAverageScore } from '../services/ratingApi';
import { getClubDetail } from '../services/clubApi';
import type { ApiClub } from '../services/clubApi';
import { joinClub, leaveClub, getMyClubApplications, getMemberCount } from '../services/memberApi';

const ClubDetailPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();

  const numericId = parseInt(clubId || '');
  const mockClub = isNaN(numericId) ? null : mockClubs.find(c => c.id === numericId) ?? null;

  const [apiClub, setApiClub] = useState<ApiClub | null>(null);
  const [loadingClub, setLoadingClub] = useState(!mockClub);
  const [clubNotFound, setClubNotFound] = useState(false);

  const userRating = mockClub ? (mockUser.ratings.find(r => r.clubId === mockClub.id)?.score || 0) : 0;
  const [currentRating, setCurrentRating] = useState(userRating);
  const [submittedRating, setSubmittedRating] = useState(userRating);
  const [submitting, setSubmitting] = useState(false);
  const [isMember, setIsMember] = useState(mockClub ? mockUser.joinedClubs.includes(mockClub.id) : false);
  const [joining, setJoining] = useState(false);
  const [myClubRating, setMyClubRating] = useState<MyRatingRecord | null>(null);
  const [cancellingRating, setCancellingRating] = useState(false);
  const [clubAverageScore, setClubAverageScore] = useState<ClubAverageScore | null>(null);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    if (mockClub || !clubId) return;
    getClubDetail(clubId)
      .then(setApiClub)
      .catch(() => setClubNotFound(true))
      .finally(() => setLoadingClub(false));
    getMemberCount(clubId)
      .then(count => setMemberCount(count))
      .catch(() => {});
  }, [clubId]);

  useEffect(() => {
    if (!clubId || mockClub) return;
    getMyClubApplications()
      .then(list => {
        const joined = list.some(
          a => a.clubId === clubId && (a.reviewState === '审核通过' || a.reviewState === '通过')
        );
        setIsMember(joined);
      })
      .catch(() => {});
  }, [clubId]);

  useEffect(() => {
    if (!clubId) return;
    getMyClubRating(clubId).then(setMyClubRating).catch(() => {});
    getClubAverageScores()
      .then(list => {
        const matched = list.find(s => s.clubId === clubId);
        if (matched) setClubAverageScore(matched);
      })
      .catch(() => {});
  }, [clubId]);

  if (loadingClub) {
    return <div className="text-center py-20 text-gray-500">加载中...</div>;
  }

  if (clubNotFound || (!mockClub && !apiClub)) {
    return <div className="text-center py-20">未找到该社团。</div>;
  }

  const displayName = mockClub ? mockClub.name : apiClub!.clubName;
  const displayDescription = mockClub ? mockClub.description : apiClub!.clubInformation;
  const displayCategory = mockClub ? mockClub.category : (apiClub!.school || '未分类');
  const displayImage = mockClub
    ? mockClub.imageUrl
    : `https://picsum.photos/seed/${apiClub!.clubId}/600/400`;
  const displayMemberCount = mockClub ? mockClub.memberCount : memberCount;
  const displayRatingScore = clubAverageScore
    ? clubAverageScore.averageScore
    : (mockClub ? mockClub.rating.score : 0);
  const displayRatingCount = clubAverageScore
    ? clubAverageScore.ratingCount
    : (mockClub ? mockClub.rating.count : 0);
  const isManager = mockClub ? mockUser.managedClubs.includes(mockClub.id) : false;

  const handleRatingChange = (newRating: number) => setCurrentRating(newRating);

  const handleRatingSubmit = async () => {
    if (!clubId) return;
    setSubmitting(true);
    try {
      const msg = await submitRating(clubId, currentRating);
      setSubmittedRating(currentRating);
      setMyClubRating(prev => ({
        ratingId: prev?.ratingId ?? '',
        clubId: clubId,
        clubName: displayName,
        rating: String(currentRating),
        ratingTime: new Date().toISOString(),
      }));
      getClubAverageScores()
        .then(list => {
          const matched = list.find(s => s.clubId === clubId);
          if (matched) setClubAverageScore(matched);
        })
        .catch(() => {});
      alert(msg);
    } catch (err: any) {
      alert(err.message ?? '评分提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRating = async () => {
    if (!clubId) return;
    setCancellingRating(true);
    try {
      const msg = await cancelRating(clubId);
      alert(msg);
      setMyClubRating(null);
      setCurrentRating(0);
      setSubmittedRating(0);
      getClubAverageScores()
        .then(list => {
          const matched = list.find(s => s.clubId === clubId);
          setClubAverageScore(matched ?? null);
        })
        .catch(() => {});
    } catch (err: any) {
      alert(err.message ?? '取消评分失败，请重试');
    } finally {
      setCancellingRating(false);
    }
  };

  const handleJoinQuit = async () => {
    if (!clubId) return;
    if (isMember) {
      setJoining(true);
      try {
        const msg = await leaveClub(clubId);
        alert(msg);
        setIsMember(false);
      } catch (err: any) {
        alert(err.message ?? '退出失败，请重试');
      } finally {
        setJoining(false);
      }
    } else {
      setJoining(true);
      try {
        const msg = await joinClub(clubId);
        alert(msg);
        setIsMember(true);
      } catch (err: any) {
        alert(err.message ?? '申请失败，请重试');
      } finally {
        setJoining(false);
      }
    }
  };

  return (
    <>
      <div>
        <div className="relative w-full h-80">
          <img src={displayImage} alt={displayName} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white container mx-auto">
            <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 mb-2 rounded-full">{displayCategory}</span>
            <h1 className="text-5xl font-extrabold mt-1" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>{displayName}</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold mb-4">关于社团</h2>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{displayDescription}</p>
              </div>

              {isManager && mockClub && (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mt-8">
                  <h2 className="text-3xl font-bold mb-6">社团成员 ({mockClub.members.length})</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {mockClub.members.map(member => (
                      <div key={member.id} className="flex flex-col items-center text-center space-y-2">
                        <Avatar name={member.name} src={member.avatarUrl} size={64} />
                        <p className="font-semibold text-sm">{member.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/3">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-4 mb-4 pb-4 border-b dark:border-gray-700">
                    <UsersIcon className="w-8 h-8 text-indigo-500" />
                    <div>
                      <p className="text-xl font-bold">{displayMemberCount}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">成员</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <StarRating rating={displayRatingScore} readOnly size="w-8 h-8" />
                    <div>
                      <p className="text-xl font-bold">{displayRatingScore.toFixed(1)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">({displayRatingCount} 评价)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                  <h3 className="text-lg font-bold mb-3">
                    {submittedRating > 0 ? '更新您的评分' : '评价此社团'}
                  </h3>
                  <StarRating rating={currentRating} onRatingChange={handleRatingChange} size="w-8 h-8" className="justify-center" />
                  {currentRating > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {currentRating} / 5 星
                      {submittedRating === currentRating && <span className="ml-1 text-green-500">（已提交）</span>}
                    </p>
                  )}
                  {currentRating > 0 && currentRating !== submittedRating && (
                    <button
                      onClick={handleRatingSubmit}
                      disabled={submitting}
                      className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? '提交中...' : '提交评分'}
                    </button>
                  )}
                  {myClubRating && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-left">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">我的历史评分</p>
                      <div className="flex items-center justify-between">
                        <StarRating rating={Number(myClubRating.rating)} readOnly size="w-5 h-5" />
                        <span className="text-xs text-gray-400">
                          {new Date(myClubRating.ratingTime).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <button
                        onClick={handleCancelRating}
                        disabled={cancellingRating}
                        className="mt-2 w-full border border-red-500 text-red-500 font-semibold py-1 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingRating ? '取消中...' : '取消评分'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {isManager && mockClub && (
                    <Link to={`/clubs/${mockClub.id}/manage`} className="flex items-center justify-center w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-base shadow-lg">
                      <CogIcon className="w-5 h-5 mr-2" />
                      管理社团
                    </Link>
                  )}
                  {isMember ? (
                    <button onClick={handleJoinQuit} disabled={joining} className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-base shadow-lg">
                      {joining ? '处理中...' : '退出社团'}
                    </button>
                  ) : (
                    <button onClick={handleJoinQuit} disabled={joining} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-base shadow-lg">
                      {joining ? '处理中...' : '加入社团'}
                    </button>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

    </>
  );
};

export default ClubDetailPage;
