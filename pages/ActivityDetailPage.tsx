import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockActivities } from '../data/mockData';
import { CalendarIcon, LocationMarkerIcon, ClubIcon } from '../components/icons';
import ApplicationModal from '../components/ApplicationModal';
import { registerActivity, cancelRegistration, getMyRegistrations, getActivityDetail } from '../services/activityApi';
import type { ApiActivity } from '../services/activityApi';

const ActivityDetailPage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();

  const numericId = parseInt(activityId || '');
  const mockActivity = isNaN(numericId) ? null : mockActivities.find(a => a.id === numericId) ?? null;

  const [apiActivity, setApiActivity] = useState<ApiActivity | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(!mockActivity);
  const [notFound, setNotFound] = useState(false);

  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (mockActivity || !activityId) return;
    getActivityDetail(activityId)
      .then(setApiActivity)
      .catch(() => setNotFound(true))
      .finally(() => setLoadingActivity(false));
  }, [activityId]);

  useEffect(() => {
    if (!activityId) return;
    getMyRegistrations()
      .then(records => {
        const cancellable = records.find(r =>
          r.reviewState === '审核通过' || r.reviewState === '审核中' || r.reviewState === '待审核'
        );
        if (cancellable) {
          setIsRegistered(true);
          setRegistrationId(cancellable.registrationId);
        }
      })
      .catch(() => {});
  }, [activityId]);

  if (loadingActivity) {
    return <div className="text-center py-20 text-gray-500">加载中...</div>;
  }

  if (notFound || (!mockActivity && !apiActivity)) {
    return <div className="text-center py-20">未找到该活动。</div>;
  }

  const displayTitle = mockActivity ? mockActivity.title : apiActivity!.title;
  const displayClub = mockActivity ? mockActivity.club : apiActivity!.clubName;
  const displayClubId = mockActivity ? mockActivity.clubId : apiActivity!.clubId;
  const displayDescription = mockActivity ? mockActivity.description : apiActivity!.content;
  const displayLocation = mockActivity ? mockActivity.location : apiActivity!.location;
  const displayImage = mockActivity
    ? mockActivity.imageUrl
    : `https://picsum.photos/seed/${apiActivity!.activityId}/600/400`;
  const displayDate = mockActivity
    ? new Date(mockActivity.date).toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : apiActivity!.publishTime
      ? new Date(apiActivity!.publishTime).toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : '-';
  const realActivityId = mockActivity ? String(mockActivity.id) : apiActivity!.activityId;

  const handleRegistrationSubmit = async (formData: { realName: string; phoneNumber: string }) => {
    try {
      const msg = await registerActivity(realActivityId, formData.realName, formData.phoneNumber);
      const records = await getMyRegistrations();
      const cancellable = records.find(r =>
        r.reviewState === '审核通过' || r.reviewState === '审核中' || r.reviewState === '待审核'
      );
      if (cancellable) setRegistrationId(cancellable.registrationId);
      setIsRegistered(true);
      setIsModalOpen(false);
      alert(msg);
    } catch (err: any) {
      alert(err.message ?? '报名失败，请重试');
    }
  };

  const handleCancelRegistration = async () => {
    if (!registrationId) return;
    setCancelling(true);
    try {
      const msg = await cancelRegistration(registrationId);
      alert(msg);
      setIsRegistered(false);
      setRegistrationId(null);
    } catch (err: any) {
      alert(err.message ?? '取消报名失败，请重试');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <div>
        <div className="relative w-full h-80">
          <img src={displayImage} alt={displayTitle} className="absolute inset-0 w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white container mx-auto">
            <Link to={`/clubs/${displayClubId}`} className="text-lg font-semibold hover:underline mb-1 block">{displayClub}</Link>
            <h1 className="text-5xl font-extrabold" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>{displayTitle}</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold mb-4">关于活动</h2>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{displayDescription}</p>
              </div>
            </div>

            <aside className="lg:w-1/3">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
                  <div className="flex items-center space-x-4">
                    <CalendarIcon className="w-7 h-7 text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-lg">{displayDate}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">发布日期</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <LocationMarkerIcon className="w-7 h-7 text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-lg">{displayLocation}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">地点</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 pt-4 border-t dark:border-gray-700">
                    <ClubIcon className="w-7 h-7 text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-lg">{displayClub}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">主办社团</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {isRegistered ? (
                    <>
                      <button disabled className="w-full bg-gray-400 text-white font-bold py-3 px-6 rounded-lg text-base shadow-lg cursor-not-allowed">
                        已报名
                      </button>
                      <button
                        onClick={handleCancelRegistration}
                        disabled={cancelling}
                        className="w-full border-2 border-red-500 text-red-500 font-bold py-3 px-6 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancelling ? '取消中...' : '取消报名'}
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsModalOpen(true)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-base shadow-lg">
                      报名参加
                    </button>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegistrationSubmit}
        title={`报名参加 ${displayTitle}`}
      />
    </>
  );
};

export default ActivityDetailPage;
