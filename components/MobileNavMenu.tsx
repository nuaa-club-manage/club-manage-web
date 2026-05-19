import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { XIcon, NuaaLogoIcon } from './icons';

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavMenu: React.FC<MobileNavMenuProps> = ({ isOpen, onClose }) => {
  const sections = [
    {
      title: "主要页面",
      links: [
        { path: "/home", name: "主页" },
        { path: "/clubs", name: "社团列表" },
        { path: "/activities", name: "活动列表" },
        { path: "/club-admin", name: "社团管理" },
      ],
    },
    {
      title: "用户页面",
      links: [
        { path: "/profile", name: "个人中心" },
        { path: "/profile/edit", name: "编辑个人资料" },
        { path: "/clubs/create", name: "成立新社团" },
        { path: "/activities/publish", name: "发布新活动" },
      ],
    },
    {
      title: "认证流程",
      links: [
        { path: "/login", name: "登录" },
        { path: "/register", name: "注册" },
        { path: "/forgot-password", name: "忘记密码" },
      ],
    },
    {
      title: "管理后台",
      links: [
        { path: "/admin/dashboard", name: "仪表盘" },
        { path: "/admin/users", name: "用户管理" },
        { path: "/admin/clubs", name: "社团审核" },
        { path: "/admin/activities", name: "活动审核" },
      ],
    },
  ];

  const linkClass = "block py-3 px-4 rounded-md text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors";
  const activeLinkClass = "bg-indigo-50 dark:bg-gray-900 text-indigo-600 dark:text-indigo-300 font-semibold";

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Menu */}
      <div 
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/home" onClick={onClose} className="flex items-center space-x-2 text-lg font-bold text-gray-800 dark:text-gray-200">
             <NuaaLogoIcon className="w-8 h-8"/>
             <span>社团管理</span>
          </Link>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" aria-label="关闭菜单">
            <XIcon className="w-6 h-6"/>
          </button>
        </div>
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-65px)]">
          {sections.map(section => (
            <div key={section.title}>
              <h3 className="px-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{section.title}</h3>
              <ul className="mt-2 space-y-1">
                {section.links.map(link => (
                  <li key={link.path}>
                    <NavLink 
                      to={link.path} 
                      className={({isActive}) => `${linkClass} ${isActive ? activeLinkClass : ''}`} 
                      onClick={onClose}
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default MobileNavMenu;