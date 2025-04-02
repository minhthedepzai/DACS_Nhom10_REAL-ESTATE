import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import AuthNavbar from '../layout/AuthNavbar';
import './Auth.css';

const Register = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { fullName, email, password, confirmPassword, agreeTerms } = formData;

  useEffect(() => {
    document.title = "Đăng ký | Makaan";
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập
    if (error) setError('');
  }, [error]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp. Vui lòng thử lại.');
      return;
    }
    
    setLoading(true);
    
    // Giả lập xử lý đăng ký
    setTimeout(() => {
      console.log('Đăng ký với:', formData);
      setLoading(false);
      // Chuyển hướng sau khi đăng ký thành công
      history.push('/login');
    }, 1000);
  }, [formData, password, confirmPassword, history]);

  const navigateToLogin = useCallback(() => {
    history.push('/login');
  }, [history]);

  const navigateToTerms = useCallback(() => {
    history.push('/terms');
  }, [history]);

  return (
    <>
      <AuthNavbar />
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 d-none d-lg-block">
              <div className="auth-image">
                <img src="/img/register.svg" className="img-fluid" alt="Register" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="auth-form-container p-5">
                <h1 className="mb-4">Đăng Ký</h1>
                <p className="mb-4">Tạo tài khoản để truy cập đầy đủ tính năng</p>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Họ và tên</label>
                    <input
                      type="text"
                      className="form-control"
                      id="fullName"
                      name="fullName"
                      value={fullName}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên của bạn"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Nhập email của bạn"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu của bạn"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu của bạn"
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={agreeTerms}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                    <label className="form-check-label" htmlFor="agreeTerms">
                      Tôi đồng ý với {' '}
                      <button 
                        type="button" 
                        className="btn btn-link text-primary p-0 border-0 bg-transparent"
                        onClick={navigateToTerms}
                      >
                        Điều khoản sử dụng
                      </button>
                    </label>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-3 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang xử lý...
                      </span>
                    ) : 'Đăng Ký'}
                  </button>
                  <p className="text-center">
                    Đã có tài khoản? {' '}
                    <button 
                      type="button" 
                      className="btn btn-link text-primary p-0 border-0 bg-transparent"
                      onClick={navigateToLogin}
                    >
                      Đăng nhập ngay
                    </button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;