import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NuaaLogoIcon, UsersIcon } from '../components/icons';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password reset logic
    alert('如果该邮箱或手机号存在于我们的系统中，您将会收到一封密码重置邮件或短信。');
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-full px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <NuaaLogoIcon className="mx-auto h-20 w-auto text-gray-700 dark:text-gray-300" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            找回您的密码
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            请输入您的邮箱地址或手机号，我们将向您发送重置密码的说明。
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="credential-forgot" className="sr-only">邮箱 / 手机号</label>
               <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="credential-forgot"
                name="credential"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-md relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="邮箱 / 手机号"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              发送重置链接
            </button>
          </div>
          
          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              返回登录
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;