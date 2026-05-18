import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NuaaLogoIcon, DashboardIcon, UsersIcon, ClubIcon, CalendarIcon } from '../icons';

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const activeLinkClass = 'bg-indigo-700 text-white';
  const inactiveLinkClass = 'text-gray-300 hover:bg-gray-700 hover:text-white';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', text: '仪表盘', icon: DashboardIcon },
    { to: '/admin/users', text: '用户管理', icon: UsersIcon },
    { to: '/admin/club-list', text: '社团列表', icon: ClubIcon },
    { to: '/admin/club-members', text: '所有社团成员', icon: UsersIcon },
    { to: '/admin/activity-list', text: '活动列表', icon: CalendarIcon },
    { to: '/admin/clubs', text: '社团审核', icon: ClubIcon },
    { to: '/admin/activities', text: '活动审核', icon: CalendarIcon },
  ];

  return (
    <aside className="w-64 h-full bg-gray-800 text-white flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-gray-700 px-4">
        <NavLink to="/" className="flex items-center space-x-2 text-lg font-bold">
          <NuaaLogoIcon className="w-10 h-10" />
          <span>管理后台</span>
        </NavLink>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `${isActive ? activeLinkClass : inactiveLinkClass} flex items-center px-4 py-3 rounded-lg transition-colors duration-200`
                }
              >
                <link.icon className="w-6 h-6 mr-3" />
                <span className="font-medium">{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button onClick={handleLogout} className="w-full text-sm text-center block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">
          退出登录
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;