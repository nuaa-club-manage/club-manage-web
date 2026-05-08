import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NuaaLogoIcon, MailIcon, LockClosedIcon, UsersIcon } from '../components/icons';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAdministrator, setIsAdministrator] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration logic
    alert(`作为 ${isAdministrator ? '管理员' : '普通用户'} 注册成功！`);
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        <div>
          <NuaaLogoIcon className="mx-auto h-20 w-auto text-gray-700 dark:text-gray-300" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            创建您的新账户
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Role Switcher */}
          <div className="flex justify-center bg-gray-200 dark:bg-gray-700 rounded-full p-1">
            <button
              type="button"
              onClick={() => setIsAdministrator(false)}
              className={`w-1/2 py-2 px-4 rounded-full text-sm font-semibold transition-colors ${!isAdministrator ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}
            >
              普通用户
            </button>
            <button
              type="button"
              onClick={() => setIsAdministrator(true)}
              className={`w-1/2 py-2 px-4 rounded-full text-sm font-semibold transition-colors ${isAdministrator ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}
            >
              管理员
            </button>
          </div>

          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="name" className="sr-only">姓名</label>
              <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="name" name="name" type="text" autoComplete="name" required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="姓名"
              />
            </div>
            <div className="relative">
              <label htmlFor="credential-register" className="sr-only">邮箱 / 手机号</label>
              <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="credential-register" name="credential" type="text" autoComplete="username" required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="邮箱 / 手机号"
              />
            </div>
            <div className="relative">
              <label htmlFor="password-register" className="sr-only">密码</label>
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="password-register" name="password" type="password" autoComplete="new-password" required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="密码"
              />
            </div>
             <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">确认密码</label>
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="确认密码"
              />
            </div>
          </div>
          
           <div className="flex items-center justify-end text-sm">
             <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              已有账号? 前往登录
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              注册
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;