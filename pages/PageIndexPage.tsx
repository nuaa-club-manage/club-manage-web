import React from 'react';
import { Link } from 'react-router-dom';

const PageIndexPage: React.FC = () => {
  const linkClass = "text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors";

  const sections = [
    {
      title: "主要页面",
      links: [
        { path: "/", name: "主页" },
        { path: "/clubs", name: "社团列表" },
        { path: "/activities", name: "活动列表" },
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">网站页面索引</h1>
        <div className="space-y-10">
          {sections.map(section => (
            <div key={section.title} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6 border-b pb-3 dark:border-gray-700">{section.title}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                {section.links.map(link => (
                  <li key={link.path}>
                    <Link to={link.path} className={linkClass}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageIndexPage;