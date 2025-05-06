import React, { useState } from 'react';

const RealEstateStatistics = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  const stats = {
    totalListings: 4567,
    totalValue: '12.5 tỷ',
    averagePrice: '3.2 tỷ',
    mostViewedType: 'Căn hộ',
    topRegion: 'Quận 2',
    growthRate: '+15%'
  };

  return (
    <div style={{ 
      margin: '-56px -1rem 0 -225px', 
      padding: '56px 0 0 225px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Thống kê Bất động sản</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item active">Thống kê theo vùng miền và loại bất động sản</li>
        </ol>

        {/* Bộ lọc */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-3">
                <label className="form-label">Khu vực</label>
                <select 
                  className="form-select"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="north">Miền Bắc</option>
                  <option value="central">Miền Trung</option>
                  <option value="south">Miền Nam</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Loại BĐS</label>
                <select 
                  className="form-select"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="apartment">Căn hộ</option>
                  <option value="house">Nhà phố</option>
                  <option value="villa">Biệt thự</option>
                  <option value="land">Đất nền</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Thời gian</label>
                <select 
                  className="form-select"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="week">7 ngày qua</option>
                  <option value="month">30 ngày qua</option>
                  <option value="quarter">Quý này</option>
                  <option value="year">Năm nay</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">&nbsp;</label>
                <button className="btn btn-primary d-block w-100">
                  <i className="fas fa-sync-alt me-1"></i> Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="row">
          <div className="col-xl-3 col-md-6">
            <div className="card bg-primary text-white mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="small">Tổng tin đăng</div>
                    <div className="display-6">{stats.totalListings}</div>
                  </div>
                  <div>
                    <i className="fas fa-home fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-success text-white mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="small">Tổng giá trị</div>
                    <div className="display-6">{stats.totalValue}</div>
                  </div>
                  <div>
                    <i className="fas fa-dollar-sign fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-info text-white mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="small">Giá trung bình</div>
                    <div className="display-6">{stats.averagePrice}</div>
                  </div>
                  <div>
                    <i className="fas fa-chart-line fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-warning text-white mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="small">Tăng trưởng</div>
                    <div className="display-6">{stats.growthRate}</div>
                  </div>
                  <div>
                    <i className="fas fa-arrow-up fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ thống kê */}
        <div className="row">
          <div className="col-xl-6">
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-chart-pie me-1"></i>
                Phân bố theo loại BĐS
              </div>
              <div className="card-body">
                <canvas id="propertyTypeChart" width="100%" height="40"></canvas>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-chart-bar me-1"></i>
                Phân bố theo khu vực
              </div>
              <div className="card-body">
                <canvas id="regionDistributionChart" width="100%" height="40"></canvas>
              </div>
            </div>
          </div>
        </div>

        {/* Bảng chi tiết */}
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-table me-1"></i>
            Chi tiết thống kê
          </div>
          <div className="card-body">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Khu vực</th>
                  <th>Loại BĐS</th>
                  <th>Số lượng</th>
                  <th>Giá TB (tỷ)</th>
                  <th>Tổng giá trị</th>
                  <th>Tăng trưởng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Miền Nam</td>
                  <td>Căn hộ</td>
                  <td>1,234</td>
                  <td>2.5</td>
                  <td>3,085</td>
                  <td>
                    <span className="text-success">
                      <i className="fas fa-arrow-up"></i> 12%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Miền Bắc</td>
                  <td>Nhà phố</td>
                  <td>856</td>
                  <td>4.2</td>
                  <td>3,595</td>
                  <td>
                    <span className="text-success">
                      <i className="fas fa-arrow-up"></i> 8%
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Miền Trung</td>
                  <td>Đất nền</td>
                  <td>567</td>
                  <td>1.8</td>
                  <td>1,020</td>
                  <td>
                    <span className="text-danger">
                      <i className="fas fa-arrow-down"></i> 3%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateStatistics; 