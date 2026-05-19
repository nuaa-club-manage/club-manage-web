import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ClubListPage from './pages/ClubListPage';
import ActivityListPage from './pages/ActivityListPage';
import ProfilePage from './pages/ProfilePage';
import ClubDetailPage from './pages/ClubDetailPage';
import ManageClubPage from './pages/ManageClubPage';
import EditProfilePage from './pages/EditProfilePage';
import CreateClubPage from './pages/CreateClubPage';
import PublishActivityPage from './pages/PublishActivityPage';
import ActivityDetailPage from './pages/ActivityDetailPage';
import ActivityParticipantsPage from './pages/ActivityParticipantsPage';
import ClubAdminPage from './pages/ClubAdminPage';
import ClubMembersPage from './pages/ClubMembersPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DeleteAccountPage from './pages/DeleteAccountPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import AdminEditUserPage from './pages/admin/AdminEditUserPage';
import AdminClubApprovalPage from './pages/admin/AdminClubApprovalPage';
import AdminActivityApprovalPage from './pages/admin/AdminActivityApprovalPage';
import AdminClubListPage from './pages/admin/AdminClubListPage';
import AdminActivityListPage from './pages/admin/AdminActivityListPage';
import PageIndexPage from './pages/PageIndexPage';

const App: React.FC = () => {
  const location = useLocation();
  const authPages = ['/login', '/register', '/forgot-password'];
  const isAuthPage = authPages.includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');

  const AppRoutes = (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/clubs" element={<ClubListPage />} />
      <Route path="/clubs/create" element={<CreateClubPage />} />
      <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
      <Route path="/clubs/:clubId/manage" element={<ManageClubPage />} />
      <Route path="/activities" element={<ActivityListPage />} />
      <Route path="/activities/publish" element={<PublishActivityPage />} />
      <Route path="/activities/:activityId" element={<ActivityDetailPage />} />
      <Route path="/activities/:activityId/participants" element={<ActivityParticipantsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<EditProfilePage />} />
      <Route path="/profile/change-password" element={<ChangePasswordPage />} />
      <Route path="/profile/delete-account" element={<DeleteAccountPage />} />
      <Route path="/club-admin" element={<ClubAdminPage />} />
      <Route path="/club-admin/:clubId/members" element={<ClubMembersPage />} />
      <Route path="/index" element={<PageIndexPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/users" element={<AdminUserManagementPage />} />
      <Route path="/admin/users/edit" element={<AdminEditUserPage />} />
      <Route path="/admin/clubs" element={<AdminClubApprovalPage />} />
      <Route path="/admin/club-list" element={<AdminClubListPage />} />
      <Route path="/admin/activity-list" element={<AdminActivityListPage />} />
      <Route path="/admin/activities" element={<AdminActivityApprovalPage />} />
    </Routes>
  );

  if (isAdminPage) {
    return <AdminLayout>{AppRoutes}</AdminLayout>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans flex flex-col">
      {!isAuthPage && <Header />}
      <main className={`flex-grow ${!isAuthPage ? 'pt-16' : ''}`}>
        {AppRoutes}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default App;