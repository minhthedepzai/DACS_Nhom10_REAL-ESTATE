import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaChartBar, FaHome, FaBuilding, FaUser, 
  FaSignInAlt, FaBell, FaCheckCircle, FaEnvelope, FaUserCircle
} from 'react-icons/fa';
import './css/Navbar.css';
import authService from '../../services/client/authService';

// Logo component
const Logo = () => (
  <h1 
    className="m-0 animate__animated animate__fadeIn" 
    style={{ 
      background: 'linear-gradient(45deg, #00B98E, #34e89e)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      textShadow: '2px 2px 8px rgba(0, 185, 142, 0.2)',
      fontWeight: '800',
      letterSpacing: '2px',
      fontSize: '2rem',
      padding: '0 5px',
      borderRadius: '4px',
      animation: 'glow 3s ease-in-out infinite alternate',
      position: 'relative'
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = 'scale(1.05)';
      e.target.style.transition = 'all 0.3s ease';
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = 'scale(1)';
      e.target.style.transition = 'all 0.3s ease';
    }}
  >
    MAKAAN
    <span 
      style={{
        position: 'absolute',
        bottom: '-5px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '30%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #00B98E, transparent)',
        animation: 'expandWidth 3s ease-in-out infinite'
      }}
    />
  </h1>
);

