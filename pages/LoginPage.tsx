import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NuaaLogoIcon, UsersIcon, LockClosedIcon } from '../components/icons';

function drawCaptcha(canvas: HTMLCanvasElement, text: string) {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // background
  ctx.fillStyle = '#f0f4ff';
  ctx.fillRect(0, 0, w, h);

  // noise lines
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `hsl(${Math.random() * 360},50%,70%)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * w, Math.random() * h);
    ctx.lineTo(Math.random() * w, Math.random() * h);
    ctx.stroke();
  }

  // characters
  const colors = ['#3730a3', '#1d4ed8', '#0369a1', '#7c3aed', '#be185d'];
  text.split('').forEach((ch, i) => {
    ctx.save();
    ctx.font = `bold ${22 + Math.random() * 6}px monospace`;
    ctx.fillStyle = colors[i % colors.length];
    const x = 10 + i * (w - 20) / text.length;
    const y = h / 2 + 8;
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.5);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });

  // noise dots
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `hsl(${Math.random() * 360},40%,60%)`;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAdministrator, setIsAdministrator] = useState(false);
  const [useSmsLogin, setUseSmsLogin] = useState(false);
  const [captchaText, setCaptchaText] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [smsCountdown, setSmsCountdown] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCaptcha = useCallback(async () => {
    const res = await fetch('https://m1.apifoxmock.com/m1/8227292-7987577-default/api/user/captcha');
    const json = await res.json();
    setCaptchaId(json.data.captchaId);
    setCaptchaText(json.data.captchaText);
  }, []);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  useEffect(() => {
    if (!isAdministrator && canvasRef.current && captchaText) drawCaptcha(canvasRef.current, captchaText);
  }, [captchaText, isAdministrator]);

  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, []);

  const refreshCaptcha = useCallback(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  const handleSendSms = useCallback(async () => {
    if (smsCountdown > 0) return;
    const credential = (document.getElementById('credential') as HTMLInputElement).value;
    if (!credential) {
      alert('请先填写手机号');
      return;
    }
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/sendCode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact: credential }),
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
  }, [smsCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const credential = (form.elements.namedItem('credential') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    let url: string;
    let body: Record<string, unknown>;

    if (isAdministrator) {
      url = `${import.meta.env.VITE_API_BASE_URL}/api/admin/login`;
      body = { userId: credential, userPassword: password };
    } else {
      const captchaCode = (form.elements.namedItem('captcha') as HTMLInputElement).value;
      url = `${import.meta.env.VITE_API_BASE_URL}/api/user/login`;
      body = { captchaId, captchaCode, loginType: useSmsLogin ? 1 : 0 };
      if (useSmsLogin) {
        body.contact = credential;
        body.verifyCode = password;
      } else {
        body.userId = credential;
        body.userPassword = password;
      }
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    console.log(data);
    if (data.code === 200) {
      localStorage.setItem('token', data.data);
      navigate('/');
    } else {
      alert(data.message);
      if (!isAdministrator) refreshCaptcha();
    }
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
            {/* 账号输入框（始终显示） */}
            <div className="relative">
              <label htmlFor="credential" className="sr-only">{useSmsLogin ? '手机号' : '学号'}</label>
              <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input
                id="credential"
                name="credential"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder={useSmsLogin ? '手机号' : '学号'}
              />
            </div>

            {/* 密码 或 短信验证码 */}
            {!isAdministrator && useSmsLogin ? (
              <div className="relative flex items-stretch">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10"/>
                <input
                  id="password-sr"
                  name="password"
                  type="text"
                  autoComplete="one-time-code"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="短信验证码"
                />
                <button
                  type="button"
                  onClick={handleSendSms}
                  disabled={smsCountdown > 0}
                  className={`flex-shrink-0 px-3 py-3 border border-l-0 border-gray-300 text-xs font-medium whitespace-nowrap transition-colors dark:border-gray-600 ${smsCountdown > 0 ? 'bg-gray-800 text-white cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50 dark:bg-gray-700 dark:text-indigo-400 dark:hover:bg-gray-600'}`}
                >
                  {smsCountdown > 0 ? `${smsCountdown}秒后重试` : '获取短信验证码'}
                </button>
              </div>
            ) : (
              <div className="relative">
                <label htmlFor="password-sr" className="sr-only">密码</label>
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input
                  id="password-sr"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${isAdministrator ? 'rounded-b-md' : ''}`}
                  placeholder="密码"
                />
              </div>
            )}

            {/* 图形验证码（普通用户始终显示） */}
            {!isAdministrator && (
              <div className="relative flex items-stretch">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10"/>
                <input
                  id="captcha-input"
                  name="captcha"
                  type="text"
                  maxLength={4}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-bl-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="图形验证码"
                />
                <canvas
                  ref={canvasRef}
                  width={110}
                  height={46}
                  onClick={refreshCaptcha}
                  title="点击刷新验证码"
                  className="border border-l-0 border-gray-300 rounded-br-md cursor-pointer flex-shrink-0 dark:border-gray-600"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              忘记密码?
            </Link>
            {!isAdministrator && (
              <button
                type="button"
                onClick={() => setUseSmsLogin(v => !v)}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {useSmsLogin ? '账号密码登录' : '短信验证码登录'}
              </button>
            )}
            {!isAdministrator && (
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                注册新账号
              </Link>
            )}
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