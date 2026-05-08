import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockClubs, mockUser } from '../data/mockData';
import { UsersIcon, CogIcon } from '../components/icons';
import StarRating from '../components/StarRating';
import ApplicationModal from '../components/ApplicationModal';

const ClubDetailPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const club = mockClubs.find(c => c.id === parseInt(clubId || ''));

  if (!club) {
    return <div className="text-center py-20">未找到该社团。</div>;
  }
  
  const userRating = mockUser.ratings.find(r => r.clubId === club.id)?.score || 0;
  const [currentRating, setCurrentRating] = useState(userRating);
  const [isMember, setIsMember] = useState(mockUser.joinedClubs.includes(club.id));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRatingChange = (newRating: number) => {
    setCurrentRating(newRating);
    // 在真实应用中，您会在此处将更改持久化到后端。
    console.log(`用户为 ${club.name} 评了 ${newRating} 星。`);
  };
  
  const handleJoinQuit = () => {
    if (isMember) {
        console.log(`退出社团 ${club.name}`);
        setIsMember(false);
    } else {
        setIsModalOpen(true);
    }
  }

  const handleApplicationSubmit = (formData: { studentId: string; phone: string; reason: string }) => {
    console.log(`Submitting application for ${club.name} with data:`, formData);
    // 在真实应用中，这将是一个API调用。
    // 我们将模拟成功，但现实中这可能会进入“待批准”状态。
    setIsMember(true);
    setIsModalOpen(false);
    alert('申请已提交！');
  };

  const isManager = mockUser.managedClubs.includes(club.id);

  return (
    <>
      <div>
        <div className="relative w-full h-80">
          <img src={club.imageUrl} alt={club.name} className="absolute inset-0 w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white container mx-auto">
            <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 mb-2 rounded-full">{club.category}</span>
            <h1 className="text-5xl font-extrabold mt-1" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>{club.name}</h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold mb-4">关于社团</h2>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{club.description}</p>
              </div>
              
              {isManager && (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg mt-8">
                  <h2 className="text-3xl font-bold mb-6">社团成员 ({club.members.length})</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {club.members.map(member => (
                      <div key={member.id} className="flex flex-col items-center text-center space-y-2">
                        <img src={member.avatarUrl} alt={member.name} className="w-16 h-16 rounded-full" />
                        <div>
                          <p className="font-semibold text-sm">{member.name}</p>
                        </div>
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
                            <p className="text-xl font-bold">{club.memberCount}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">成员</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <StarRating rating={club.rating.score} readOnly size="w-8 h-8" />
                        <div>
                            <p className="text-xl font-bold">{club.rating.score.toFixed(1)}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">({club.rating.count} 评价)</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                    <h3 className="text-lg font-bold mb-3">
                        {userRating > 0 ? '更新您的评分' : '评价此社团'}
                    </h3>
                    <StarRating rating={currentRating} onRatingChange={handleRatingChange} size="w-8 h-8" className="justify-center" />
                    {currentRating > 0 && <p className="text-xs text-gray-500 mt-2">您给此社团的评分为 {currentRating} / 5 星。</p>}
                </div>
                
                <div className="space-y-3">
                    {isManager && (
                        <Link to={`/clubs/${club.id}/manage`} className="flex items-center justify-center w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-base shadow-lg">
                            <CogIcon className="w-5 h-5 mr-2" />
                            管理社团
                        </Link>
                    )}

                    {isMember ? (
                        <button onClick={handleJoinQuit} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-base shadow-lg">
                            退出社团
                        </button>
                    ) : (
                        <button onClick={handleJoinQuit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-base shadow-lg">
                            加入社团
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
        onSubmit={handleApplicationSubmit}
        title={`申请加入 ${club.name}`}
      />
    </>
  );
};

export default ClubDetailPage;