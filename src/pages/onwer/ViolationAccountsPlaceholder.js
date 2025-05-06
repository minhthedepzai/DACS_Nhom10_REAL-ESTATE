import React from 'react';
import { Link } from 'react-router-dom';

const ViolationAccountsPlaceholder = () => {
  return (
    <div className="container-fluid px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mt-4 mb-0 text-gradient">Tài khoản vi phạm</h1>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/admin">Bảng điều khiển</Link>
            </li>
            <li className="breadcrumb-item active">Tài khoản vi phạm</li>
          </ol>
        </div>
        <div>
          <button className="btn btn-info me-2">
            <i className="fas fa-sync-alt me-1"></i> Làm mới
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-filter me-1"></i> Bộ lọc
          </button>
        </div>
      </div>

      {/* Thống kê */}
      <div className="row">
        <div className="col-xl-3 col-md-6">
          <div className="card bg-danger text-white mb-4 shadow-sm hover-scale glass-effect stats-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Tổng số vi phạm</h6>
                  <h2 className="mt-2 mb-0 counter">78</h2>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3 icon-wrapper">
                  <i className="fas fa-exclamation-triangle fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-warning text-white mb-4 shadow-sm hover-scale glass-effect stats-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Chờ xử lý</h6>
                  <h2 className="mt-2 mb-0 counter">23</h2>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3 icon-wrapper">
                  <i className="fas fa-clock fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-success text-white mb-4 shadow-sm hover-scale glass-effect stats-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Đã xử lý</h6>
                  <h2 className="mt-2 mb-0 counter">55</h2>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3 icon-wrapper">
                  <i className="fas fa-check-circle fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-dark text-white mb-4 shadow-sm hover-scale glass-effect stats-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Tài khoản khóa</h6>
                  <h2 className="mt-2 mb-0 counter">12</h2>
                </div>
                <div className="bg-white bg-opacity-25 rounded-circle p-3 icon-wrapper">
                  <i className="fas fa-ban fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow-sm glass-effect">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className="fas fa-exclamation-circle me-2"></i>
              <span className="fw-bold">Danh sách tài khoản vi phạm</span>
            </div>
            <div className="input-group search-wrapper" style={{ width: '300px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm vi phạm..."
              />
              <button className="btn btn-primary hover-scale" type="button">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="alert alert-warning">
            <i className="fas fa-info-circle me-2"></i>
            Tính năng quản lý tài khoản vi phạm đã được vô hiệu hóa. Vui lòng liên hệ quản trị viên hệ thống để cấu hình lại API và khôi phục chức năng này.
          </div>
          
          <div className="text-center py-5">
            <div className="fs-1 text-secondary mb-3">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h4>Không có kết nối đến dữ liệu tài khoản vi phạm</h4>
            <p className="text-muted mb-4">API cho phần quản lý tài khoản vi phạm hiện không khả dụng hoặc chưa được cấu hình đúng cách.</p>
            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-primary">
                <i className="fas fa-tools me-2"></i> Kiểm tra kết nối API
              </button>
              <button className="btn btn-outline-secondary">
                <i className="fas fa-book me-2"></i> Xem tài liệu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationAccountsPlaceholder; 