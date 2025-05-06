import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChartBar, FaUser, FaUserTie, FaClipboardList, FaSignOutAlt, FaCog, FaPlusCircle } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="border-end bg-white" id="sidebar-wrapper">
      <div className="sidebar-heading border-bottom bg-light">
        <Link to="/" className="text-decoration-none text-dark">
          MAKAAN
        </Link>
      </div>
      <div className="list-group list-group-flush">
        <div className="sidebar-section">
          <h6 className="sidebar-heading px-3 mt-4 mb-1 text-muted">TỔNG QUAN</h6>
          <Link
            to="/admin"
            className={`list-group-item list-group-item-action list-group-item-light p-3 ${
              location.pathname === '/admin' ? 'active' : ''
            }`}
          >
            <FaHome className="me-2" /> Dashboard
          </Link>
          <Link
            to="/admin/thong-ke"
            className={`list-group-item list-group-item-action list-group-item-light p-3 ${
              location.pathname === '/admin/thong-ke' ? 'active' : ''
            }`}
          >
            <FaChartBar className="me-2" /> Thống kê hệ thống
          </Link>
        </div>

        <div className="sidebar-section">
          <h6 className="sidebar-heading px-3 mt-4 mb-1 text-muted">QUẢN LÝ</h6>
          <Link
            to="/admin/nguoi-dung"
            className={`list-group-item list-group-item-action list-group-item-light p-3 ${
              location.pathname === '/admin/nguoi-dung' ? 'active' : ''
            }`}
          >
            <FaUser className="me-2" /> Quản lý người dùng
          </Link>
          <Link
            to="/admin/nha-moi-gioi"
            className={`list-group-item list-group-item-action list-group-item-light p-3 ${
              location.pathname === '/admin/nha-moi-gioi' ? 'active' : ''
            }`}
          >
            <FaUserTie className="me-2" /> Quản lý nhà môi giới
          </Link>
          <Link
            to="/admin/bat-dong-san"
            className={`list-group-item list-group-item-action list-group-item-light p-3 ${
              location.pathname === '/admin/bat-dong-san' ? 'active' : ''
            }`}
          >
            <FaHome className="me-2" /> Quản lý bất động sản
          </Link>
          <Link
            to="/admin/dang-tin"
            className={`list-group-item list-group-item-action list-group-item-light p-3 ${
              location.pathname === '/admin/dang-tin' ? 'active' : ''
            }`}
          >
            <FaPlusCircle className="me-2" /> Đăng tin mới
          </Link>
          <Link
            to="/admin/bao-cao"
            className={`list-group-item list-group-item-action list-group-item-light p-3 ${
              location.pathname === '/admin/bao-cao' ? 'active' : ''
            }`}
          >
            <FaClipboardList className="me-2" /> Quản lý báo cáo
          </Link>
        </div>

        <div className="sidebar-section">
          <h6 className="sidebar-heading px-3 mt-4 mb-1 text-muted">HỆ THỐNG</h6>
          <Link
            to="/admin/cau-hinh"
            className={`list-group-item list-group-item-action list-group-item-light p-3 ${
              location.pathname === '/admin/cau-hinh' ? 'active' : ''
            }`}
          >
            <FaCog className="me-2" /> Cấu hình hệ thống
          </Link>
          <Link
            to="/logout"
            className="list-group-item list-group-item-action list-group-item-light p-3"
          >
            <FaSignOutAlt className="me-2" /> Đăng xuất
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 