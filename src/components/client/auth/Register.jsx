import React, { useState, useEffect } from 'react';
// import { Link, useHistory } from 'react-router-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import './Auth.css';
import authService from '../../../services/client/authService';

const Register = () => {
  // const history = useHistory();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Form đăng ký, 2: Nhập OTP, 3: Xác thực thành công
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otpData, setOtpData] = useState({
    otp: '',
    verificationId: '',
    remainingTime: 0
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectTimer, setRedirectTimer] = useState(3); // Đếm ngược 3 giây

  useEffect(() => {
    // Thiết lập interval để đếm ngược thời gian OTP còn lại
    let intervalId;
    if (step === 2 && otpData.remainingTime > 0) {
      intervalId = setInterval(() => {
        setOtpData(prev => ({
          ...prev,
          remainingTime: prev.remainingTime - 1
        }));
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [step, otpData.remainingTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleOtpChange = (e) => {
    const { value } = e.target;
    setOtpData(prev => ({
      ...prev,
      otp: value
    }));
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email không hợp lệ: Vui lòng thêm ký tự "@" vào địa chỉ email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    } else {
      // Kiểm tra thêm các tên miền email phổ biến
      const email = formData.email.toLowerCase();
      if (email.includes('@gmai.') && !email.includes('@gmail.')) {
        newErrors.email = 'Email không hợp lệ (bạn có ý là gmail.com?)';
      } else if (email.includes('@yaho.') && !email.includes('@yahoo.')) {
        newErrors.email = 'Email không hợp lệ (bạn có ý là yahoo.com?)';
      } else if (email.includes('@outlok.') && !email.includes('@outlook.')) {
        newErrors.email = 'Email không hợp lệ (bạn có ý là outlook.com?)';
      } else if (email.includes('@hotmai.') && !email.includes('@hotmail.')) {
        newErrors.email = 'Email không hợp lệ (bạn có ý là hotmail.com?)';
      }
    }
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Bước 1: Đăng ký tài khoản 
      const result = await authService.register(formData);
      console.log('Registration result:', result);
      
      if (result.success) {
        // Kiểm tra nếu API đã tự động gửi OTP và trả về thông tin phiên
        if (result.data && (result.data.sessionId || result.data.verificationId)) {
          console.log('Server returned session data, using it for OTP verification');
          
          // Lấy Session ID và thời gian hết hạn
          const sessionId = result.data.sessionId || result.data.verificationId;
          // Đảm bảo otpExpiry luôn lớn hơn 0, mặc định 5 phút (300 giây)
          let otpExpiry = 300;
          
          if (result.data.otpExpiry && Number.isInteger(result.data.otpExpiry) && result.data.otpExpiry > 0) {
            otpExpiry = result.data.otpExpiry;
          }
          
          console.log(`OTP sẽ hết hạn sau ${otpExpiry} giây`);
          
          // Lưu thông tin session
          const session = authService.saveOtpSession(
            sessionId,
            formData.email,
            'registration',
            otpExpiry
          );

          setOtpData({
            otp: '',
            verificationId: session.sessionId,
            remainingTime: otpExpiry
          });
          
          setStep(2);
          setSuccessMessage('Đăng ký thành công! Vui lòng nhập mã OTP đã được gửi đến email của bạn.');
        } else {
          // Nếu server không tự động gửi OTP, thì gửi yêu cầu OTP riêng
          console.log('Server did not return session data, sending OTP request');
          await sendOtpAfterRegistration();
        }
      } else {
        // Xử lý lỗi đăng ký
        const errorMessage = result.message || 'Đăng ký thất bại';
        if (errorMessage.toLowerCase().includes('email')) {
          if (errorMessage.toLowerCase().includes('exist')) {
            setErrors({ email: 'Email này đã được sử dụng' });
          } else {
            setErrors({ email: errorMessage });
          }
        } else {
          setErrors({ general: errorMessage });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        general: error.message || 'Lỗi kết nối, vui lòng thử lại sau'
      });
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm riêng để gửi OTP sau khi đăng ký
  const sendOtpAfterRegistration = async () => {
    try {
      const otpResult = await authService.sendOtp(formData.email, 'registration');
      console.log('Send OTP result after registration:', otpResult);

      if (otpResult.success && otpResult.data) {
        // Lấy Session ID và thời gian hết hạn
        const sessionId = otpResult.data.sessionId || otpResult.data.verificationId;
        // Đảm bảo otpExpiry luôn lớn hơn 0, mặc định 5 phút (300 giây)
        let otpExpiry = 300;
        
        if (otpResult.data.otpExpiry && Number.isInteger(otpResult.data.otpExpiry) && otpResult.data.otpExpiry > 0) {
          otpExpiry = otpResult.data.otpExpiry;
        }
        
        console.log(`OTP sẽ hết hạn sau ${otpExpiry} giây`);
        
        // Lưu session và cập nhật state
        const session = authService.saveOtpSession(
          sessionId,
          formData.email,
          'registration',
          otpExpiry
        );

        setOtpData({
          otp: '',
          verificationId: session.sessionId,
          remainingTime: otpExpiry
        });
        
        setStep(2);
        setSuccessMessage('Đăng ký thành công! Vui lòng nhập mã OTP đã được gửi đến email của bạn.');
      } else {
        throw new Error(otpResult.message || 'Không thể gửi mã OTP');
      }
    } catch (error) {
      console.error('Error sending OTP after registration:', error);
      throw error;
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpData.otp) {
      setErrors({ otp: 'Vui lòng nhập mã OTP' });
      return;
    }

    const session = authService.getOtpSession();
    if (!session || !session.sessionId) {
      setErrors({ otp: 'Phiên xác thực không hợp lệ hoặc đã hết hạn' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await authService.verifyOtp(
        session.email,
        otpData.otp,
        session.sessionId
      );

      if (result.success) {
        authService.clearOtpSession();
        setStep(3);
        setSuccessMessage('Xác thực tài khoản thành công!');
        
        // Bắt đầu đếm ngược để chuyển trang
        const timer = setInterval(() => {
          setRedirectTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              // history.push('/login', {
              //   message: 'Xác thực thành công! Vui lòng đăng nhập.'
              // });

              navigate('/login', { 
                state: { 
                  message: 'Xác thực thành công! Vui lòng đăng nhập.' 
                } 
              });
              
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        throw new Error(result.message || 'Mã OTP không đúng');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setErrors({ 
        otp: error.message || 'Lỗi xác thực, vui lòng thử lại'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isLoading || otpData.remainingTime > 0) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await authService.sendOtp(formData.email, 'registration');
      
      if (result.success && result.data) {
        // Lấy Session ID và thời gian hết hạn
        const sessionId = result.data.sessionId || result.data.verificationId;
        // Đảm bảo otpExpiry luôn lớn hơn 0, mặc định 5 phút (300 giây)
        let otpExpiry = 300;
        
        if (result.data.otpExpiry && Number.isInteger(result.data.otpExpiry) && result.data.otpExpiry > 0) {
          otpExpiry = result.data.otpExpiry;
        }
        
        console.log(`OTP mới sẽ hết hạn sau ${otpExpiry} giây`);
        
        // Lưu session và cập nhật state
        const session = authService.saveOtpSession(
          sessionId,
          formData.email,
          'registration',
          otpExpiry
        );

        setOtpData({
          otp: '',
          verificationId: session.sessionId,
          remainingTime: otpExpiry
        });

        setSuccessMessage('Mã OTP mới đã được gửi đến email của bạn');
      } else {
        throw new Error(result.message || 'Không thể gửi lại mã OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setErrors({ 
        general: error.message || 'Lỗi kết nối, vui lòng thử lại sau'
      });
    } finally {
      setIsLoading(false);
    }
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
              <h2>Đăng Ký</h2>
              {errors.general && <div className="general-error">{errors.general}</div>}
              {successMessage && <div className="success-message">{successMessage}</div>}
              
              <div className={`input-group ${errors.fullName ? 'has-error' : ''}`}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và tên"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <div className="input-label">Họ và tên</div>
                {errors.fullName && <div className="input-error-message">{errors.fullName}</div>}
              </div>

              <div className={`input-group ${errors.phoneNumber ? 'has-error' : ''}`}>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Số điện thoại"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                <div className="input-label">Số điện thoại</div>
                {errors.phoneNumber && <div className="input-error-message">{errors.phoneNumber}</div>}
              </div>
              
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
                  <div className="input-error-message">
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
                {errors.password && <div className="input-error-message">{errors.password}</div>}
              </div>
              
              <div className={`input-group ${errors.confirmPassword ? 'has-error' : ''}`}>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <div className="input-label">Xác nhận mật khẩu</div>
                {errors.confirmPassword && <div className="input-error-message">{errors.confirmPassword}</div>}
              </div>
              
              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Đăng Ký Ngay'}
              </button>
              
              <div className="auth-links">
                <p>Đã có tài khoản? <Link to="/login">Đăng Nhập</Link></p>
              </div>
              
              <div className="home-button">
                <Link to="/">
                  <i className="fas fa-arrow-left"></i>
                  Trở về trang chủ
                </Link>
              </div>
            </form>
          ) : step === 2 ? (
            <form className="auth-form-container" onSubmit={handleVerifyOtp}>
              <h2>Xác Thực OTP</h2>
              {errors.general && <div className="general-error">{errors.general}</div>}
              {successMessage && <div className="success-message">{successMessage}</div>}
              
              <p className="text-center mb-4">
                Vui lòng nhập mã OTP đã được gửi đến email {formData.email}
              </p>
              
              <div className={`input-group ${errors.otp ? 'has-error' : ''}`}>
                <input
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otpData.otp}
                  onChange={handleOtpChange}
                  maxLength={6}
                />
                <div className="input-label">Mã OTP</div>
                {errors.otp && <div className="input-error-message">{errors.otp}</div>}
              </div>
              
              {otpData.remainingTime <= 0 ? (
                <div className="alert alert-warning">
                  <p className="m-0">Mã OTP đã hết hạn, vui lòng yêu cầu gửi lại</p>
                </div>
              ) : (
                <div className="alert alert-info">
                  <p className="m-0">Mã OTP sẽ hết hạn sau: {otpData.remainingTime} giây</p>
                </div>
              )}
              
              <button type="submit" className="auth-button" disabled={isLoading || otpData.remainingTime <= 0}>
                {isLoading ? 'Đang xử lý...' : 'Xác Nhận'}
              </button>
              
              <div className="auth-links">
                <button 
                  type="button" 
                  className="btn btn-link" 
                  onClick={handleResendOtp}
                  disabled={isLoading || otpData.remainingTime > 0}
                >
                  Gửi lại mã OTP
                  {otpData.remainingTime > 0 && ` (${otpData.remainingTime}s)`}
                </button>
              </div>
              
              <div className="home-button">
                <Link to="/">
                  <i className="fas fa-arrow-left"></i>
                  Trở về trang chủ
                </Link>
              </div>
            </form>
          ) : (
            <div className="auth-form-container">
              <h2>Xác Thực Thành Công</h2>
              <div className="success-message text-center">
                <i className="bi bi-check-circle-fill" style={{ fontSize: '48px', color: '#00B98E' }}></i>
                <p className="mt-3">{successMessage}</p>
                <p>Tự động chuyển đến trang đăng nhập sau {redirectTimer} giây...</p>
                <Link to="/login" className="auth-button mt-4" style={{ display: 'inline-block', textDecoration: 'none' }}>
                  Đăng Nhập Ngay
                </Link>
              </div>
              
              <div className="home-button mt-4">
                <Link to="/">
                  <i className="fas fa-arrow-left"></i>
                  Trở về trang chủ
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;