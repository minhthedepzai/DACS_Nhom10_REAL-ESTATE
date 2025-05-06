import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import userService from '../../../services/client/userService';
import authService from '../../../services/client/authService';
import './PersonalInfo.css';

const PersonalInfo = () => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Kiểm tra xem có token không
      const token = authService.getToken();
      if (!token) {
        setError('Vui lòng đăng nhập để xem thông tin');
        return;
      }

      const data = await userService.getUserInfo();
      console.log('Received user data:', data);

      // Kiểm tra và xử lý dữ liệu
      if (data && (data.data || data)) {
        setUserData(data.data || data);
      } else {
        throw new Error('Không nhận được dữ liệu hợp lệ từ server');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi ảnh đại diện
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB
        alert('Kích thước file không được vượt quá 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý gửi biểu mẫu
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate dữ liệu trước khi gửi
      if (!userData.fullName?.trim()) {
        throw new Error('Vui lòng nhập họ tên');
      }

      const response = await userService.updateUserInfo(userData);
      console.log('Update response:', response);

      if (response && (response.data || response)) {
        setUserData(response.data || response);
        setEditMode(false);
        alert('Cập nhật thông tin thành công!');
      } else {
        throw new Error('Không nhận được phản hồi hợp lệ từ server');
      }
    } catch (err) {
      console.error('Error updating user info:', err);
      setError(err.message || 'Không thể cập nhật thông tin');
      alert('Không thể cập nhật thông tin: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi dữ liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
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
    <form onSubmit={handleSubmit}>
      <div className="row g-4">
        {/* Avatar section */}
        <div className="col-12">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-center">
                <div className="avatar-wrapper me-3">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt="Avatar" className="avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      <i className="bi bi-person"></i>
                    </div>
                  )}
                  {editMode && (
                    <div className="avatar-overlay">
                      <label htmlFor="avatar-upload" className="upload-label">
                        <i className="bi bi-camera"></i>
                      </label>
                      <input
                        type="file"
                        id="avatar-upload"
                        className="d-none"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <h5 className="mb-1 text-center">Ảnh đại diện</h5>
                  <p className="text-muted small mb-0 text-center">
                    Cho phép *.jpeg, *.jpg, *.png, dung lượng tối đa 2MB
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Personal Info section */}
        <div className="col-12">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Thông tin cá nhân</h5>
                {!editMode ? (
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-primary p-0"
                    onClick={() => setEditMode(true)}
                    style={{
                      fontSize: '14px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#0056b3';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="bi bi-pencil-square me-1"></i>
                    Chỉnh sửa
                  </button>
                ) : (
                  <div>
                    <button
                      type="button"
                      className="btn btn-link btn-sm text-secondary me-2"
                      onClick={() => {
                        setEditMode(false);
                        fetchUserData();
                      }}
                      style={{
                        fontSize: '14px',
                        textDecoration: 'none'
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="btn btn-sm"
                      style={{
                        backgroundColor: '#00B98E',
                        color: 'white',
                        fontSize: '14px',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        border: 'none'
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check2 me-1"></i>
                          Lưu
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label"></label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    value={userData.fullName || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label"></label>
                  <input
                    type="email"
                    className="form-control"
                    value={userData.email || ''}
                    disabled
                  />
                  {userData.isEmailVerified && (
                    <div className="form-text text-success">
                      <i className="bi bi-check-circle me-1"></i>
                      Đã xác thực
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label"></label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phoneNumber"
                    value={userData.phoneNumber || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                    pattern="[0-9]{10}"
                    title="Số điện thoại phải có 10 chữ số"
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default PersonalInfo; 