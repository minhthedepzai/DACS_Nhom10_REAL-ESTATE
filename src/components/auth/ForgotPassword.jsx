import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import AuthNavbar from '../layout/AuthNavbar';
import './Auth.css';

const ForgotPassword = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Quên mật khẩu | Makaan";
  }, []);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setLoading(true);
    
    // Giả lập gửi yêu cầu đặt lại mật khẩu
    setTimeout(() => {
      console.log('Yêu cầu đặt lại mật khẩu cho:', email);
      setLoading(false);
      setIsSubmitted(true);
    }, 1000);
  }, [email]);

  const navigateToLogin = useCallback(() => {
    history.push('/login');
  }, [history]);

  return (
    <>
      <AuthNavbar />
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="auth-form-container p-5">
                {!isSubmitted ? (
                  <>
                    <h1 className="mb-4">Quên Mật Khẩu</h1>
                    <p className="mb-4">Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu</p>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="Nhập email của bạn"
                          disabled={loading}
                          required
                        />
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
                        ) : 'Gửi Yêu Cầu'}
                      </button>
                      <p className="text-center">
                        <button 
                          type="button" 
                          className="btn btn-link text-primary p-0 border-0 bg-transparent"
                          onClick={navigateToLogin}
                        >
                          Quay lại đăng nhập
                        </button>
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="success-icon mb-4">
                      <i className="bi bi-check-circle-fill fa-4x text-success" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h2 className="mb-4">Yêu cầu đã được gửi!</h2>
                    <p className="mb-4">
                      Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email {email}. 
                      Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn.
                    </p>
                    <button 
                      className="btn btn-primary py-3 px-5"
                      onClick={navigateToLogin}
                    >
                      Quay lại đăng nhập
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword; 