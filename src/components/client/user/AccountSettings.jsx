import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Row, Col, Nav } from 'react-bootstrap';
import { FaUser, FaLock, FaBell, FaShieldAlt, FaHome, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import '../css/Profile.css';

const AccountSettings = () => {
  // Các state quản lý form và giao diện
  const [formData, setFormData] = useState({
    email: 'user@example.com',
    phone: '0912345678',
    language: 'vi',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    },
    twoFactorAuth: false,
    dataSharing: false
  });

  const [activeTab, setActiveTab] = useState('general');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVariant, setAlertVariant] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Thêm useEffect để ẩn tiêu đề trên cùng
  useEffect(() => {
    // Tìm và ẩn tiêu đề trên cùng (dựa vào cấu trúc HTML của trang)
    const topTitles = document.querySelectorAll('h1');
    topTitles.forEach(title => {
      // Chỉ ẩn tiêu đề đầu tiên nếu không phải là tiêu đề trong settings-header
      if (!title.closest('.settings-header') && title.textContent.includes('Cài đặt tài khoản')) {
        title.style.display = 'none';
      }
    });

    // Hoặc tìm theo selector cụ thể hơn
    const topGearIcon = document.querySelector('.container-xxl > div:first-child > .container > h1');
    if (topGearIcon) {
      topGearIcon.style.display = 'none';
    }

    // Cleanup khi component unmount
    return () => {
      topTitles.forEach(title => {
        if (!title.closest('.settings-header') && title.textContent.includes('Cài đặt tài khoản')) {
          title.style.display = '';
        }
      });
      if (topGearIcon) {
        topGearIcon.style.display = '';
      }
    };
  }, []);

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: checked
          }
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Hiển thị thông báo
  const showNotification = (message, variant = 'success') => {
    setAlertVariant(variant);
    setAlertMessage(message);
    setShowAlert(true);
    
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // Xử lý lưu cài đặt
  const handleSubmit = (e) => {
    e.preventDefault();
    showNotification('Đã lưu thay đổi thành công!');
  };

  // Xử lý đổi mật khẩu
  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu mới phải khớp với xác nhận mật khẩu
    if (formData.newPassword !== formData.confirmPassword) {
      showNotification('Mật khẩu mới và xác nhận mật khẩu không khớp!', 'danger');
      return;
    }
    
    // Kiểm tra độ dài mật khẩu
    if (formData.newPassword.length < 8) {
      showNotification('Mật khẩu mới phải có ít nhất 8 ký tự!', 'danger');
      return;
    }
    
    // Thực hiện gọi API đổi mật khẩu ở đây
    
    // Reset form sau khi đổi mật khẩu thành công
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    showNotification('Đổi mật khẩu thành công!');
  };

  // Chuyển đổi hiển thị mật khẩu
  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  // Xóa tài khoản
  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    showNotification('Tài khoản đã được yêu cầu xóa!', 'warning');
  };

  // Render nội dung theo tab đang active
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="tab-content-section">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="form-label">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="form-label">Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="form-label">Ngôn ngữ</Form.Label>
                <Form.Select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" className="btn-save">
                Lưu thay đổi
              </Button>
            </Form>
          </div>
        );
        
      case 'security':
        return (
          <div className="tab-content-section">
            <Form onSubmit={handlePasswordChange}>
              <Form.Group className="mb-3 position-relative">
                <Form.Label>Mật khẩu hiện tại</Form.Label>
                <div className="password-input-wrapper">
                  <Form.Control
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                  <Button 
                    variant="link" 
                    className="password-toggle-icon"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3 position-relative">
                <Form.Label>Mật khẩu mới</Form.Label>
                <div className="password-input-wrapper">
                  <Form.Control
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                  <Button 
                    variant="link" 
                    className="password-toggle-icon"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>
              
              <Form.Group className="mb-4 position-relative">
                <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                <div className="password-input-wrapper">
                  <Form.Control
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                  <Button 
                    variant="link" 
                    className="password-toggle-icon"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>
              
              <Button type="submit" className="btn-save">
                Đổi mật khẩu
              </Button>
            </Form>
            
            <div className="mt-4">
              <Form.Check
                type="switch"
                id="two-factor-auth"
                name="twoFactorAuth"
                label="Bật xác thực hai yếu tố"
                checked={formData.twoFactorAuth}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="tab-content-section">
            <Form.Check
              type="switch"
              id="email-notifications"
              name="notifications.email"
              label="Nhận thông báo qua email"
              checked={formData.notifications.email}
              onChange={handleInputChange}
              className="mb-2"
            />
            
            <Form.Check
              type="switch"
              id="sms-notifications"
              name="notifications.sms"
              label="Nhận thông báo qua SMS"
              checked={formData.notifications.sms}
              onChange={handleInputChange}
              className="mb-2"
            />
            
            <Form.Check
              type="switch"
              id="push-notifications"
              name="notifications.push"
              label="Nhận thông báo trong ứng dụng"
              checked={formData.notifications.push}
              onChange={handleInputChange}
              className="mb-2"
            />
            
            <Form.Check
              type="switch"
              id="marketing-notifications"
              name="notifications.marketing"
              label="Nhận thông báo về tiếp thị và khuyến mãi"
              checked={formData.notifications.marketing}
              onChange={handleInputChange}
              className="mb-2"
            />
            
            <div className="d-flex justify-content-end mt-4">
              <Button className="btn-save" onClick={() => showNotification('Đã lưu cài đặt thông báo')}>
                Lưu thay đổi
              </Button>
            </div>
          </div>
        );
        
      case 'privacy':
        return (
          <div className="tab-content-section">
            <Form.Check
              type="switch"
              id="data-sharing"
              name="dataSharing"
              label="Cho phép chia sẻ dữ liệu"
              checked={formData.dataSharing}
              onChange={handleInputChange}
              className="mb-3"
            />
            
            <div className="privacy-info-box mt-4">
              <p>
                Dữ liệu của bạn được bảo vệ theo chính sách bảo mật của chúng tôi. 
                Bạn có thể yêu cầu xuất hoặc xóa dữ liệu của mình bất kỳ lúc nào.
              </p>
              
              <div className="d-flex mt-3">
                <Button 
                  variant="outline-primary" 
                  className="me-2"
                  onClick={() => showNotification('Đã gửi yêu cầu xuất dữ liệu. Vui lòng kiểm tra email.')}
                >
                  Xuất dữ liệu
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Xóa tài khoản
                </Button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="settings-wrapper">
      <Container className="settings-container">
        {/* Main Content */}
        <div className="settings-box">
          {showAlert && (
            <Alert 
              variant={alertVariant} 
              className="alert-animation"
              onClose={() => setShowAlert(false)} 
              dismissible
            >
              {alertMessage}
            </Alert>
          )}

          <div className="settings-header">
            {/* <FiSettings className="settings-header-icon" /> */}
            <h1 className="settings-header-title">Tùy chỉnh</h1>
          </div>

          <Nav variant="tabs" className="settings-tabs mb-4">
            <Nav.Item>
              <Nav.Link 
                className={activeTab === 'general' ? 'active' : ''} 
                onClick={() => setActiveTab('general')}
              >
                <FaUser className="tab-icon" />
                <span>Thông tin chung</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                className={activeTab === 'security' ? 'active' : ''} 
                onClick={() => setActiveTab('security')}
              >
                <FaLock className="tab-icon" />
                <span>Bảo mật</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                className={activeTab === 'notifications' ? 'active' : ''} 
                onClick={() => setActiveTab('notifications')}
              >
                <FaBell className="tab-icon" />
                <span>Thông báo</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                className={activeTab === 'privacy' ? 'active' : ''} 
                onClick={() => setActiveTab('privacy')}
              >
                <FaShieldAlt className="tab-icon" />
                <span>Quyền riêng tư</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <div className="settings-content">
            {renderTabContent()}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AccountSettings; 