// Navigation Links component
const NavLinks = ({ location, handleHomeClick, dropdowns, toggleDropdown, closeMenu }) => (
  <div className="navbar-nav ms-auto p-4 p-lg-0">
    <Link
      to="/"
      className={`nav-item nav-link ${location.pathname === '/' ? 'active' : ''}`}
      onClick={handleHomeClick}
    >
      <FaHome className="me-1" />
      TRANG CHỦ
    </Link>

    <div className="nav-item dropdown">
      <Link
        className="nav-link"
        to="#"
        onClick={(e) => {
          e.preventDefault();
          toggleDropdown('properties', e);
        }}
        aria-expanded={dropdowns.properties}
      >
        <FaBuilding className="me-1" />
        BẤT ĐỘNG SẢN 
        <i className={`fas fa-chevron-${dropdowns.properties ? 'up' : 'down'} ms-1`}></i>
      </Link>
      <div className={`dropdown-menu rounded-0 m-0 ${dropdowns.properties ? 'show' : ''}`}>
        <Link to="/properties" className="dropdown-item" onClick={closeMenu}>
          <FaHome className="me-2" /> Danh sách BDS
        </Link>
        <Link to="/property-type" className="dropdown-item" onClick={closeMenu}>
          <FaBuilding className="me-2" /> Loại hình BDS
        </Link>
        <Link to="/property-agent" className="dropdown-item" onClick={closeMenu}>
          <FaUser className="me-2" /> Nhà môi giới
        </Link>
        <Link to="/market-stats" className="dropdown-item" onClick={closeMenu}>
          <FaChartBar className="me-2" /> Thống kê thị trường
        </Link>
      </div>
    </div>

    <div className="nav-item dropdown">
      <Link
        className="nav-link"
        to="#"
        onClick={(e) => {
          e.preventDefault();
          toggleDropdown('pages', e);
        }}
        aria-expanded={dropdowns.pages}
      >
        TRANG <i className={`fas fa-chevron-${dropdowns.pages ? 'up' : 'down'} ms-1`}></i>
      </Link>
      <div className={`dropdown-menu rounded-0 m-0 ${dropdowns.pages ? 'show' : ''}`}>
        <Link to="/about" className="dropdown-item" onClick={closeMenu}>Giới thiệu</Link>
        <Link to="/services" className="dropdown-item" onClick={closeMenu}>Dịch vụ</Link>
        <Link to="/contact" className="dropdown-item" onClick={closeMenu}>Liên hệ</Link>
      </div>
    </div>

    <Link to="/contact" className={`nav-item nav-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={closeMenu}>
      LIÊN HỆ
    </Link>
  </div>
);

// Auth Buttons component
const AuthButtons = ({ favoriteCount, closeMenu }) => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(2);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const profileDropdownRef = useRef(null);
  const chatDropdownRef = useRef(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Kiểm tra token trước
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found');
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        // Sau đó kiểm tra thông tin user
        const userStr = localStorage.getItem('user');
        console.log('User from localStorage:', userStr);
        
        if (!userStr) {
          console.log('No user found in localStorage');
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        const userInfo = JSON.parse(userStr);
        console.log('Parsed user info:', userInfo);
        
        // Nếu có cả token và user info thì set authenticated
        setIsAuthenticated(true);
        setUser(userInfo);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    // Gọi checkAuth khi component mount
    checkAuth();

    // Thêm event listener để lắng nghe thay đổi từ localStorage
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Log trạng thái để debug
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setShowProfileDropdown(false);
      window.location.reload(); // Reload để cập nhật UI
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleNotifications = (e) => {
    e.preventDefault();
    setShowNotifications(!showNotifications);
    setShowProfileDropdown(false);
  };

  const toggleProfileDropdown = (e) => {
    e.preventDefault();
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifications(false);
  };

  const toggleChatDropdown = (e) => {
    e.preventDefault();
    setShowChatDropdown(!showChatDropdown);
    setShowNotifications(false);
    setShowProfileDropdown(false);
  };

  // Click outside handler for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Click outside handler for chat dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatDropdownRef.current && !chatDropdownRef.current.contains(event.target)) {
        setShowChatDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChatItemClick = (chatUser) => {
    setSelectedChat(selectedChat?.id === chatUser.id ? null : chatUser);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    // Xử lý gửi tin nhắn ở đây
    console.log('Gửi tin nhắn:', messageInput, 'tới:', selectedChat.name);
    setMessageInput('');
  };

  return (
    <div className="nav-buttons d-flex align-items-center ms-4">
      {isAuthenticated ? (
        <>
      <div className="position-relative me-2">
        <button 
          className={`btn nav-icon-btn notification-btn ${showNotifications ? 'active' : ''}`}
          onClick={toggleNotifications}
          title="Thông báo"
        >
          <div className="notification-icon-wrapper">
            <FaBell className="notification-icon" />
            {notificationCount > 0 && (
              <span className="notification-badge pulse">
                {notificationCount}
              </span>
            )}
          </div>
        </button>

        {showNotifications && (
          <div className="notification-dropdown">
            <div className="notification-header">
              <div className="d-flex align-items-center">
                    <h6 className="mb-0">Thông báo</h6>
                    <span className="badge bg-danger ms-2">{notificationCount}</span>
                </div>
                  <div className="notification-actions">
                    <button className="btn btn-link btn-sm text-muted">
                      <i className="bi bi-check2-all"></i>
              </button>
            </div>
                </div>

                <div className="notification-tabs">
                  <button className="tab-btn active">
                    Tất cả <span className="count">3</span>
              </button>
                  <button className="tab-btn">
                    Chưa đọc <span className="count">2</span>
              </button>
                  <button className="tab-btn">
                    Đã đọc <span className="count">1</span>
              </button>
            </div>

                <div className="notification-list">
              <div className="notification-item unread">
                    <div className="notification-dot"></div>
                <div className="notification-content">
                      <div className="notification-title">
                        <span>Có người quan tâm BĐS</span>
                        <small>2 phút trước</small>
                  </div>
                      <p>Nguyễn Văn A đã quan tâm BĐS "Căn hộ cao cấp tại Q7"</p>
                  <div className="notification-actions">
                        <button className="btn btn-link btn-sm text-primary">Xem chi tiết</button>
                        <button className="btn btn-link btn-sm text-muted">Ẩn</button>
                  </div>
                </div>
              </div>

              <div className="notification-item unread">
                    <div className="notification-dot"></div>
                <div className="notification-content">
                      <div className="notification-title">
                        <span>Bài đăng được duyệt</span>
                        <small>1 giờ trước</small>
                  </div>
                      <p>Bài đăng "Căn hộ cao cấp tại Q7" đã được duyệt</p>
                  <div className="notification-actions">
                        <button className="btn btn-link btn-sm text-primary">Xem bài đăng</button>
                        <button className="btn btn-link btn-sm text-muted">Ẩn</button>
                  </div>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-content">
                      <div className="notification-title">
                        <span>Tin nhắn mới</span>
                        <small>1 ngày trước</small>
                  </div>
                      <p>Trần Thị B: "Tôi quan tâm đến căn hộ của bạn..."</p>
                  <div className="notification-actions">
                        <button className="btn btn-link btn-sm text-primary">Trả lời</button>
                        <button className="btn btn-link btn-sm text-muted">Ẩn</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="notification-footer">
                  <a href="/notifications">Xem tất cả thông báo</a>
            </div>
          </div>
        )}
      </div>

          <div className="position-relative me-2" ref={chatDropdownRef}>
            <button 
              className={`btn nav-icon-btn chat-btn ${showChatDropdown ? 'active' : ''}`}
              onClick={toggleChatDropdown}
              title="Tin nhắn"
            >
              <div className="chat-icon-wrapper">
                <FaEnvelope className="chat-icon" />
                {unreadMessages > 0 && (
                  <span className="chat-badge pulse">
                    {unreadMessages}
        </span>
                )}
              </div>
            </button>

            {showChatDropdown && (
              <div className="chat-dropdown">
                <div className="chat-header">
                  <div className="d-flex align-items-center">
                    {selectedChat ? (
                      <>
                        <button 
                          className="btn btn-link btn-sm text-muted me-2"
                          onClick={() => setSelectedChat(null)}
                        >
                          <i className="bi bi-arrow-left"></i>
                        </button>
                        <div className="d-flex align-items-center">
                          <div className="chat-avatar me-2" style={{width: '32px', height: '32px'}}>
                            <img src={`https://ui-avatars.com/api/?name=${selectedChat.name}&background=random`} alt={selectedChat.name} />
                            <span className={`status-dot ${selectedChat.status}`}></span>
                          </div>
                          <h6 className="mb-0">{selectedChat.name}</h6>
                        </div>
                      </>
                    ) : (
                      <>
                        <h6 className="mb-0">Tin nhắn</h6>
                        <span className="badge bg-danger ms-2">{unreadMessages}</span>
                      </>
                    )}
                  </div>
                  {!selectedChat && (
                    <div className="chat-actions">
                      <button className="btn btn-link btn-sm text-muted" title="Tìm kiếm">
                        <i className="bi bi-search"></i>
                      </button>
                      <button className="btn btn-link btn-sm text-muted" title="Đánh dấu đã đọc">
                        <i className="bi bi-check2-all"></i>
                      </button>
                    </div>
                  )}
                </div>

                {!selectedChat ? (
                  // Danh sách chat
                  <div className="chat-list">
                    <div 
                      className="chat-item unread" 
                      onClick={() => handleChatItemClick({
                        id: 1,
                        name: 'Trần Thị B',
                        status: 'online',
                        lastMessage: 'Tôi quan tâm đến căn hộ của bạn, có thể cho tôi thêm thông tin?',
                        time: '2 phút trước',
                        unreadCount: 1
                      })}
                    >
                      <div className="chat-avatar">
                        <img src="https://ui-avatars.com/api/?name=Trần+Thị+B&background=random" alt="TTB" />
                        <span className="status-dot online"></span>
                      </div>
                      <div className="chat-content">
                        <div className="chat-title">
                          <span className="name">Trần Thị B</span>
                          <small className="time">2 phút trước</small>
                        </div>
                        <div className="last-message">
                          <p>Tôi quan tâm đến căn hộ của bạn, có thể cho tôi thêm thông tin?</p>
                          <span className="unread-badge">1</span>
                        </div>
                      </div>
                    </div>

                    <div 
                      className="chat-item unread"
                      onClick={() => handleChatItemClick({
                        id: 2,
                        name: 'Nguyễn Văn A',
                        status: 'online',
                        lastMessage: 'Căn hộ này còn không ạ? Tôi muốn đặt lịch xem.',
                        time: '1 giờ trước',
                        unreadCount: 2
                      })}
                    >
                      <div className="chat-avatar">
                        <img src="https://ui-avatars.com/api/?name=Nguyễn+Văn+A&background=random" alt="NVA" />
                        <span className="status-dot online"></span>
                      </div>
                      <div className="chat-content">
                        <div className="chat-title">
                          <span className="name">Nguyễn Văn A</span>
                          <small className="time">1 giờ trước</small>
                        </div>
                        <div className="last-message">
                          <p>Căn hộ này còn không ạ? Tôi muốn đặt lịch xem.</p>
                          <span className="unread-badge">2</span>
                        </div>
                      </div>
                    </div>

                    <div 
                      className="chat-item"
                      onClick={() => handleChatItemClick({
                        id: 3,
                        name: 'Lê Thị C',
                        status: 'offline',
                        lastMessage: 'Cảm ơn bạn đã chia sẻ thông tin. Tôi sẽ liên hệ lại sau.',
                        time: '1 ngày trước'
                      })}
                    >
                      <div className="chat-avatar">
                        <img src="https://ui-avatars.com/api/?name=Lê+Thị+C&background=random" alt="LTC" />
                        <span className="status-dot offline"></span>
                      </div>
                      <div className="chat-content">
                        <div className="chat-title">
                          <span className="name">Lê Thị C</span>
                          <small className="time">1 ngày trước</small>
                        </div>
                        <div className="last-message">
                          <p>Cảm ơn bạn đã chia sẻ thông tin. Tôi sẽ liên hệ lại sau.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Khung chat với người được chọn
                  <div className="chat-conversation">
                    <div className="chat-messages">
                      <div className="message-item received">
                        <div className="message-content">
                          <p>{selectedChat.lastMessage}</p>
                          <small className="message-time">{selectedChat.time}</small>
                        </div>
                      </div>
                    </div>
                    <div className="chat-input-wrapper">
                      <form onSubmit={handleSendMessage} className="input-group">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Nhập tin nhắn..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">
                          <i className="bi bi-send"></i>
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {!selectedChat && (
                  <div className="chat-footer">
                    <a href="/messages" className="view-all-link">
                      Xem tất cả tin nhắn
                      <i className="bi bi-arrow-right ms-1"></i>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="position-relative" ref={profileDropdownRef}>
            <button
              className={`btn nav-icon-btn profile-btn ${showProfileDropdown ? 'active' : ''}`}
              onClick={toggleProfileDropdown}
              title="Tài khoản"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="profile-avatar" />
              ) : (
                <FaUserCircle className="nav-icon" />
              )}
            </button>

            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-info">
                    <div className="profile-avatar-lg">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <div className="profile-avatar-placeholder-lg">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="profile-details">
                      <h6 className="mb-0">{user?.name}</h6>
                      <small className="text-muted">{user?.email}</small>
                    </div>
                  </div>
                </div>
                <div className="profile-menu">
                  <Link to="/ho-so" className="profile-menu-item" onClick={closeMenu}>
                    <FaUser className="me-2" />
                    Hồ sơ của tôi
                  </Link>
                  <Link to="/tin-dang" className="profile-menu-item" onClick={closeMenu}>
                    <FaBuilding className="me-2" />
                    Tin đăng của tôi
                  </Link>
                  <Link to="/messages" className="profile-menu-item" onClick={closeMenu}>
                    <FaEnvelope className="me-2" />
                    Tin nhắn của tôi
                  </Link>
                  <button 
                    className="profile-menu-item text-danger" 
                    onClick={handleLogout}
                  >
                    <FaSignInAlt className="me-2" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <Link to="/login" className="btn nav-icon-btn" title="Đăng nhập" onClick={closeMenu}>
          <FaSignInAlt className="nav-icon" />
        </Link>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdowns, setDropdowns] = useState({});
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Responsive handling
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 991.98);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 991.98);
      if (window.innerWidth > 991.98 && isMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (window.innerWidth <= 991.98 && isMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  // Favorite count
  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavoriteCount(favorites.length);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Toggle dropdown
  const toggleDropdown = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDropdowns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Toggle menu
  const toggleMenu = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsMenuOpen(prevState => {
      const newState = !prevState;
      document.body.classList.toggle('menu-open', newState);
      document.body.classList.toggle('show-overlay', newState);
      return newState;
    });
  };

  // Close menu
  const closeMenu = () => {
    if (!isMenuOpen) return;
    document.body.classList.remove('menu-open', 'show-overlay');
    setIsMenuOpen(false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isMenuOpen) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(e.target)
      ) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // ESC key handler
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isMenuOpen]);

  // Route change handler
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Cleanup
  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open', 'show-overlay');
    };
  }, []);

  // Home click handler
  const handleHomeClick = (e) => {
    if (location.pathname === '/ho-so') {
      e.preventDefault();
      closeMenu();
      document.body.classList.remove('menu-open', 'show-overlay');
      navigate('/');
    } else {
      closeMenu();
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg bg-white navbar-light sticky-top p-0 ${isScrolled ? 'scrolled' : ''}`}>
      <Link
        to="/"
        className="navbar-brand d-flex align-items-center px-4 px-lg-5"
        onClick={handleHomeClick}
      >
        <Logo />
      </Link>

      <button
        ref={toggleButtonRef}
        type="button"
        className={`navbar-toggler me-4 ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle navigation"
        aria-expanded={isMenuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div
        ref={menuRef}
        className={`navbar-collapse ${isMenuOpen ? 'show' : ''}`}
        id="navbarCollapse"
      >
        <NavLinks 
          location={location}
          handleHomeClick={handleHomeClick}
          dropdowns={dropdowns}
          toggleDropdown={toggleDropdown}
          closeMenu={closeMenu}
        />
        <AuthButtons 
          favoriteCount={favoriteCount}
          closeMenu={closeMenu}
        />
      </div>
    </nav>
  );
};

// Add new CSS for chat UI
const styles = `
  .nav-buttons {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .nav-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .notification-icon,
  .chat-icon,
  .nav-icon {
    font-size: 26px !important;
    color: #00B98E;
  }

  .notification-badge,
  .chat-badge {
    position: absolute;
    top: 1px;
    right: 1px;
    background: #ff4757;
    color: white;
    border-radius: 50%;
    padding: 1px 4px;
    font-size: 0.7rem;
    min-width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #fff;
    z-index: 1;
    box-shadow: 0 0 0 1px #fff;
  }

  .profile-avatar {
    width: 38px !important;
    height: 38px !important;
    border-radius: 50%;
    object-fit: cover;
  }

  .profile-avatar-placeholder {
    width: 38px !important;
    height: 38px !important;
    border-radius: 50%;
    background: #00B98E;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px !important;
    font-weight: bold;
  }

  .notification-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 360px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
    overflow: hidden;
  }

  .notification-header {
    padding: 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .notification-tabs {
    display: flex;
    border-bottom: 1px solid #eee;
  }

  .tab-btn {
    flex: 1;
    padding: 10px;
    border: none;
    background: none;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    transition: all 0.3s;
  }

  .tab-btn.active {
    color: #00B98E;
    border-bottom: 2px solid #00B98E;
  }

  .tab-btn .count {
    background: #eee;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 12px;
    margin-left: 5px;
  }

  .notification-list {
    max-height: 360px;
    overflow-y: auto;
  }

  .notification-item {
    padding: 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    gap: 10px;
    transition: background-color 0.3s;
  }

  .notification-item:hover {
    background-color: #f8f9fa;
  }

  .notification-item.unread {
    background-color: #f0f9ff;
  }

  .notification-dot {
    width: 8px;
    height: 8px;
    background: #00B98E;
    border-radius: 50%;
    margin-top: 6px;
  }

  .notification-content {
    flex: 1;
  }

  .notification-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 5px;
  }

  .notification-title span {
    font-weight: 600;
    color: #333;
  }

  .notification-title small {
    color: #999;
    font-size: 12px;
  }

  .notification-content p {
    margin: 0;
    font-size: 14px;
    color: #666;
    line-height: 1.4;
  }

  .notification-actions {
    margin-top: 8px;
    display: flex;
    gap: 10px;
  }

  .notification-footer {
    padding: 12px;
    text-align: center;
    border-top: 1px solid #eee;
  }

  .notification-footer a {
    color: #00B98E;
    text-decoration: none;
    font-size: 14px;
  }

  .notification-footer a:hover {
    text-decoration: underline;
  }

  .chat-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    width: 360px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    z-index: 1000;
    overflow: hidden;
  }

  .chat-header {
    padding: 16px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
  }

  .chat-list {
    max-height: 400px;
    overflow-y: auto;
    padding: 8px 0;
  }

  .chat-item {
    padding: 12px 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .chat-item:hover {
    background: #f8f9fa;
  }

  .chat-item.unread {
    background: #f0f9ff;
  }

  .chat-avatar {
    position: relative;
    width: 48px;
    height: 48px;
  }

  .chat-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  .status-dot {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid #fff;
  }

  .status-dot.online {
    background: #00B98E;
  }

  .status-dot.offline {
    background: #gray;
  }

  .chat-content {
    flex: 1;
    min-width: 0;
  }

  .chat-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .chat-title .name {
    font-weight: 600;
    color: #2d3436;
    font-size: 14px;
  }

  .chat-title .time {
    color: #a0a0a0;
    font-size: 12px;
  }

  .last-message {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }

  .last-message p {
    margin: 0;
    font-size: 13px;
    color: #666;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .unread-badge {
    background: #00B98E;
    color: white;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: 500;
  }

  .chat-input-wrapper {
    padding: 12px 16px;
    border-top: 1px solid #eee;
    background: #fff;
  }

  .chat-input-wrapper .input-group {
    background: #f8f9fa;
    border-radius: 20px;
    padding: 4px;
  }

  .chat-input-wrapper .form-control {
    border: none;
    background: none;
    box-shadow: none;
    padding: 8px 12px;
    font-size: 14px;
  }

  .chat-input-wrapper .form-control:focus {
    outline: none;
  }

  .chat-input-wrapper .btn {
    border-radius: 50%;
    width: 35px;
    height: 35px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-footer {
    padding: 12px 16px;
    text-align: center;
    border-top: 1px solid #eee;
    background: #fff;
  }

  .view-all-link {
    color: #00B98E;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .view-all-link:hover {
    text-decoration: underline;
  }

  .chat-conversation {
    display: flex;
    flex-direction: column;
    height: 400px;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  .message-item {
    display: flex;
    margin-bottom: 12px;
  }

  .message-item.received {
    justify-content: flex-start;
  }

  .message-item.sent {
    justify-content: flex-end;
  }

  .message-content {
    max-width: 70%;
    padding: 8px 12px;
    border-radius: 12px;
    background: #f0f2f5;
  }

  .message-item.sent .message-content {
    background: #00B98E;
    color: white;
  }

  .message-content p {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
  }

  .message-time {
    display: block;
    font-size: 11px;
    color: #65676b;
    margin-top: 4px;
  }

  .message-item.sent .message-time {
    color: rgba(255,255,255,0.8);
  }
`;

// Add style tag to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Navbar;