import React from 'react';
import { Link } from 'react-router-dom';
import { NuaaLogoIcon } from './icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <NuaaLogoIcon className="w-8 h-8 text-gray-500" />
          <span className="text-lg font-semibold">高校社团管理系统</span>
        </div>
        <p>
          &copy; {new Date().getFullYear()} 南京航空航天大学 计算机科学与技术学院/软件学院. 版权所有.
        </p>
        <p className="mt-2">
          项目小组: 101C 徐正 章志鹏 朴威霖 刘翘宁
        </p>
         <div className="mt-4">
          <Link to="/index" className="hover:underline text-indigo-600 dark:text-indigo-400">页面索引</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;