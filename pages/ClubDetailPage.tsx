import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockClubs, mockUser } from '../data/mockData';
import { UsersIcon, CogIcon } from '../components/icons';
import StarRating from '../components/StarRating';
import { submitRating, getMyClubRating, getClubAverageScores, cancelRating } from '../services/ratingApi';
import type { MyRatingRecord, ClubAverageScore } from '../services/ratingApi';
import { getClubDetail } from '../services/clubApi';
import type { ApiClub } from '../services/clubApi';
import { joinClub, leaveClub, getMyClubApplications } from '../services/memberApi';

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
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinForm, setJoinForm] = useState({ realName: '', studentId: '', school: '', grade: '', introduction: '', reason: '' });
  const [myClubRating, setMyClubRating] = useState<MyRatingRecord | null>(null);
  const [cancellingRating, setCancellingRating] = useState(false);
  const [clubAverageScore, setClubAverageScore] = useState<ClubAverageScore | null>(null);

  useEffect(() => {
    if (mockClub || !clubId) return;
    getClubDetail(clubId)
      .then(setApiClub)
      .catch(() => setClubNotFound(true))
      .finally(() => setLoadingClub(false));
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
  const displayMemberCount = mockClub ? mockClub.memberCount : 0;
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
      setShowJoinForm(true);
    }
  };

  const handleJoinSubmit = async () => {
    if (!clubId) return;
    setJoining(true);
    try {
      const msg = await joinClub(clubId);
      alert(msg);
      setIsMember(true);
      setShowJoinForm(false);
      setJoinForm({ realName: '', studentId: '', school: '', grade: '', introduction: '', reason: '' });
    } catch (err: any) {
      alert(err.message ?? '申请失败，请重试');
    } finally {
      setJoining(false);
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
                        <img src={member.avatarUrl} alt={member.name} className="w-16 h-16 rounded-full" />
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

      {/* 加入社团表单弹窗 */}
      {showJoinForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">申请加入 {displayName}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">姓名 *</label>
                  <input
                    type="text"
                    value={joinForm.realName}
                    onChange={e => setJoinForm(f => ({ ...f, realName: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">学号 *</label>
                  <input
                    type="text"
                    value={joinForm.studentId}
                    onChange={e => setJoinForm(f => ({ ...f, studentId: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">所在学院 *</label>
                  <input
                    type="text"
                    value={joinForm.school}
                    onChange={e => setJoinForm(f => ({ ...f, school: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">年级 *</label>
                  <input
                    type="text"
                    placeholder="如：2023级"
                    value={joinForm.grade}
                    onChange={e => setJoinForm(f => ({ ...f, grade: e.target.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">个人简介</label>
                <textarea
                  rows={2}
                  value={joinForm.introduction}
                  onChange={e => setJoinForm(f => ({ ...f, introduction: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">申请理由 *</label>
                <textarea
                  rows={3}
                  value={joinForm.reason}
                  onChange={e => setJoinForm(f => ({ ...f, reason: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowJoinForm(false)}
                disabled={joining}
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleJoinSubmit}
                disabled={joining || !joinForm.realName || !joinForm.studentId || !joinForm.school || !joinForm.grade || !joinForm.reason}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {joining ? '提交中...' : '提交申请'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClubDetailPage;
