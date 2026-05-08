import React from 'react';
import { Link } from 'react-router-dom';
import { mockPendingClubs, mockPendingActivities, mockUsers } from '../../data/mockData';
import { ClubIcon, CalendarIcon, UsersIcon, ArrowRightIcon } from '../../components/icons';

const AdminDashboardPage: React.FC = () => {
  const stats = [
    { title: '待审核社团', count: mockPendingClubs.length, link: '/admin/clubs', icon: ClubIcon, color: 'bg-blue-500' },
    { title: '待审核活动', count: mockPendingActivities.length, link: '/admin/activities', icon: CalendarIcon, color: 'bg-green-500' },
    { title: '总用户数', count: mockUsers.length, link: '/admin/users', icon: UsersIcon, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">管理仪表盘</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map(stat => (
          <div key={stat.title} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-5xl font-bold text-gray-900 dark:text-white mt-2">{stat.count}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-7 h-7 text-white" />
              </div>
            </div>
            <Link to={stat.link} className="inline-flex items-center mt-6 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
              前往管理
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;