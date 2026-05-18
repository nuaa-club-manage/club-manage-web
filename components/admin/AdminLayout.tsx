import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { MenuIcon, NuaaLogoIcon } from '../icons';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-gray-800 text-white flex items-center justify-between p-4 shadow-lg">
          <NavLink to="/admin" className="flex items-center space-x-2 text-lg font-bold">
            <NuaaLogoIcon className="w-8 h-8" />
            <span>管理后台</span>
          </NavLink>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 px-3 rounded-md transition-colors">
              登录
            </Link>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;