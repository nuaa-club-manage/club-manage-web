import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NuaaLogoIcon, LockClosedIcon, UsersIcon } from '../components/icons';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [smsCountdown, setSmsCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, []);

  const handleSendSms = async () => {
    if (smsCountdown > 0) return;
    const contact = (document.getElementById('contact') as HTMLInputElement).value;
    if (!contact) {
      alert('请先填写手机号 / 邮箱');
      return;
    }
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/sendCode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact }),
    });
    const data = await res.json();
    if (data.code !== 200) {
      alert(data.message);
      return;
    }
    setSmsCountdown(60);
    countdownRef.current = setInterval(() => {
      setSmsCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const userId = (form.elements.namedItem('userId') as HTMLInputElement).value;
    const contact = (form.elements.namedItem('contact') as HTMLInputElement).value;
    const userPassword = (form.elements.namedItem('userPassword') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
    const verifyCode = (form.elements.namedItem('verifyCode') as HTMLInputElement).value;

    if (userPassword !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, contact, userPassword, verifyCode }),
    });
    const data = await res.json();
    if (data.code === 200) {
      alert(data.data);
      navigate('/login');
    } else {
      alert(data.message);
    }
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

          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="userId" className="sr-only">学号</label>
              <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="userId" name="userId" type="text" autoComplete="username" required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="学号"
              />
            </div>
            <div className="relative">
              <label htmlFor="contact" className="sr-only">手机号 / 邮箱</label>
              <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="contact" name="contact" type="text" autoComplete="email" required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="手机号 / 邮箱"
              />
            </div>
            <div className="relative">
              <label htmlFor="userPassword" className="sr-only">密码</label>
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="userPassword" name="userPassword" type="password" autoComplete="new-password" required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="密码"
              />
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">确认密码</label>
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="确认密码"
              />
            </div>
            <div className="relative flex items-stretch">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10"/>
              <input
                id="verifyCode" name="verifyCode" type="text" autoComplete="one-time-code" required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-bl-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="短信验证码"
              />
              <button
                type="button"
                onClick={handleSendSms}
                disabled={smsCountdown > 0}
                className={`flex-shrink-0 px-3 py-3 border border-l-0 border-gray-300 rounded-br-md text-xs font-medium whitespace-nowrap transition-colors dark:border-gray-600 ${smsCountdown > 0 ? 'bg-gray-800 text-white cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50 dark:bg-gray-700 dark:text-indigo-400 dark:hover:bg-gray-600'}`}
              >
                {smsCountdown > 0 ? `${smsCountdown}秒后重试` : '获取短信验证码'}
              </button>
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