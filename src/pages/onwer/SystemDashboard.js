import React from 'react';
import { Link } from 'react-router-dom';

const SystemDashboard = () => {
  // Mock data - replace with API calls later
  const stats = {
    totalUsers: 1250,
    totalPosts: 3456,
    pendingPosts: 123,
    activeUsers: 890,
    premiumListings: 45,
    reportedUsers: 15
  };

  return (
    <div style={{ 
      margin: '-56px -1rem 0 -225px', 
      padding: '56px 0 0 225px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Dashboard Hệ Thống</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item active">Tổng quan hệ thống</li>
        </ol>
        
        <div className="row">
          <div className="col-xl-3 col-md-6">
            <div className="card bg-primary text-white mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="small">Tổng số người dùng</div>
                    <div className="display-6">{stats.totalUsers}</div>
                  </div>
                  <div>
                    <i className="fas fa-users fa-2x"></i>
                  </div>
                </div>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link className="small text-white stretched-link" to="/quan-ly-nguoi-dung">Chi tiết</Link>
                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6">
            <div className="card bg-success text-white mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="small">Tổng số bài đăng</div>
                    <div className="display-6">{stats.totalPosts}</div>
                  </div>
                  <div>
                    <i className="fas fa-file-alt fa-2x"></i>
                  </div>
                </div>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link className="small text-white stretched-link" to="/quan-ly-bai-dang">Chi tiết</Link>
                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6">
            <div className="card bg-warning text-white mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="small">Bài chờ duyệt</div>
                    <div className="display-6">{stats.pendingPosts}</div>
                  </div>
                  <div>
                    <i className="fas fa-clock fa-2x"></i>
                  </div>
                </div>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link className="small text-white stretched-link" to="/phe-duyet-bai-dang">Chi tiết</Link>
                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6">
            <div className="card bg-danger text-white mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="small">Tài khoản vi phạm</div>
                    <div className="display-6">{stats.reportedUsers}</div>
                  </div>
                  <div>
                    <i className="fas fa-exclamation-triangle fa-2x"></i>
                  </div>
                </div>
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link className="small text-white stretched-link" to="/tai-khoan-vi-pham">Chi tiết</Link>
                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-6">
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-chart-area me-1"></i>
                Thống kê bài đăng theo thời gian
              </div>
              <div className="card-body">
                {/* Add Area Chart here */}
                <canvas id="postsByTimeChart" width="100%" height="40"></canvas>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-chart-bar me-1"></i>
                Phân bố bài đăng theo khu vực
              </div>
              <div className="card-body">
                {/* Add Bar Chart here */}
                <canvas id="postsByRegionChart" width="100%" height="40"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-table me-1"></i>
            Hoạt động gần đây
          </div>
          <div className="card-body">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Người dùng</th>
                  <th>Hoạt động</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2024-03-15 14:30</td>
                  <td>user123</td>
                  <td>Đăng tin BĐS mới</td>
                  <td><span className="badge bg-warning">Chờ duyệt</span></td>
                </tr>
                <tr>
                  <td>2024-03-15 13:45</td>
                  <td>agent456</td>
                  <td>Cập nhật thông tin BĐS</td>
                  <td><span className="badge bg-success">Đã duyệt</span></td>
                </tr>
                <tr>
                  <td>2024-03-15 12:15</td>
                  <td>admin789</td>
                  <td>Xóa bài vi phạm</td>
                  <td><span className="badge bg-danger">Đã xóa</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDashboard; 