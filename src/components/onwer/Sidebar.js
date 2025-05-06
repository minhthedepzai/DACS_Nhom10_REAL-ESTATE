import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ toggled, currentPath }) => {
  const isAdmin = currentPath.startsWith('/admin');
  const prefix = isAdmin ? '/admin' : '/onwer';

  return (
    <div id="layoutSidenav_nav">
      <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
        <div className="sb-sidenav-menu">
          <div className="nav">
            <div className="sb-sidenav-menu-heading">Tổng quan</div>
            <Link className={`nav-link ${currentPath === `${prefix}/` ? 'active' : ''}`} to={`${prefix}/`}>
              <div className="sb-nav-link-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              Dashboard {isAdmin ? 'Hệ thống' : ''}
            </Link>

            <Link className={`nav-link ${currentPath === `${prefix}/thong-ke-views` ? 'active' : ''}`} to={`${prefix}/thong-ke-views`}>
              <div className="sb-nav-link-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              Thống kê lượt xem/tương tác
            </Link>

            {isAdmin && (
              <>
                <div className="sb-sidenav-menu-heading">Quản lý người dùng</div>
                <Link className={`nav-link ${currentPath === `${prefix}/quan-ly-nguoi-dung` ? 'active' : ''}`} to={`${prefix}/quan-ly-nguoi-dung`}>
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  Quản lý người dùng
                </Link>
                <Link className={`nav-link ${currentPath === `${prefix}/tai-khoan-vi-pham` ? 'active' : ''}`} to={`${prefix}/tai-khoan-vi-pham`}>
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  Tài khoản vi phạm
                </Link>
              </>
            )}

            <div className="sb-sidenav-menu-heading">Quản lý</div>
            {/* Lịch hẹn xem nhà */}
            <Link
              className={`nav-link ${currentPath === `${prefix}/appoinment` ? 'active' : ''}`}
              to={`${prefix}/appoinment`}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              Lịch hẹn xem nhà
            </Link>

            {/* Trao đổi với khách */}
            <Link
              className={`nav-link ${currentPath === `${prefix}/trao-doi` ? 'active' : ''}`}
              to={`${prefix}/trao-doi`}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-comments"></i>
              </div>
              Trao đổi với khách
            </Link>

            {/* Quản lý giao dịch */}
            <Link
              className={`nav-link ${currentPath === `${prefix}/quan-ly-giao-dich` ? 'active' : ''}`}
              to={`${prefix}/quan-ly-giao-dich`}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-money-check-alt"></i>
              </div>
              Quản lý giao dịch
            </Link>

            {/* Quản lý phản hồi / đánh giá */}
            <Link
              className={`nav-link ${currentPath === `${prefix}/manage-feedback` ? 'active' : ''}`}
              to={`${prefix}/manage-feedback`}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-comment-dots"></i>
              </div>
              Quản lý phản hồi/đánh giá
            </Link>

            {/* Đăng tin mới */}
            <Link
              className={`nav-link ${currentPath === `${prefix}/dang-tin` ? 'active' : ''}`}
              to={`${prefix}/dang-tin`}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              Đăng tin mới
            </Link>

            {/* Quản lý bài đăng */}
            <Link
              className={`nav-link ${currentPath === `${prefix}/quan-ly-bai-dang` ? 'active' : ''}`}
              to={`${prefix}/quan-ly-bai-dang`}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-tasks"></i>
              </div>
              Quản lý bài đăng
            </Link>

            {isAdmin && (
              <>
                <Link className={`nav-link ${currentPath === `${prefix}/phe-duyet-bai-dang` ? 'active' : ''}`} to={`${prefix}/phe-duyet-bai-dang`}>
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-clipboard-check"></i>
                  </div>
                  Phê duyệt bài đăng
                </Link>
                <Link className={`nav-link ${currentPath === `${prefix}/quan-ly-binh-luan` ? 'active' : ''}`} to={`${prefix}/quan-ly-binh-luan`}>
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-comments"></i>
                  </div>
                  Quản lý bình luận
                </Link>

                <div className="sb-sidenav-menu-heading">Quản lý bất động sản</div>
                <Link className={`nav-link ${currentPath === `${prefix}/hoat-dong-bds` ? 'active' : ''}`} to={`${prefix}/hoat-dong-bds`}>
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-home"></i>
                  </div>
                  Hoạt động BĐS
                </Link>
                <Link className={`nav-link ${currentPath === `${prefix}/thong-ke-bds` ? 'active' : ''}`} to={`${prefix}/thong-ke-bds`}>
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-chart-area"></i>
                  </div>
                  Thống kê BĐS
                </Link>
                <Link className={`nav-link ${currentPath === `${prefix}/quan-ly-dia-diem` ? 'active' : ''}`} to={`${prefix}/quan-ly-dia-diem`}>
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  Quản lý địa điểm
                </Link>
                <Link className={`nav-link ${currentPath === `${prefix}/xac-minh-tin-premium` ? 'active' : ''}`} to={`${prefix}/xac-minh-tin-premium`}>
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-crown"></i>
                  </div>
                  Xác minh tin Premium
                </Link>

                <div className="sb-sidenav-menu-heading">Báo cáo & Thống kê</div>
                <Link className={`nav-link ${currentPath === `${prefix}/bieu-do` ? 'active' : ''}`} to={`${prefix}/bieu-do`}>
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-chart-pie"></i>
                  </div>
                  Biểu đồ
                </Link>
                <Link className={`nav-link ${currentPath === `${prefix}/bang` ? 'active' : ''}`} to={`${prefix}/bang`}>
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-table"></i>
                  </div>
                  Bảng báo cáo
                </Link>

                <div className="sb-sidenav-menu-heading">Cài đặt hệ thống</div>
                <Link className={`nav-link ${currentPath === `${prefix}/giao-dien-tinh` ? 'active' : ''}`} to={`${prefix}/giao-dien-tinh`}>
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-cogs"></i>
                  </div>
                  Cấu hình hệ thống
                </Link>
                <Link className={`nav-link ${currentPath === `${prefix}/giao-dien-thanh-ben` ? 'active' : ''}`} to={`${prefix}/giao-dien-thanh-ben`}>
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  Quản lý quyền
                </Link>
              </>
            )}

            <div className="sb-sidenav-menu-heading">Tài khoản</div>
            {/* Chỉnh sửa thông tin cá nhân */}
            <Link
              className={`nav-link ${currentPath === `${prefix}/change-admin` ? 'active' : ''}`}
              to={`${prefix}/change-admin`}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-user-cog"></i>
              </div>
              Chỉnh sửa thông tin cá nhân
            </Link>
            
            <Link className={`nav-link`} to="/login">
              <div className="sb-nav-link-icon">
                <i className="fas fa-sign-out-alt"></i>
              </div>
              Đăng xuất
            </Link>
          </div>
        </div>
        <div className="sb-sidenav-footer">
          <div className="small">Đăng nhập với tư cách:</div>
          {isAdmin ? 'Quản trị viên hệ thống' : 'Chủ sở hữu'}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 