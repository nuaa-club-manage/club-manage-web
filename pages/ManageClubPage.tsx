import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockClubs, mockUser } from '../data/mockData';
import type { Club, ClubMember } from '../types';
import Avatar from '../components/Avatar';

const ManageClubPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const [club, setClub] = useState<Club | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('members');
  const [clubName, setClubName] = useState('');
  const [clubDescription, setClubDescription] = useState('');

  useEffect(() => {
    const foundClub = mockClubs.find(c => c.id === parseInt(clubId || ''));
    if (foundClub) {
      if (!mockUser.managedClubs.includes(foundClub.id)) {
        // Redirect if user is not a manager
        navigate(`/clubs/${clubId}`);
      } else {
        setClub(foundClub);
        setClubName(foundClub.name);
        setClubDescription(foundClub.description);
      }
    }
  }, [clubId, navigate]);

  if (!club) {
    return <div className="text-center py-20">正在加载或未找到社团...</div>;
  }

  const handleRequest = (userId: number, action: 'approve' | 'deny') => {
    // Mock action
    console.log(`User ${userId} request ${action}d for club ${club.name}`);
    setClub(prevClub => prevClub ? {
        ...prevClub,
        joinRequests: prevClub.joinRequests.filter(req => req.id !== userId)
    } : undefined);
  };

  const handleInfoSave = () => {
    // Mock save
    console.log(`Saving info for ${club.name}:`, { name: clubName, description: clubDescription });
    alert('社团信息已保存！');
  };

  const handleDisband = () => {
    if (window.confirm(`您确定要解散社团 "${club.name}" 吗？此操作不可撤销。`)) {
      // Mock disband
      console.log(`Disbanding club ${club.name}`);
      alert(`社团 "${club.name}" 已解散。`);
      navigate('/clubs');
    }
  };

  const tabClass = (tabName: string) =>
    `px-6 py-3 font-semibold rounded-t-lg transition-colors cursor-pointer ${
      activeTab === tabName
        ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;
    
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">管理: {club.name}</h1>
      
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-2">
          <button onClick={() => setActiveTab('members')} className={tabClass('members')}>
            成员管理
          </button>
          <button onClick={() => setActiveTab('settings')} className={tabClass('settings')}>
            信息修改
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'members' && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">入团申请 ({club.joinRequests.length})</h2>
            {club.joinRequests.length > 0 ? (
                <div className="space-y-4">
                {club.joinRequests.map(request => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <Avatar name={request.name} src={request.avatarUrl} size={48} />
                            <p className="font-semibold">{request.name}</p>
                        </div>
                        <div className="flex space-x-3">
                            <button onClick={() => handleRequest(request.id, 'approve')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">批准</button>
                            <button onClick={() => handleRequest(request.id, 'deny')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">拒绝</button>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">当前没有待处理的入团申请。</p>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">修改社团信息</h2>
              <div className="space-y-4">
                 <div>
                    <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">社团名称</label>
                    <input type="text" id="clubName" value={clubName} onChange={e => setClubName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="clubDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">社团简介</label>
                    <textarea id="clubDescription" value={clubDescription} onChange={e => setClubDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>
                <div className="text-right">
                    <button onClick={handleInfoSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">保存更改</button>
                </div>
              </div>
            </div>
            <div className="border-t border-red-500/30 pt-8">
                <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">危险区域</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">解散社团是一个不可逆的操作。所有社团数据将被永久删除。</p>
                <button onClick={handleDisband} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">解散社团</button>
            </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default ManageClubPage;
