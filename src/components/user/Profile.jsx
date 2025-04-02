import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Dữ liệu người dùng mẫu với các trường tương ứng từ danh sách
  const [userData, setUserData] = useState({
    fullName: 'Nguyễn Văn A',
    phoneNumber: '0987654321',
    email: 'nguyenvana@example.com',
    isEmailVerified: true,
    isActive: true,
    roleID: 2, // Khách hàng
    lastLogin: '2023-03-15T10:30:00',
    createdAt: '2023-01-01T08:00:00',
    updatedAt: '2023-03-15T10:30:00',
    // Chỉ giữ lại avatar và dateOfBirth, bỏ bio và address
    avatar: null,
    dateOfBirth: '1990-01-15',
    gender: 'male'
  });

  // Danh sách bất động sản yêu thích
  const [favorites, setFavorites] = useState([]);

  // Lịch sử giao dịch mẫu
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'Đặt lịch xem',
      status: 'Đã hoàn thành',
      date: '15/03/2023',
      property: 'Căn hộ cao cấp Landmark 81',
      amount: 'Miễn phí'
    },
    {
      id: 2,
      type: 'Đặt cọc',
      status: 'Đang xử lý',
      date: '20/03/2023',
      property: 'Biệt thự vườn Ecopark',
      amount: '200 triệu VND'
    },
    {
      id: 3,
      type: 'Tư vấn',
      status: 'Đã hủy',
      date: '05/03/2023',
      property: 'Nhà phố liền kề The Manor',
      amount: 'Miễn phí'
    }
  ]);

  // Cập nhật tiêu đề trang và lấy danh sách yêu thích từ localStorage
  useEffect(() => {
    document.title = "Hồ sơ người dùng | Makaan";
    
    // Lấy danh sách bất động sản yêu thích từ localStorage
    try {
      const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(savedFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, []);

  // Xử lý thay đổi ảnh đại diện
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({
          ...userData,
          avatar: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý gửi biểu mẫu
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mô phỏng API gọi
    setTimeout(() => {
      setLoading(false);
      setEditMode(false);
      // Thông báo thành công hoặc lưu dữ liệu
    }, 1500);
  };

  // Xử lý xóa mục yêu thích
  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favorites.filter(property => property.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Xử lý thay đổi dữ liệu
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Định dạng ngày giờ
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Lấy tên vai trò
  const getRoleName = (roleId) => {
    switch(roleId) {
      case 1: return 'Quản trị viên';
      case 2: return 'Khách hàng';
      case 3: return 'Nhân viên';
      default: return 'Không xác định';
    }
  };

  // Chuyển đến trang yêu thích đầy đủ
  const navigateToFavorites = () => {
    history.push('/favorites');
  };

  return (
    <div className="container-xxl bg-white p-0">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center py-4">
              <h1 className="m-0 text-white">Hồ sơ người dùng</h1>
              <Link to="/" className="btn btn-light px-4 py-2">
                <i className="bi bi-house-door me-2"></i>
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
        
        {/* Nội dung chính */}
        <div className="container py-5">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3 mb-4">
              <div className="profile-sidebar">
                <div className="user-info text-center mb-4">
                  <div className="avatar-container mb-3">
                    {userData.avatar ? (
                      <img 
                        src={userData.avatar} 
                        alt={userData.fullName} 
                        className="avatar-img" 
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <i className="bi bi-person"></i>
                      </div>
                    )}
                  </div>
                  <h5 className="m-0">{userData.fullName}</h5>
                  <p className="text-muted small">{userData.email}</p>
                  <div className="badge bg-success mt-2">
                    {userData.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                  </div>
                </div>
                
                <div className="nav flex-column nav-pills">
                  <button 
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    Thông tin cá nhân
                  </button>
                  <button 
                    className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                  >
                    <i className="bi bi-heart me-2"></i>
                    Danh sách yêu thích
                    {favorites.length > 0 && (
                      <span className="badge bg-primary ms-2">{favorites.length}</span>
                    )}
                  </button>
                  <button 
                    className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                  >
                    <i className="bi bi-clock-history me-2"></i>
                    Lịch sử giao dịch
                  </button>
                  <button 
                    className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <i className="bi bi-gear me-2"></i>
                    Cài đặt tài khoản
                  </button>
                  <button 
                    className="nav-link text-danger"
                    onClick={() => history.push('/login')}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
            
            {/* Nội dung tab */}
            <div className="col-lg-9">
              <div className="profile-content">
                {/* Tab Thông tin cá nhân */}
                {activeTab === 'profile' && (
                  <div className="tab-content-inner">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="m-0">Thông tin cá nhân</h3>
                      {!editMode ? (
                        <button 
                          className="btn btn-primary"
                          onClick={() => setEditMode(true)}
                        >
                          <i className="bi bi-pencil-square me-2"></i>
                          Chỉnh sửa
                        </button>
                      ) : (
                        <div>
                          <button 
                            className="btn btn-outline-secondary me-2"
                            onClick={() => setEditMode(false)}
                            disabled={loading}
                          >
                            Hủy
                          </button>
                          <button 
                            className="btn btn-primary"
                            onClick={handleSubmit}
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Đang lưu...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check2 me-2"></i>
                                Lưu thay đổi
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {editMode ? (
                      // Form chỉnh sửa thông tin
                      <form>
                        <div className="mb-4 text-center">
                          <div className="avatar-upload">
                            {userData.avatar ? (
                              <img src={userData.avatar} alt="Avatar" className="avatar-img mb-3" />
                            ) : (
                              <div className="avatar-placeholder mb-3">
                                <i className="bi bi-person"></i>
                              </div>
                            )}
                            <div>
                              <label htmlFor="avatar-upload" className="btn btn-sm btn-outline-primary">
                                Thay đổi ảnh đại diện
                              </label>
                              <input 
                                type="file" 
                                id="avatar-upload" 
                                className="d-none" 
                                accept="image/*"
                                onChange={handleAvatarChange}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="fullName" className="form-label">Họ và tên</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              id="fullName"
                              name="fullName"
                              value={userData.fullName}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input 
                              type="email" 
                              className="form-control" 
                              id="email"
                              name="email"
                              value={userData.email}
                              readOnly
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                            <input 
                              type="tel" 
                              className="form-control" 
                              id="phoneNumber"
                              name="phoneNumber"
                              value={userData.phoneNumber}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label htmlFor="dateOfBirth" className="form-label">Ngày sinh</label>
                            <input 
                              type="date" 
                              className="form-control" 
                              id="dateOfBirth"
                              name="dateOfBirth"
                              value={userData.dateOfBirth}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Giới tính</label>
                            <div>
                              <div className="form-check form-check-inline">
                                <input 
                                  className="form-check-input" 
                                  type="radio" 
                                  name="gender" 
                                  id="genderMale" 
                                  value="male"
                                  checked={userData.gender === 'male'}
                                  onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="genderMale">Nam</label>
                              </div>
                              <div className="form-check form-check-inline">
                                <input 
                                  className="form-check-input" 
                                  type="radio" 
                                  name="gender" 
                                  id="genderFemale" 
                                  value="female"
                                  checked={userData.gender === 'female'}
                                  onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="genderFemale">Nữ</label>
                              </div>
                              <div className="form-check form-check-inline">
                                <input 
                                  className="form-check-input" 
                                  type="radio" 
                                  name="gender" 
                                  id="genderOther" 
                                  value="other"
                                  checked={userData.gender === 'other'}
                                  onChange={handleChange}
                                />
                                <label className="form-check-label" htmlFor="genderOther">Khác</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    ) : (
                      // Hiển thị thông tin
                      <div className="user-profile-details">
                        <div className="row">
                          <div className="col-md-6 mb-4">
                            <div className="info-group">
                              <span className="info-label">Họ và tên</span>
                              <span className="info-value">{userData.fullName}</span>
                            </div>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="info-group">
                              <span className="info-label">Email</span>
                              <span className="info-value">
                                {userData.email} 
                                {userData.isEmailVerified ? 
                                  <i className="bi bi-check-circle-fill text-success ms-2" title="Email đã xác minh"></i> : 
                                  <i className="bi bi-exclamation-circle-fill text-warning ms-2" title="Email chưa xác minh"></i>
                                }
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="info-group">
                              <span className="info-label">Số điện thoại</span>
                              <span className="info-value">{userData.phoneNumber}</span>
                            </div>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="info-group">
                              <span className="info-label">Vai trò</span>
                              <span className="info-value">{getRoleName(userData.roleID)}</span>
                            </div>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="info-group">
                              <span className="info-label">Đăng nhập lần cuối</span>
                              <span className="info-value">{formatDateTime(userData.lastLogin)}</span>
                            </div>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="info-group">
                              <span className="info-label">Ngày sinh</span>
                              <span className="info-value">{new Date(userData.dateOfBirth).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="info-group">
                              <span className="info-label">Giới tính</span>
                              <span className="info-value">
                                {userData.gender === 'male' ? 'Nam' : 
                                 userData.gender === 'female' ? 'Nữ' : 'Khác'}
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="info-group">
                              <span className="info-label">Trạng thái</span>
                              <span className="info-value">
                                <span className={`badge ${userData.isActive ? 'bg-success' : 'bg-danger'}`}>
                                  {userData.isActive ? 'Đang hoạt động' : 'Bị vô hiệu hóa'}
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="info-group">
                              <span className="info-label">Ngày tạo tài khoản</span>
                              <span className="info-value">{formatDateTime(userData.createdAt)}</span>
                            </div>
                          </div>
                          <div className="col-md-6 mb-4">
                            <div className="info-group">
                              <span className="info-label">Cập nhật lần cuối</span>
                              <span className="info-value">{formatDateTime(userData.updatedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tab Danh sách yêu thích */}
                {activeTab === 'favorites' && (
                  <div className="tab-content-inner">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="mb-0">Danh sách yêu thích</h3>
                      <Link to="/favorites" className="btn btn-outline-primary">
                        <i className="bi bi-heart-fill me-2"></i>
                        Xem tất cả
                      </Link>
                    </div>
                    
                    {favorites.length > 0 ? (
                      <div className="row">
                        {favorites.slice(0, 3).map(property => (
                          <div key={property.id} className="col-lg-6 col-xl-4 mb-4">
                            <div className="property-card">
                              <div className="property-img">
                                <img src={property.image} alt={property.title} />
                                <button 
                                  className="btn-remove-favorite"
                                  onClick={() => handleRemoveFavorite(property.id)}
                                  aria-label="Xóa khỏi yêu thích"
                                >
                                  <i className="bi bi-x-lg"></i>
                                </button>
                              </div>
                              <div className="property-info">
                                <h5>
                                  <Link to={`/property/${property.id}`} className="text-decoration-none text-dark">
                                    {property.title}
                                  </Link>
                                </h5>
                                <p className="location">
                                  <i className="bi bi-geo-alt me-1"></i>
                                  {property.address}
                                </p>
                                <div className="property-features">
                                  <span><i className="bi bi-rulers me-1"></i>{property.area}</span>
                                  <span><i className="bi bi-house-door me-1"></i>{property.bedrooms} PN</span>
                                  <span><i className="bi bi-droplet me-1"></i>{property.bathrooms} VS</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                  <div className="price">{property.price}</div>
                                  <Link to={`/property/${property.id}`} className="btn btn-sm btn-outline-primary">
                                    Xem chi tiết
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {favorites.length > 3 && (
                          <div className="text-center mt-3">
                            <Link to="/favorites" className="btn btn-primary">
                              Xem tất cả {favorites.length} bất động sản yêu thích
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="icon-container mb-3">
                          <i className="bi bi-heart"></i>
                        </div>
                        <h5>Chưa có bất động sản yêu thích</h5>
                        <p>Hãy thêm các bất động sản bạn yêu thích để xem lại sau.</p>
                        <Link to="/" className="btn btn-primary">
                          Khám phá bất động sản
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tab Lịch sử giao dịch */}
                {activeTab === 'transactions' && (
                  <div className="tab-content-inner">
                    <h3 className="mb-4">Lịch sử giao dịch</h3>
                    {transactions.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table transaction-table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Loại</th>
                              <th>Bất động sản</th>
                              <th>Ngày</th>
                              <th>Số tiền</th>
                              <th>Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.map(transaction => (
                              <tr key={transaction.id}>
                                <td>#{transaction.id}</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.property}</td>
                                <td>{transaction.date}</td>
                                <td>{transaction.amount}</td>
                                <td>
                                  <span className={`status-badge status-${transaction.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                    {transaction.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="empty-state">
                        <div className="icon-container mb-3">
                          <i className="bi bi-clock-history"></i>
                        </div>
                        <h5>Chưa có giao dịch nào</h5>
                        <p>Các giao dịch của bạn sẽ được hiển thị ở đây.</p>
                        <Link to="/" className="btn btn-primary">
                          Khám phá bất động sản
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tab Cài đặt tài khoản */}
                {activeTab === 'settings' && (
                  <div className="tab-content-inner">
                    <h3 className="mb-4">Cài đặt tài khoản</h3>
                    
                    <div className="settings-section mb-4">
                      <h5>Đổi mật khẩu</h5>
                      <form>
                        <div className="mb-3">
                          <label htmlFor="currentPassword" className="form-label">Mật khẩu hiện tại</label>
                          <input type="password" className="form-control" id="currentPassword" />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                          <input type="password" className="form-control" id="newPassword" />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu mới</label>
                          <input type="password" className="form-control" id="confirmPassword" />
                        </div>
                        <button type="submit" className="btn btn-primary">Cập nhật mật khẩu</button>
                      </form>
                    </div>
                    
                    <div className="settings-section mb-4">
                      <h5>Thông báo</h5>
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                        <label className="form-check-label" htmlFor="emailNotifications">
                          Nhận thông báo qua email
                        </label>
                      </div>
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="smsNotifications" />
                        <label className="form-check-label" htmlFor="smsNotifications">
                          Nhận thông báo qua SMS
                        </label>
                      </div>
                      <div className="form-check form-switch mb-3">
                        <input className="form-check-input" type="checkbox" id="marketingEmails" defaultChecked />
                        <label className="form-check-label" htmlFor="marketingEmails">
                          Nhận email tiếp thị và khuyến mãi
                        </label>
                      </div>
                      <button className="btn btn-primary">Lưu thiết lập</button>
                    </div>
                    
                    {userData.isActive && (
                      <div className="settings-section danger-zone">
                        <h5 className="text-danger">Vùng nguy hiểm</h5>
                        <p>Hành động này sẽ không thể hoàn tác.</p>
                        <button className="btn btn-outline-danger">Vô hiệu hóa tài khoản</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 