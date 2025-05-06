// AppAdmin.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './AppAdmin.css';
import './styles/onwer/onwerStyles.css';

import MainLayout from './layouts/onwer/MainLayout';
import AuthLayout from './layouts/onwer/AuthLayout';

import Dashboard from './pages/onwer/Dashboard';
import Login from './pages/onwer/Login';
import Register from './pages/onwer/Register';
import ForgotPassword from './pages/onwer/ForgotPassword';
import Error401 from './pages/onwer/Error401';
import Error404 from './pages/onwer/Error404';
import Error500 from './pages/onwer/Error500';
import UserManagementPlaceholder from './pages/onwer/UserManagementPlaceholder';
import ViolationAccountsPlaceholder from './pages/onwer/ViolationAccountsPlaceholder';
import PostApproval from './pages/onwer/PostApproval';
import CommentManagement from './pages/onwer/CommentManagement';
import PostStatusFilter from './pages/onwer/PostStatusFilter';
import FeedbackManagement from './pages/onwer/FeedbackManagement';
import RealEstateActivity from './pages/onwer/RealEstateActivity';
import RealEstateStatistics from './pages/onwer/RealEstateStatistics';
import LocationManagement from './pages/onwer/LocationManagement';
import PremiumVerification from './pages/onwer/PremiumVerification';
import AppointmentCalendar from './pages/onwer/AppointmentCalendar';
import CustomerInteractions from './pages/onwer/CustomerInteractions';
import TransactionManagement from './pages/onwer/TransactionManagement';
import Charts from './pages/onwer/Charts';
import SystemDashboard from './pages/onwer/SystemDashboard';
import PostStatsDashboard from './pages/onwer/PostStatsDashboard';
import StaticNavigation from './pages/onwer/StaticNavigation';
import LightSidenav from './pages/onwer/LightSidenav';
import OwnerProfileEdit from './pages/onwer/OwnerProfileEdit';
import Tables from './pages/onwer/Tables';

function AppAdmin() {
  return (
    <Routes>
      <Route path="dang-nhap" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="dang-ky" element={<AuthLayout><Register /></AuthLayout>} />
      <Route path="quen-mat-khau" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
      <Route path="loi-401" element={<AuthLayout><Error401 /></AuthLayout>} />
      <Route path="loi-404" element={<AuthLayout><Error404 /></AuthLayout>} />
      <Route path="loi-500" element={<AuthLayout><Error500 /></AuthLayout>} />

      <Route path="/" element={<MainLayout><SystemDashboard /></MainLayout>} />
      <Route path="quan-ly-nguoi-dung" element={<MainLayout><UserManagementPlaceholder /></MainLayout>} />
      <Route path="tai-khoan-vi-pham" element={<MainLayout><ViolationAccountsPlaceholder /></MainLayout>} />
      <Route path="phe-duyet-bai-dang" element={<MainLayout><PostApproval /></MainLayout>} />
      <Route path="quan-ly-binh-luan" element={<MainLayout><CommentManagement /></MainLayout>} />
      <Route path="quan-ly-bai-dang" element={<MainLayout><PostStatusFilter /></MainLayout>} />
      <Route path="manage-feedback" element={<MainLayout><FeedbackManagement /></MainLayout>} />
      <Route path="hoat-dong-bds" element={<MainLayout><RealEstateActivity /></MainLayout>} />
      <Route path="thong-ke-bds" element={<MainLayout><RealEstateStatistics /></MainLayout>} />
      <Route path="quan-ly-dia-diem" element={<MainLayout><LocationManagement /></MainLayout>} />
      <Route path="xac-minh-tin-premium" element={<MainLayout><PremiumVerification /></MainLayout>} />
      <Route path="appoinment" element={<MainLayout><AppointmentCalendar /></MainLayout>} />
      <Route path="trao-doi" element={<MainLayout><CustomerInteractions /></MainLayout>} />
      <Route path="quan-ly-giao-dich" element={<MainLayout><TransactionManagement /></MainLayout>} />
      <Route path="bieu-do" element={<MainLayout><Charts /></MainLayout>} />
      <Route path="bang-bao-cao" element={<MainLayout><Tables /></MainLayout>} />
      <Route path="thong-ke-views" element={<MainLayout><PostStatsDashboard /></MainLayout>} />
      <Route path="cau-hinh-he-thong" element={<MainLayout><StaticNavigation /></MainLayout>} />
      <Route path="quan-ly-quyen" element={<MainLayout><LightSidenav /></MainLayout>} />
      <Route path="nhat-ky-he-thong" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="change-admin" element={<MainLayout><OwnerProfileEdit /></MainLayout>} />
    </Routes>
  );
}

export default AppAdmin;
