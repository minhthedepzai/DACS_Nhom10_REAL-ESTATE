import React, { useState, useEffect } from 'react';
// import { Link, useHistory, useLocation } from 'react-router-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import './Auth.css';
// import authService from '../../services/authService';
import authService from '../../../services/client/authService';

const Login = () => {
  // const history = useHistory();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1); // 1: Email+Pass, 2: OTP

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    // Đảm bảo tài liệu CSS đã được tải
    document.title = "Đăng nhập | Makaan";
  }, []);

  useEffect(() => {
    // Kiểm tra nếu có message từ trang đăng ký chuyển qua
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
    }

    // Kiểm tra nếu có phiên đăng nhập đang diễn ra
    const session = authService.getCurrentSession();
    if (session && session.purpose === 'login') {
      setFormData(prevData => ({
        ...prevData,
        email: session.email
      }));
      setStep(2);
      setRemainingTime(session.remainingSeconds);
    }
  }, [location.state]);

  useEffect(() => {
    // Đếm ngược thời gian hết hạn OTP
    if (remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (remainingTime === 0 && step === 2 && otpCode !== '') {
      // Chỉ hiển thị thông báo hết hạn khi đã nhập OTP và hết thời gian
      setOtpError('Mã OTP đã hết hạn, vui lòng yêu cầu gửi lại');
    }
  }, [remainingTime, step, otpCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email không hợp lệ: Vui lòng thêm ký tự "@" vào địa chỉ email';
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // Bước 1: Gửi thông tin đăng nhập
      const result = await authService.login(formData.email, formData.password);

      console.log("Login API response:", result);

      if (result.success) {
        // Kiểm tra nếu API đã trả về thông báo cần nhập OTP
        if (result.message && result.message.includes("OTP")) {
          // Chuyển sang form OTP
          setStep(2);
          setSuccessMessage(result.message || 'Vui lòng nhập mã OTP đã được gửi đến email của bạn');

          // Lấy Session ID và thời gian hết hạn
          let sessionId = null;
          let otpExpiry = 300; // 5 phút mặc định

          if (result.data && result.data.sessionId) {
            sessionId = result.data.sessionId;
            if (result.data.otpExpiry && Number.isInteger(result.data.otpExpiry) && result.data.otpExpiry > 0) {
              otpExpiry = result.data.otpExpiry;
            }
          } else if (result.sessionId) {
            sessionId = result.sessionId;
            if (result.otpExpiry && Number.isInteger(result.otpExpiry) && result.otpExpiry > 0) {
              otpExpiry = result.otpExpiry;
            }
          }

          console.log(`OTP sẽ hết hạn sau ${otpExpiry} giây`);

          // Lưu thông tin phiên OTP từ kết quả login
          if (sessionId) {
            authService.saveOtpSession(
              sessionId,
              formData.email,
              'login',
              otpExpiry
            );
          }

          // Cập nhật thời gian còn lại
          setRemainingTime(otpExpiry);
          return;
        }

        // Nếu không yêu cầu OTP và login thành công, chuyển đến trang chủ
        // history.push('/');
        navigate('/');
      } else {
        if (result.message && result.message.toLowerCase().includes('not found')) {
          setErrors({ general: 'Tài khoản không tồn tại trong hệ thống' });
        } else if (result.message && result.message.toLowerCase().includes('inactive')) {
          setErrors({ general: 'Tài khoản đã bị vô hiệu hóa' });
        } else if (result.reason) {
          setErrors({ general: 'Tài khoản bị khóa: ' + result.reason });
        } else if (result.message && result.message.toLowerCase().includes('khóa')) {
          setErrors({ general: result.message });
        } else {
          setErrors({ general: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 404) {
        setErrors({ general: 'Tài khoản không tồn tại trong hệ thống' });
      } else if (error.response && error.response.data && error.response.data.reason) {
        setErrors({ general: 'Tài khoản bị khóa: ' + error.response.data.reason });
      } else if (error.message && error.message.toLowerCase().includes('khóa')) {
        setErrors({ general: error.message });
      } else if (error.response && error.response.data && error.response.data.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Tên đăng nhập hoặc mật khẩu không đúng hoặc tài khoản đã bị khóa' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      setOtpError('Vui lòng nhập mã OTP');
      return;
    }

    setIsLoading(true);
    setOtpError('');

    try {
      const session = authService.getCurrentSession();
      console.log("Current session:", session);
      if (!session) {
        setOtpError('Phiên xác thực đã hết hạn, vui lòng đăng nhập lại');
        setStep(1);
        return;
      }

      // Lấy ID xác thực đúng từ session (có thể là sessionId hoặc verificationId)
      const verificationId = session.verificationId || session.sessionId;

      if (!verificationId) {
        console.error("Không tìm thấy ID xác thực trong session:", session);
        setOtpError('Không tìm thấy mã xác thực, vui lòng đăng nhập lại');
        setStep(1);
        return;
      }

      console.log("Verifying OTP with:", {
        email: session.email,
        otp: otpCode,
        verificationId: verificationId
      });

      const result = await authService.verifyOtp(
        session.email,
        otpCode,
        verificationId
      );

      console.log("Verify OTP result:", result);

      if (result.success) {
        // Xóa phiên OTP
        authService.clearSession();
        // Chuyển hướng đến trang chủ
        // history.push('/');
        navigate('/');
      } else {
        setOtpError(result.message || 'Mã OTP không đúng');
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      setOtpError('Lỗi kết nối, vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setIsLoading(true);
      const result = await authService.sendOtp(formData.email, 'login');
      if (result.success) {
        // Lấy sessionId từ kết quả API
        const sessionId = result.sessionId || result.data?.sessionId;
        const otpExpiry = 300; // 5 phút mặc định

        setOtpCode(''); // Reset mã OTP

        // Lưu phiên OTP mới
        authService.saveOtpSession(
          sessionId,
          formData.email,
          'login',
          otpExpiry
        );

        // Cập nhật thời gian còn lại
        setRemainingTime(otpExpiry);
        setSuccessMessage('Mã OTP mới đã được gửi đến email của bạn.');
        setOtpError(null);
      } else {
        setOtpError(result.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setOtpError('Đã xảy ra lỗi khi gửi lại mã OTP. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Format thời gian hết hạn
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="container-xxl bg-white p-0">
      <div className="container py-5" style={{
        marginTop: "0",
        padding: "0 clamp(10px, 3vw, 15px)"
      }}>
        <div className="auth-wrapper">
          <div className="auth-image-container">
            <img src="/img/property-1.jpg" alt="Bất động sản" />
            <div className="auth-image-overlay">
              <div className="auth-image-quote">Tìm ngôi nhà mơ ước của bạn cùng Makaan</div>
              <div className="auth-image-text">Chúng tôi cung cấp dịch vụ môi giới bất động sản hàng đầu, với đội ngũ chuyên viên giàu kinh nghiệm sẽ giúp bạn tìm được ngôi nhà lý tưởng.</div>
              <button className="auth-image-explore">Khám phá ngay</button>
            </div>
          </div>

          {step === 1 ? (
            <form className="auth-form-container" onSubmit={handleSubmit}>
              <h2>Đăng Nhập</h2>
              {errors.general && <div className="general-error">{errors.general}</div>}
              {successMessage && <div className="success-message">{successMessage}</div>}

              <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  onInvalid={(e) => e.preventDefault()}
                  pattern=".*"
                />
                <div className="input-label">Email</div>
                {errors.email && (
                  // <div className="input-error-message" style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                  <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                    {errors.email}
                  </div>
                )}
              </div>

              <div className={`input-group ${errors.password ? 'has-error' : ''}`}>
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="input-label">Mật khẩu</div>

                {errors.password &&
                  // <div className="input-error-message">
                  <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                    {errors.password}
                  </div>}
              </div>

              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
              </button>

              <div className="auth-links">
                <Link to="/forgot-password">Quên mật khẩu?</Link>
                <p>Chưa có tài khoản? <Link to="/register">Đăng Ký</Link></p>
              </div>

              <div className="home-button">
                <Link to="/">
                  <i className="fas fa-arrow-left"></i>
                  Trở về trang chủ
                </Link>
              </div>
            </form>
          ) : (
            <form className="auth-form-container" onSubmit={handleVerifyOtp}>
              <h2>Xác Thực OTP</h2>
              {otpError && <div className="error-message">{otpError}</div>}
              {successMessage && <div className="success-message">{successMessage}</div>}

              <p className="text-center mb-4">
                Vui lòng nhập mã OTP đã được gửi đến email {formData.email}
              </p>

              <div className={`input-group ${otpError ? 'has-error' : ''}`}>
                <input
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength={6}
                />
                <div className="input-label">Mã OTP</div>
                {otpError && <div className="input-error-message">{otpError}</div>}
              </div>

              {remainingTime > 0 ? (
                <div className="alert alert-info">
                  <p className="m-0">Mã OTP sẽ hết hạn sau: {formatTime(remainingTime)}</p>
                </div>
              ) : otpCode ? (
                <div className="alert alert-warning">
                  <p className="m-0">Mã OTP đã hết hạn, vui lòng yêu cầu gửi lại</p>
                </div>
              ) : null}

              <button type="submit" className="auth-button" disabled={isLoading || remainingTime <= 0}>
                {isLoading ? 'Đang xử lý...' : 'Xác Nhận'}
              </button>

              <div className="auth-links">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={resendOTP}
                  disabled={isLoading || remainingTime > 0}
                >
                  Gửi lại mã OTP
                  {remainingTime > 0 && ` (${formatTime(remainingTime)})`}
                </button>
              </div>

              <div className="home-button">
                <Link to="/">
                  <i className="fas fa-arrow-left"></i>
                  Trở về trang chủ
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 