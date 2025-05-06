import React, { useState } from 'react';

const LocationManagement = () => {
  const [locations] = useState([
    {
      id: 1,
      name: 'Quận 1',
      type: 'district',
      city: 'TP.HCM',
      totalListings: 156,
      activeListings: 89,
      averagePrice: '150tr/m²',
      status: 'active'
    },
    {
      id: 2,
      name: 'Quận Thủ Đức',
      type: 'district',
      city: 'TP.HCM',
      totalListings: 234,
      activeListings: 145,
      averagePrice: '45tr/m²',
      status: 'active'
    },
    {
      id: 3,
      name: 'Quận 7',
      type: 'district',
      city: 'TP.HCM',
      totalListings: 189,
      activeListings: 112,
      averagePrice: '85tr/m²',
      status: 'active'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div style={{ 
      margin: '-56px -1rem 0 -225px', 
      padding: '56px 0 0 225px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Quản lý Địa điểm</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item active">Quản lý khu vực, quận/huyện bất động sản</li>
        </ol>

        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <i className="fas fa-map-marker-alt me-1"></i>
              Danh sách địa điểm
            </div>
            <div>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddModal(true)}
              >
                <i className="fas fa-plus"></i> Thêm địa điểm
              </button>
            </div>
          </div>
          <div className="card-body">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Tên địa điểm</th>
                  <th>Loại</th>
                  <th>Thành phố</th>
                  <th>Tổng tin đăng</th>
                  <th>Tin đang hoạt động</th>
                  <th>Giá trung bình</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {locations.map(location => (
                  <tr key={location.id}>
                    <td>{location.name}</td>
                    <td>{location.type === 'district' ? 'Quận/Huyện' : 'Khu vực'}</td>
                    <td>{location.city}</td>
                    <td>{location.totalListings}</td>
                    <td>{location.activeListings}</td>
                    <td>{location.averagePrice}</td>
                    <td>
                      <span className="badge bg-success">
                        {location.status === 'active' ? 'Đang hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn btn-sm btn-info me-2">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-danger">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-6">
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-chart-bar me-1"></i>
                Thống kê tin đăng theo khu vực
              </div>
              <div className="card-body">
                <canvas id="listingsByLocationChart" width="100%" height="40"></canvas>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-chart-line me-1"></i>
                Biến động giá theo khu vực
              </div>
              <div className="card-body">
                <canvas id="priceByLocationChart" width="100%" height="40"></canvas>
              </div>
            </div>
          </div>
        </div>

        {/* Modal thêm địa điểm */}
        {showAddModal && (
          <div className="modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Thêm địa điểm mới</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Tên địa điểm</label>
                      <input type="text" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Loại</label>
                      <select className="form-select">
                        <option value="district">Quận/Huyện</option>
                        <option value="area">Khu vực</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Thành phố</label>
                      <select className="form-select">
                        <option value="hcm">TP.HCM</option>
                        <option value="hn">Hà Nội</option>
                        <option value="dn">Đà Nẵng</option>
                      </select>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Đóng
                  </button>
                  <button type="button" className="btn btn-primary">
                    Thêm mới
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationManagement; 