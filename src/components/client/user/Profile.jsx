import React, { useState, useEffect, useRef } from 'react';
// import { useHistory, Link } from 'react-router-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { Container, Row, Col, Card, Badge, Dropdown } from 'react-bootstrap';
import './Profile.css';
// import Header from '../Header';
import PersonalInfo from './PersonalInfo';
import Favorites from './Favorites';
import TransactionHistory from './TransactionHistory';
import AccountSettings from './AccountSettings';
import ViewedProperties from './ViewedProperties';
import userService from '../../../services/client/userService';
import authService from '../../../services/client/authService';

// Thêm CSS để ẩn icon
const hiddenIconStyle = {
  display: 'none !important'
};

// Component hiển thị tiêu đề trang
const PageTitle = ({ title, className = '', style = {} }) => {
  // Không hiển thị tiêu đề nếu là "Cài đặt tài khoản"
  if (title === 'Cài đặt tài khoản') {
    return null;
  }
  return <h1 className={className} style={style}>{title}</h1>;
};

const Profile = () => {
  // const history = useHistory();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal-info');
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Fetch user data when component mounts
  useEffect(() => {
    document.title = "Hồ sơ người dùng | Makaan";
    fetchUserData();
    
    // Kiểm tra role
    const role = authService.getUserRole();
    console.log('Current user role in Profile:', role);
    setUserRole(role);
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserInfo();
      setUserData(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải thông tin người dùng');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

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

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Hàm xử lý chọn tab
  const handleOptionClick = (tab) => {
    setActiveTab(tab);
  };

  // Hàm lấy tên tab hiện tại
  const getActiveTabName = () => {
    switch (activeTab) {
      case 'personal-info':
        return 'Thông tin cá nhân';
      case 'favorites':
        return 'Danh sách yêu thích';
      case 'transactions':
        return 'Lịch sử giao dịch';
      case 'settings':
        return 'Cài đặt tài khoản';
      case 'viewed':
        return 'Bài đăng đã xem';
      default:
        return 'Thông tin cá nhân';
    }
  };

  // Function để lấy icon tương ứng với tab
  const getTabIcon = (tab) => {
    switch (tab) {
      case 'personal-info':
        return 'bi bi-person';
      case 'favorites':
        return 'bi bi-heart';
      case 'transactions':
        return 'bi bi-clock-history';
      case 'settings':
        return 'bi bi-gear';
      case 'logout':
        return 'bi bi-box-arrow-right';
      case 'viewed':
        return 'bi bi-eye';
      default:
        return 'bi bi-person';
    }
  };

  // Render profile content
  const renderProfileContent = () => {
    switch (activeTab) {
      case 'personal-info':
        return <PersonalInfo />;
      case 'favorites':
        return <Favorites />;
      case 'transactions':
        return <TransactionHistory />;
      case 'settings':
        return <AccountSettings />;
      case 'viewed':
        return <ViewedProperties />;
      default:
        return <PersonalInfo />;
    }
  };

  // Xử lý logout
  const handleLogout = () => {
    // Thêm logic đăng xuất ở đây
    // history.push('/login');
    navigate('/login');
  };

  // Xử lý chuyển hướng đến trang chủ
  const handleHomeNavigation = (e) => {
    e.preventDefault();
    // Reset state trước khi chuyển hướng
    document.body.classList.remove('menu-open');
    document.body.classList.remove('show-overlay');
    // Chuyển hướng đến trang chủ
    // history.push('/');
    navigate('/');
  };

  // Hàm kiểm tra role admin/owner
  const isManagementRole = (role) => {
    if (!role) return false;
    const normalizedRole = role.toUpperCase();
    return normalizedRole === 'ADMIN' || normalizedRole === 'OWNER' || normalizedRole === 'AGENT';
  };

  // Hàm xử lý chuyển trang quản lý
  const handleManagementClick = () => {
    console.log('Handling management click, current role:', userRole);
    const normalizedRole = userRole?.toUpperCase();
    if (normalizedRole === 'ADMIN') {
      navigate('/admin');
    } else if (normalizedRole === 'OWNER' || normalizedRole === 'AGENT') {
      window.location.href = '/onwer/';
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Lỗi!</h4>
        <p>{error}</p>
        <button 
          className="btn btn-primary mt-3"
          onClick={fetchUserData}
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="alert alert-warning" role="alert">
        <h4 className="alert-heading">Không có dữ liệu</h4>
        <p>Không thể tải thông tin người dùng</p>
        <button 
          className="btn btn-primary mt-3"
          onClick={fetchUserData}
        >
          Tải lại
        </button>
      </div>
    );
  }

  return (
    <div className="container-xxl bg-white p-0">
      <div className="profile-banner">
        <div className="container">
          {/* Sử dụng component PageTitle thay vì h1 trực tiếp */}
          <PageTitle title={getActiveTabName()} />
          <p>Quản lý thông tin và các hoạt động của bạn</p>
        </div>
      </div>
      
      <Container className="py-4">
        <Row className="g-4">
          {/* Sidebar bên trái */}
          <Col lg={3} md={4}>
            <Card className="profile-sidebar shadow-sm">
              <Card.Body className="p-0">
                <div className="user-info text-center p-4">
                  <div 
                    className="avatar-container mb-3 mx-auto" 
                    onClick={() => setShowModal(true)}
                  >
                    {userData.avatar ? (
                      <img src={userData.avatar} alt="Avatar" className="avatar-img" />
                    ) : (
                      <div className="avatar-placeholder">
                        <i className="bi bi-person-fill"></i>
                      </div>
                    )}
                  </div>
                  <h5 className="mb-1">{userData.fullName}</h5>
                  <p className="text-muted mb-2 small">{userData.email}</p>
                  <div className="d-flex justify-content-center mb-3">
                    <Badge bg="success" className="me-2 small">
                      <i className="bi bi-patch-check-fill me-1"></i> Đã xác minh
                    </Badge>
                    <Badge bg="primary" className="small">
                      <i className="bi bi-person-badge me-1"></i> Khách hàng
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="pulse-dot me-2"></div>
                    <span className="text-success small">Đang trực tuyến</span>
                  </div>
                </div>
                
                <div className="border-top"></div>
                
                <div className="navigation-menu p-3" ref={dropdownRef}>
                  <div className="nav-heading mb-3 text-muted small fw-bold">
                    <i className="bi bi-grid me-2"></i> ĐIỀU HƯỚNG
                  </div>
                  <div className="custom-dropdown">
                    <button 
                      className="dropdown-toggle-btn"
                      onClick={() => {
                        console.log('Dropdown clicked, userRole:', userRole); // Debug log
                        setDropdownOpen(!dropdownOpen);
                      }}
                    >
                      <i className={`${getTabIcon(activeTab)} me-2`} style={hiddenIconStyle}></i>
                      {activeTab !== 'settings' ? (
                        <span>{getActiveTabName()}</span>
                      ) : (
                        <span className="empty-tab-name"></span>
                      )}
                      <i className={`bi bi-chevron-down ms-auto ${dropdownOpen ? 'rotated' : ''}`}></i>
                    </button>
                    
                    {dropdownOpen && (
                      <div className="dropdown-menu show">
                        <button 
                          className={`dropdown-item ${activeTab === 'personal-info' ? 'active' : ''}`}
                          onClick={() => {
                            handleOptionClick('personal-info');
                            setDropdownOpen(false);
                          }}
                        >
                          <i className="bi bi-person me-3"></i>
                          <span>Thông tin cá nhân</span>
                        </button>
                        <button 
                          className={`dropdown-item ${activeTab === 'favorites' ? 'active' : ''}`}
                          onClick={() => {
                            handleOptionClick('favorites');
                            setDropdownOpen(false);
                          }}
                        >
                          <i className="bi bi-heart me-3"></i>
                          <span>Danh sách yêu thích</span>
                        </button>
                        <button 
                          className={`dropdown-item ${activeTab === 'transactions' ? 'active' : ''}`}
                          onClick={() => {
                            handleOptionClick('transactions');
                            setDropdownOpen(false);
                          }}
                        >
                          <i className="bi bi-clock-history me-3"></i>
                          <span>Lịch sử giao dịch</span>
                        </button>
                        <button 
                          className={`dropdown-item ${activeTab === 'viewed' ? 'active' : ''}`}
                          onClick={() => {
                            handleOptionClick('viewed');
                            setDropdownOpen(false);
                          }}
                        >
                          <i className="bi bi-eye me-3"></i>
                          <span>Bài đăng đã xem</span>
                        </button>
                        <button 
                          className={`dropdown-item ${activeTab === 'settings' ? 'active' : ''}`}
                          onClick={() => {
                            handleOptionClick('settings');
                            setDropdownOpen(false);
                          }}
                        >
                          <i className="bi bi-gear me-3"></i>
                          <span className="settings-menu-placeholder">Tùy chỉnh</span>
                        </button>

                        {/* Thêm nút Quản lý nếu là ADMIN hoặc OWNER */}
                        {console.log('Checking role for management button:', userRole)}
                        {isManagementRole(userRole) && (
                          <>
                            <div className="dropdown-divider"></div>
                            <button 
                              className="dropdown-item management"
                              onClick={() => {
                                handleManagementClick();
                                setDropdownOpen(false);
                              }}
                            >
                              <i className="bi bi-speedometer2 me-3"></i>
                              <span>Quản lý hệ thống</span>
                            </button>
                          </>
                        )}

                        <div className="dropdown-divider"></div>
                        <button 
                          className="dropdown-item logout"
                          onClick={handleLogout}
                        >
                          <i className="bi bi-box-arrow-right me-3"></i>
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-top"></div>
                
                <div className="contact-info p-3">
                  <div className="nav-heading mb-3 text-muted small fw-bold">
                    <i className="bi bi-info-circle me-2"></i> THÔNG TIN LIÊN HỆ
                  </div>
                  <div className="info-item mb-2 d-flex align-items-center">
                    <i className="bi bi-telephone text-muted me-3"></i>
                    <span className="small">{userData.phoneNumber || 'Chưa cập nhật'}</span>
                  </div>
                  <div className="info-item d-flex align-items-center">
                    <i className="bi bi-envelope text-muted me-3"></i>
                    <span className="small">{userData.email}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Nội dung chính bên phải */}
          <Col lg={9} md={8}>
            <Card className="profile-content shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-white p-4 border-bottom">
                <div className="d-flex align-items-center">
                  <i className={`bi ${activeTab === 'personal-info' ? 'bi-person' : 
                    activeTab === 'favorites' ? 'bi-heart' :
                    activeTab === 'transactions' ? 'bi-clock-history' : 
                    'bi-gear'} text-primary me-3 fs-4`}></i>
                  {/* Không hiển thị tiêu đề nếu là "Cài đặt tài khoản" */}
                  {getActiveTabName() !== 'Cài đặt tài khoản' && (
                    <h4 className="mb-0">{getActiveTabName()}</h4>
                )}
              </div>
              </Card.Header>
              <Card.Body className="p-4">
                {renderProfileContent()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* Modal xem ảnh đại diện */}
      {showModal && (
        <div className="avatar-modal">
          <div className="avatar-modal-backdrop" onClick={() => setShowModal(false)}></div>
          <div className="avatar-modal-content">
            <div className="avatar-modal-header">
              <h5 className="mb-0">Ảnh đại diện</h5>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="avatar-modal-body">
              <img src={userData.avatar} alt="Avatar" className="avatar-modal-img" />
            </div>
            <div className="avatar-modal-footer">
              <button className="btn btn-outline-success me-2">
                <i className="bi bi-upload me-2"></i>
                Tải ảnh mới
              </button>
              <button className="btn btn-success" onClick={() => setShowModal(false)}>
                <i className="bi bi-check-lg me-2"></i>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 