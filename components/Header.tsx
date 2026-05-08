import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { NuaaLogoIcon, UserCircleIcon, MenuIcon } from './icons';
import MobileNavMenu from './MobileNavMenu';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-50 dark:bg-gray-800 text-indigo-700 dark:text-white'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 mr-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                aria-label="打开导航菜单"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
              <Link to="/" className="flex items-center space-x-2 text-lg font-bold text-gray-800 dark:text-gray-200">
                <NuaaLogoIcon className="w-10 h-10 text-gray-700 dark:text-gray-300"/>
                <div className="hidden sm:flex flex-col">
                    <span className="text-xs font-medium">南航</span>
                    <span className="text-sm font-semibold">社团管理</span>
                </div>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-4">
              <NavLink to="/" className={navLinkClass}>主页</NavLink>
              <NavLink to="/clubs" className={navLinkClass}>社团列表</NavLink>
              <NavLink to="/activities" className={navLinkClass}>活动列表</NavLink>
            </nav>

            <div className="flex items-center space-x-4">
              <NavLink to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                  <UserCircleIcon className="w-8 h-8"/>
              </NavLink>
              <Link to="/login" className="hidden sm:block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">
                登录
              </Link>
            </div>
          </div>
        </div>
      </header>
      <MobileNavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
