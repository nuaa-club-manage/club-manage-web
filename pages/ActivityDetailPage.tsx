import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockActivities, mockUser } from '../data/mockData';
import { CalendarIcon, ClockIcon, LocationMarkerIcon, ClubIcon } from '../components/icons';
import ApplicationModal from '../components/ApplicationModal';

const ActivityDetailPage: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const activity = mockActivities.find(a => a.id === parseInt(activityId || ''));

  if (!activity) {
    return <div className="text-center py-20">未找到该活动。</div>;
  }

  const [isRegistered, setIsRegistered] = useState(mockUser.registeredActivities.includes(activity.id));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRegisterToggle = () => {
    if (isRegistered) {
      console.log(`Cancelling registration for activity: ${activity.title}`);
      setIsRegistered(false);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleRegistrationSubmit = (formData: { studentId: string; phone: string; reason: string }) => {
    console.log(`Submitting registration for ${activity.title} with data:`, formData);
    // In a real app, this would be an API call.
    setIsRegistered(true);
    setIsModalOpen(false);
    alert('报名成功！');
  };

  return (
    <>
       <div>
        <div className="relative w-full h-80">
          <img src={activity.imageUrl} alt={activity.title} className="absolute inset-0 w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white container mx-auto">
            <Link to={`/clubs/${activity.clubId}`} className="text-lg font-semibold hover:underline mb-1 block">{activity.club}</Link>
            <h1 className="text-5xl font-extrabold" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>{activity.title}</h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
              {/* Main Content */}
              <div className="lg:w-2/3">
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold mb-4">关于活动</h2>
                    <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{activity.description}</p>
                  </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:w-1/3">
                <div className="sticky top-24 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
                        <div className="flex items-center space-x-4">
                            <CalendarIcon className="w-7 h-7 text-indigo-500 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-lg">{new Date(activity.date).toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">日期</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <ClockIcon className="w-7 h-7 text-indigo-500 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-lg">{activity.time}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">时间</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <LocationMarkerIcon className="w-7 h-7 text-indigo-500 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-lg">{activity.location}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">地点</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 pt-4 border-t dark:border-gray-700">
                            <ClubIcon className="w-7 h-7 text-indigo-500 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-lg">{activity.club}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">主办社团</p>
                            </div>
                        </div>
                    </div>

                    <div>
                    {isRegistered ? (
                        <button onClick={handleRegisterToggle} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-base shadow-lg">
                            取消报名
                        </button>
                    ) : (
                        <button onClick={handleRegisterToggle} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-base shadow-lg">
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
        title={`报名参加 ${activity.title}`}
      />
    </>
  );
};

export default ActivityDetailPage;