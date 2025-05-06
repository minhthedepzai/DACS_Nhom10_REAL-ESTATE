// AppOwner.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './AppAdmin.css';
import './styles/onwer/onwerStyles.css';

import MainLayout from './layouts/onwer/MainLayout';
import AuthLayout from './layouts/onwer/AuthLayout';
import PropertyForm from './components/onwer/PropertyForm';
import Dashboard from './pages/onwer/Dashboard';
import Login from './pages/onwer/Login';
import ForgotPassword from './pages/onwer/ForgotPassword';
import Error404 from './pages/onwer/Error404';
import PostStatsDashboard from './pages/onwer/PostStatsDashboard';
import AppointmentCalendar from './pages/onwer/AppointmentCalendar';
import CustomerInteractions from './pages/onwer/CustomerInteractions';
import OwnerProfileEdit from './pages/onwer/OwnerProfileEdit';
import FeedbackManagement from './pages/onwer/FeedbackManagement';
import PostStatusFilter from './pages/onwer/PostStatusFilter';
import TransactionManagement from './pages/onwer/TransactionManagement';

function AppOwner() {
  return (
    <Routes>
      <Route path="onwer/dang-nhap" element={<AuthLayout><Login /></AuthLayout>} />
      <Route path="onwer/quen-mat-khau" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
      <Route path="onwer/loi-404" element={<AuthLayout><Error404 /></AuthLayout>} />
      <Route path="onwer/dang-tin" element={<MainLayout><PropertyForm /></MainLayout>} />
      <Route path="onwer/" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="onwer/thong-ke-views" element={<MainLayout><PostStatsDashboard /></MainLayout>} />
      <Route path="onwer/appoinment" element={<MainLayout><AppointmentCalendar /></MainLayout>} />
      <Route path="onwer/trao-doi" element={<MainLayout><CustomerInteractions /></MainLayout>} />
      <Route path="onwer/quan-ly-giao-dich" element={<MainLayout><TransactionManagement /></MainLayout>} />
      <Route path="onwer/change-admin" element={<MainLayout><OwnerProfileEdit /></MainLayout>} />
      <Route path="onwer/manage-feedback" element={<MainLayout><FeedbackManagement /></MainLayout>} />
      <Route path="onwer/quan-ly-bai-dang" element={<MainLayout><PostStatusFilter /></MainLayout>} />
    </Routes>
  );
}

export default AppOwner;
