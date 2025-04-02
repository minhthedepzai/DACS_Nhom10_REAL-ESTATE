import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthNavbar from '../layout/AuthNavbar';
import './Auth.css';

const Login = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);

  const { email, password, rememberMe } = formData;

  useEffect(() => {
    // Đảm bảo tài liệu CSS đã được tải
    document.title = "Đăng nhập | Makaan";
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setLoading(true);
    
    // Giả lập xử lý đăng nhập
    setTimeout(() => {
      console.log('Đăng nhập với:', formData);
      setLoading(false);
      // Chuyển hướng sau khi đăng nhập thành công
      history.push('/profile');
    }, 1000);
  }, [formData, history]);

  const navigateToRegister = useCallback(() => {
    history.push('/register');
  }, [history]);

  const navigateToForgotPassword = useCallback(() => {
    history.push('/forgot-password');
  }, [history]);

  return (
    <>
      <AuthNavbar />
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="auth-image">
                <img src="/img/login.svg" className="img-fluid" alt="Login" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="auth-form-container p-5">
                <h1 className="mb-4">Đăng Nhập</h1>
                <p className="mb-4">Vui lòng đăng nhập để truy cập tài khoản của bạn</p>
                
                <form onSubmit={handleSubmit}>
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
                  <div className="mb-3 d-flex justify-content-between">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        name="rememberMe"
                        checked={rememberMe}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Ghi nhớ đăng nhập
                      </label>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-link text-primary p-0 border-0 bg-transparent"
                      onClick={navigateToForgotPassword}
                      disabled={loading}
                    >
                      Quên mật khẩu?
                    </button>
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
                    ) : 'Đăng Nhập'}
                  </button>
                  <p className="text-center">
                    Chưa có tài khoản? {' '}
                    <button 
                      type="button" 
                      className="btn btn-link text-primary p-0 border-0 bg-transparent"
                      onClick={navigateToRegister}
                    >
                      Đăng ký ngay
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

export default Login; 