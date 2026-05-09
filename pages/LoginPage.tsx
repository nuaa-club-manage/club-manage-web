import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NuaaLogoIcon, UsersIcon, LockClosedIcon } from '../components/icons';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAdministrator, setIsAdministrator] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const credential = (form.elements.namedItem('credential') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, password }),
    });
    const data = await res.json();
    console.log(data);
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-full px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <NuaaLogoIcon className="mx-auto h-20 w-auto text-gray-700 dark:text-gray-300" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            登录您的账户
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
              <label htmlFor="credential" className="sr-only">邮箱 / 手机号</label>
              <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="credential"
                name="credential"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="邮箱 / 手机号"
              />
            </div>
            <div className="relative">
              <label htmlFor="password-sr" className="sr-only">密码</label>
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="password-sr"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="密码"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              忘记密码?
            </Link>
             <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              注册新账号
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              登录
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;