import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PostApproval = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedAction, setSelectedAction] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Giả lập dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPosts = [
        {
          id: 1,
          title: "Căn hộ Vinhomes Central Park",
          description: "2 Phòng ngủ, 2WC, Full nội thất cao cấp",
          author: "Nguyễn Văn A",
          type: "Căn hộ",
          area: "72m²",
          price: "4.5 tỷ",
          location: "Bình Thạnh, TP.HCM",
          status: "Chờ duyệt",
          createdAt: "2024-04-20 09:30",
          thumbnail: "https://placeholder.com/300x200"
        },
        {
          id: 2,
          title: "Nhà phố Nguyễn Văn Linh",
          description: "1 trệt 3 lầu, Hoàn thiện cơ bản",
          author: "Trần Thị B",
          type: "Nhà phố",
          area: "100m²",
          price: "12 tỷ",
          location: "Quận 7, TP.HCM",
          status: "Chờ duyệt",
          createdAt: "2024-04-20 10:15",
          thumbnail: "https://placeholder.com/300x200"
        },
        {
          id: 3,
          title: "Đất nền KDC Vĩnh Lộc",
          description: "Đã có sổ hồng riêng, Xây dựng tự do",
          author: "Phạm Văn C",
          type: "Đất nền",
          area: "80m²",
          price: "2.8 tỷ",
          location: "Bình Chánh, TP.HCM",
          status: "Chờ duyệt",
          createdAt: "2024-04-20 11:00",
          thumbnail: "https://placeholder.com/300x200"
        },
        {
          id: 4,
          title: "Biệt thự nghỉ dưỡng view biển Vũng Tàu",
          author: "Lê Thị D",
          type: "Biệt thự",
          price: "15 tỷ",
          location: "Vũng Tàu",
          status: "Chờ duyệt",
          createdAt: "2024-04-20 11:30",
          thumbnail: "https://placeholder.com/300x200"
        },
        {
          id: 5,
          title: "Shophouse mặt tiền đường Phạm Văn Đồng",
          author: "Hoàng Văn E",
          type: "Shophouse",
          price: "20 tỷ",
          location: "Quận Thủ Đức, TP.HCM",
          status: "Chờ duyệt",
          createdAt: "2024-04-20 13:45",
          thumbnail: "https://placeholder.com/300x200"
        }
      ];

      setPosts(mockPosts);
      setStats({
        total: mockPosts.length,
        pending: mockPosts.filter(p => p.status === 'Chờ duyệt').length,
        approved: 0,
        rejected: 0
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleAction = (post, action) => {
    setSelectedPost(post);
    setSelectedAction(action);
    if (action === 'reject') {
      setShowRejectModal(true);
    } else {
      setShowConfirmModal(true);
    }
  };

  const confirmAction = async () => {
    const message = selectedAction === 'approve' 
      ? 'Bài viết đã được phê duyệt'
      : `Bài viết đã bị từ chối: ${rejectReason}`;
    
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    setShowConfirmModal(false);
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedPost(null);
    
    // Cập nhật thống kê
    setStats(prev => ({
      ...prev,
      pending: prev.pending - 1,
      approved: prev.approved + 1
    }));
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '1rem' }}>
      {/* Toast Notification */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div
          className={`toast ${showToast ? 'show' : ''}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header bg-success text-white">
            <strong className="me-auto">Thông báo</strong>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
          <div className="toast-body">{toastMessage}</div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mt-4 mb-0 text-gradient">Phê duyệt bài đăng</h1>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/">Bảng điều khiển</Link>
            </li>
            <li className="breadcrumb-item active">Phê duyệt bài đăng</li>
          </ol>
        </div>
      </div>

      {/* Thống kê */}
      <div className="row g-3">
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted text-uppercase mb-2 font-13">Tổng tin đăng</p>
                  <h3 className="mb-0">{stats.total}</h3>
                </div>
                <div className="avatar-md rounded-circle bg-primary-subtle">
                  <i className="fas fa-home fa-2x text-primary mt-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted text-uppercase mb-2 font-13">Chờ duyệt</p>
                  <h3 className="mb-0">{stats.pending}</h3>
                </div>
                <div className="avatar-md rounded-circle bg-warning-subtle">
                  <i className="fas fa-clock fa-2x text-warning mt-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted text-uppercase mb-2 font-13">Đã duyệt</p>
                  <h3 className="mb-0">{stats.approved}</h3>
                </div>
                <div className="avatar-md rounded-circle bg-success-subtle">
                  <i className="fas fa-check fa-2x text-success mt-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted text-uppercase mb-2 font-13">Đã từ chối</p>
                  <h3 className="mb-0">{stats.rejected}</h3>
                </div>
                <div className="avatar-md rounded-circle bg-danger-subtle">
                  <i className="fas fa-times fa-2x text-danger mt-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách tin đăng */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Danh sách tin bất động sản chờ duyệt</h5>
            <div className="col-auto" style={{ width: '300px' }}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm tin đăng..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button className="btn btn-primary">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0">Thông tin BĐS</th>
                  <th className="border-0" style={{ width: '100px' }}>Diện tích</th>
                  <th className="border-0" style={{ width: '120px' }}>Giá</th>
                  <th className="border-0" style={{ width: '150px' }}>Khu vực</th>
                  <th className="border-0" style={{ width: '130px' }}>Người đăng</th>
                  <th className="border-0" style={{ width: '100px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={post.thumbnail}
                          alt=""
                          className="rounded"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div className="ms-3">
                          <h6 className="mb-1">{post.title}</h6>
                          <div className="text-muted small">{post.description}</div>
                          <span className="badge bg-info-subtle text-info">{post.type}</span>
                        </div>
                      </div>
                    </td>
                    <td>{post.area}</td>
                    <td className="fw-medium">{post.price}</td>
                    <td>{post.location}</td>
                    <td>
                      <div className="text-dark">{post.author}</div>
                      <div className="text-muted small">{post.createdAt}</div>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button 
                          className="btn btn-sm btn-success" 
                          title="Duyệt"
                          onClick={() => handleAction(post, 'approve')}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-danger" 
                          title="Từ chối"
                          onClick={() => handleAction(post, 'reject')}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                        <button className="btn btn-sm btn-info" title="Chi tiết">
                          <i className="fas fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white">
          <nav>
            <ul className="pagination justify-content-end mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                  <i className="fas fa-chevron-left"></i>
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Modal xác nhận phê duyệt */}
      <div
        className={`modal fade ${showConfirmModal ? 'show' : ''}`}
        style={{ display: showConfirmModal ? 'block' : 'none' }}
        tabIndex="-1"
        aria-hidden={!showConfirmModal}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xác nhận phê duyệt</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowConfirmModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              Bạn có chắc chắn muốn phê duyệt bài viết "{selectedPost?.title}" không?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary hover-scale"
                onClick={() => setShowConfirmModal(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-success hover-scale"
                onClick={confirmAction}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal từ chối bài viết */}
      <div
        className={`modal fade ${showRejectModal ? 'show' : ''}`}
        style={{ display: showRejectModal ? 'block' : 'none' }}
        tabIndex="-1"
        aria-hidden={!showRejectModal}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Từ chối bài viết</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowRejectModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="rejectReason" className="form-label">Lý do từ chối</label>
                <textarea
                  className="form-control"
                  id="rejectReason"
                  rows="3"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do từ chối bài viết..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary hover-scale"
                onClick={() => setShowRejectModal(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-danger hover-scale"
                onClick={confirmAction}
                disabled={!rejectReason.trim()}
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      </div>

      {(showConfirmModal || showRejectModal) && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default PostApproval; 