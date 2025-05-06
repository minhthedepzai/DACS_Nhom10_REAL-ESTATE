import React, { useState } from 'react';

const PremiumVerification = () => {
  const [listings] = useState([
    {
      id: 1,
      title: 'Căn hộ cao cấp Vinhomes Central Park',
      price: '12.5 tỷ',
      type: 'apartment',
      owner: 'Nguyễn Văn A',
      documents: ['ownership_cert', 'floor_plan', 'photos'],
      status: 'pending',
      submittedAt: '2024-03-15 14:30'
    },
    {
      id: 2,
      title: 'Biệt thự view sông Sài Gòn',
      price: '45 tỷ',
      type: 'villa',
      owner: 'Trần Thị B',
      documents: ['ownership_cert', 'photos'],
      status: 'verified',
      submittedAt: '2024-03-14 09:15'
    }
  ]);

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning',
      verified: 'bg-success',
      rejected: 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  };

  const getDocumentIcon = (doc) => {
    const icons = {
      ownership_cert: 'fas fa-file-contract',
      floor_plan: 'fas fa-drafting-compass',
      photos: 'fas fa-images'
    };
    return icons[doc] || 'fas fa-file';
  };

  const getDocumentLabel = (doc) => {
    const labels = {
      ownership_cert: 'Giấy tờ sở hữu',
      floor_plan: 'Bản vẽ thiết kế',
      photos: 'Hình ảnh thực tế'
    };
    return labels[doc] || doc;
  };

  return (
    <div style={{ 
      margin: '-56px -1rem 0 -225px', 
      padding: '56px 0 0 225px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Xác minh Tin Đăng Premium</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item active">Xác minh và phê duyệt tin đăng cao cấp</li>
        </ol>

        {/* Thống kê */}
        <div className="row">
          <div className="col-xl-3 col-md-6">
            <div className="card bg-primary text-white mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="small">Chờ xác minh</div>
                    <div className="display-6">15</div>
                  </div>
                  <div>
                    <i className="fas fa-clock fa-2x"></i>
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
                    <div className="small">Đã xác minh</div>
                    <div className="display-6">45</div>
                  </div>
                  <div>
                    <i className="fas fa-check-circle fa-2x"></i>
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
                    <div className="small">Cần bổ sung</div>
                    <div className="display-6">8</div>
                  </div>
                  <div>
                    <i className="fas fa-exclamation-circle fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card bg-danger text-white mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="small">Từ chối</div>
                    <div className="display-6">3</div>
                  </div>
                  <div>
                    <i className="fas fa-times-circle fa-2x"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách tin đăng */}
        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-list me-1"></i>
            Danh sách tin đăng chờ xác minh
          </div>
          <div className="card-body">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Tin đăng</th>
                  <th>Chủ sở hữu</th>
                  <th>Giá</th>
                  <th>Tài liệu</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(listing => (
                  <tr key={listing.id}>
                    <td>
                      <div className="fw-bold">{listing.title}</div>
                      <small className="text-muted">ID: {listing.id}</small>
                    </td>
                    <td>{listing.owner}</td>
                    <td>{listing.price}</td>
                    <td>
                      {listing.documents.map(doc => (
                        <span key={doc} className="badge bg-secondary me-1" title={getDocumentLabel(doc)}>
                          <i className={`${getDocumentIcon(doc)} me-1`}></i>
                          {getDocumentLabel(doc)}
                        </span>
                      ))}
                    </td>
                    <td>{listing.submittedAt}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(listing.status)}`}>
                        {listing.status === 'pending' ? 'Chờ xác minh' :
                         listing.status === 'verified' ? 'Đã xác minh' :
                         'Từ chối'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-info me-2" title="Xem chi tiết">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-success me-2" title="Xác minh">
                        <i className="fas fa-check"></i>
                      </button>
                      <button className="btn btn-sm btn-warning me-2" title="Yêu cầu bổ sung">
                        <i className="fas fa-exclamation-triangle"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" title="Từ chối">
                        <i className="fas fa-times"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Biểu đồ thống kê */}
        <div className="row">
          <div className="col-xl-6">
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-chart-pie me-1"></i>
                Phân bố trạng thái xác minh
              </div>
              <div className="card-body">
                <canvas id="verificationStatusChart" width="100%" height="40"></canvas>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-chart-line me-1"></i>
                Xu hướng đăng ký Premium
              </div>
              <div className="card-body">
                <canvas id="premiumTrendChart" width="100%" height="40"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumVerification; 