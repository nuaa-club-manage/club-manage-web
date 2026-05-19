import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NuaaLogoIcon, UsersIcon, LockClosedIcon, EyeIcon, EyeOffIcon } from '../components/icons';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [smsCountdown, setSmsCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, []);

  const handleSendSms = async () => {
    if (smsCountdown > 0) return;
    const contact = (document.getElementById('contact-forgot') as HTMLInputElement).value;
    if (!contact) {
      alert('请先填写手机号 / 邮箱');
      return;
    }
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/sendCode?contact=${encodeURIComponent(contact)}`, {
      method: 'POST',
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

  const validatePassword = (pwd: string) => {
    if (pwd.length < 6 || pwd.length > 20) return '密码长度需为6-20位';
    if (!/[a-zA-Z]/.test(pwd)) return '密码需同时包含字母和数字';
    if (!/[0-9]/.test(pwd)) return '密码需同时包含字母和数字';
    return null;
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const contact = (form.elements.namedItem('contact') as HTMLInputElement).value;
    const verifyCode = (form.elements.namedItem('verifyCode') as HTMLInputElement).value;
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    const pwdError = validatePassword(newPassword);
    if (pwdError) {
      alert(pwdError);
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/resetPassword`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, verifyCode, newPassword }),
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
    <div className="flex items-center justify-center min-h-full px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <NuaaLogoIcon className="mx-auto h-20 w-auto text-gray-700 dark:text-gray-300" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            找回您的密码
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            请填写手机号 / 邮箱，获取验证码后重置密码。
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">

            {/* 手机号 / 邮箱 */}
            <div className="relative">
              <label htmlFor="contact-forgot" className="sr-only">手机号 / 邮箱</label>
              <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="contact-forgot"
                name="contact"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="手机号 / 邮箱"
              />
            </div>

            {/* 验证码 */}
            <div className="relative flex items-stretch">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10"/>
              <input
                id="verifyCode-forgot"
                name="verifyCode"
                type="text"
                autoComplete="one-time-code"
                required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="验证码"
              />
              <button
                type="button"
                onClick={handleSendSms}
                disabled={smsCountdown > 0}
                className={`flex-shrink-0 px-3 py-3 border border-l-0 border-gray-300 text-xs font-medium whitespace-nowrap transition-colors dark:border-gray-600 ${smsCountdown > 0 ? 'bg-gray-800 text-white cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50 dark:bg-gray-700 dark:text-indigo-400 dark:hover:bg-gray-600'}`}
              >
                {smsCountdown > 0 ? `${smsCountdown}秒后重试` : '获取验证码'}
              </button>
            </div>

            {/* 新密码 */}
            <div className="relative">
              <label htmlFor="newPassword-forgot" className="sr-only">新密码</label>
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="newPassword-forgot"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="新密码（6-20位，需包含字母和数字）"
              />
              <button type="button" onClick={() => setShowNewPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showNewPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            {/* 确认新密码 */}
            <div className="relative">
              <label htmlFor="confirmPassword-forgot" className="sr-only">确认新密码</label>
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="confirmPassword-forgot"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="确认新密码"
              />
              <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              重置密码
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
