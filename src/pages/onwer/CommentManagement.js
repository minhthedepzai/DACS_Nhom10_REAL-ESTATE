import React, { useState } from 'react';

const CommentManagement = () => {
  const [comments] = useState([
    {
      id: 1,
      content: 'Vị trí đẹp, giá hợp lý',
      user: 'user123',
      propertyTitle: 'Căn hộ cao cấp Quận 1',
      rating: 5,
      type: 'review',
      status: 'pending',
      createdAt: '2024-03-15 14:30'
    },
    {
      id: 2,
      content: 'Môi giới rất nhiệt tình tư vấn',
      user: 'buyer456',
      propertyTitle: 'Biệt thự Phú Mỹ Hưng',
      rating: 4,
      type: 'agent_review',
      status: 'approved',
      createdAt: '2024-03-15 13:45'
    },
    {
      id: 3,
      content: 'Thông tin không chính xác',
      user: 'client789',
      propertyTitle: 'Nhà phố Thủ Đức',
      rating: 2,
      type: 'complaint',
      status: 'pending',
      createdAt: '2024-03-15 12:15'
    }
  ]);

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-warning',
      approved: 'bg-success',
      rejected: 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  };

  const getTypeBadge = (type) => {
    const badges = {
      review: 'bg-info',
      agent_review: 'bg-primary',
      complaint: 'bg-danger'
    };
    return badges[type] || 'bg-secondary';
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div style={{ 
      margin: '-56px -1rem 0 -225px', 
      padding: '56px 0 0 225px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Quản lý Bình luận & Đánh giá</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item active">Phê duyệt và quản lý bình luận, đánh giá người dùng</li>
        </ol>

        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <i className="fas fa-comments me-1"></i>
              Danh sách bình luận & đánh giá
            </div>
            <div>
              <button className="btn btn-primary btn-sm me-2">
                <i className="fas fa-filter"></i> Lọc
              </button>
              <button className="btn btn-success btn-sm">
                <i className="fas fa-download"></i> Xuất Excel
              </button>
            </div>
          </div>
          <div className="card-body">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Người dùng</th>
                  <th>Bất động sản</th>
                  <th>Loại</th>
                  <th>Đánh giá</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {comments.map(comment => (
                  <tr key={comment.id}>
                    <td>{comment.createdAt}</td>
                    <td>{comment.user}</td>
                    <td>{comment.propertyTitle}</td>
                    <td>
                      <span className={`badge ${getTypeBadge(comment.type)}`}>
                        {comment.type === 'review' ? 'Đánh giá BĐS' : 
                         comment.type === 'agent_review' ? 'Đánh giá môi giới' : 
                         'Khiếu nại'}
                      </span>
                    </td>
                    <td>
                      <span className="text-warning">{getRatingStars(comment.rating)}</span>
                    </td>
                    <td>{comment.content}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(comment.status)}`}>
                        {comment.status === 'pending' ? 'Chờ duyệt' :
                         comment.status === 'approved' ? 'Đã duyệt' :
                         'Từ chối'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-success me-2">
                        <i className="fas fa-check"></i>
                      </button>
                      <button className="btn btn-sm btn-danger me-2">
                        <i className="fas fa-times"></i>
                      </button>
                      <button className="btn btn-sm btn-info">
                        <i className="fas fa-eye"></i>
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
                <i className="fas fa-chart-pie me-1"></i>
                Phân bố đánh giá
              </div>
              <div className="card-body">
                <canvas id="ratingDistributionChart" width="100%" height="40"></canvas>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card mb-4">
              <div className="card-header">
                <i className="fas fa-chart-line me-1"></i>
                Xu hướng đánh giá theo thời gian
              </div>
              <div className="card-body">
                <canvas id="ratingTrendChart" width="100%" height="40"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentManagement; 