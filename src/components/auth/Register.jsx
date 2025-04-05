import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Auth.css';
import authService from '../../services/authService';

const Register = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);

  // Kiểm tra phiên đăng ký khi tải trang
  useEffect(() => {
    const session = authService.getCurrentSession();
    
    // Nếu có phiên đăng ký tồn tại
    if (session && session.purpose === 'registration') {
      setFormData(prevData => ({
        ...prevData,
        email: session.email
      }));
      setShowOtpForm(true);
      setRemainingTime(session.remainingSeconds);
    }
  }, []);

  // Đếm ngược thời gian OTP
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (remainingTime === 0 && showOtpForm) {
      // OTP đã hết hạn
      setOtpError('Mã OTP đã hết hạn, vui lòng yêu cầu gửi lại');
    }
  }, [remainingTime, showOtpForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Kiểm tra họ tên
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên đầy đủ';
    }
    
    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    // Kiểm tra số điện thoại
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    
    // Kiểm tra mật khẩu
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    // Kiểm tra xác nhận mật khẩu
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
    
    try {
      const result = await authService.register(formData);
      
      if (result.success) {
        // Kiểm tra cấu trúc dữ liệu trả về
        if (result.data && result.data.sessionId) {
          setShowOtpForm(true);
          // Lấy thông tin phiên từ localStorage
          const session = authService.getCurrentSession();
          if (session) {
            setRemainingTime(session.remainingSeconds);
          }
        } else {
          setErrors({ general: 'Có lỗi xảy ra trong quá trình xử lý, vui lòng thử lại sau' });
          console.error('API response missing expected data structure:', result);
        }
      } else {
        setErrors({ general: result.message || result.error || 'Đăng ký thất bại, vui lòng thử lại' });
      }
    } catch (error) {
      setErrors({ general: 'Lỗi kết nối, vui lòng thử lại sau' });
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpCode.trim()) {
      setOtpError('Vui lòng nhập mã OTP');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Lấy thông tin phiên từ localStorage
      const session = authService.getCurrentSession();
      
      if (!session) {
        setOtpError('Phiên xác thực đã hết hạn, vui lòng đăng ký lại');
        setIsLoading(false);
        return;
      }
      
      console.log('Sending OTP verification with:', {
        email: session.email,
        sessionId: session.sessionId,
        otp: otpCode
      });
      
      // Thử nhiều cấu trúc request khác nhau để tìm cấu trúc phù hợp với backend
      let response;
      
      // Cấu trúc 1: Sử dụng sessionId (phổ biến nhất)
      try {
        response = await fetch('https://localhost:7125/api/Auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: session.email,
            sessionId: session.sessionId,
            otp: otpCode
          }),
        });
        
        if (!response.ok) {
          console.log('Cấu trúc 1 không thành công, thử cấu trúc 2...');
          throw new Error('Thử cấu trúc request tiếp theo');
        }
      } catch (err) {
        // Cấu trúc 2: Sử dụng verificationId thay vì sessionId
        try {
          response = await fetch('https://localhost:7125/api/Auth/verify-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: session.email,
              verificationId: session.sessionId,
              otp: otpCode
            }),
          });
          
          if (!response.ok) {
            console.log('Cấu trúc 2 không thành công, thử cấu trúc 3...');
            throw new Error('Thử cấu trúc request tiếp theo');
          }
        } catch (err2) {
          // Cấu trúc 3: Đơn giản hóa, chỉ gửi ba trường chính
          response = await fetch('https://localhost:7125/api/Auth/verify-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: session.email,
              code: otpCode,
              token: session.sessionId
            }),
          });
        }
      }
      
      // Kiểm tra kết quả từ API
      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        // Nếu không phải JSON, thử đọc dưới dạng text
        const textResponse = await response.text();
        responseData = { success: response.ok, message: textResponse };
      }
      
      console.log('OTP verification API response:', responseData);
      
      if (response.ok || (responseData && responseData.success === true)) {
        // Đăng ký và xác thực OTP thành công, chuyển hướng đến trang đăng nhập
        // Xóa thông tin phiên OTP
        authService.clearSession();
        
        history.push('/login', { 
          message: 'Đăng ký thành công! Vui lòng đăng nhập bằng tài khoản của bạn.' 
        });
      } else {
        // Kiểm tra nếu OTP hết hạn
        if (responseData && responseData.message && (
          responseData.message.includes('hết hạn') || 
          responseData.message.includes('expired') ||
          responseData.message.includes('invalid')
        )) {
          setOtpError('Mã OTP không hợp lệ hoặc đã hết hạn, vui lòng thử lại');
          setRemainingTime(0);
        } else {
          // Các lỗi khác
          setOtpError(responseData ? (responseData.message || 'Xác thực OTP thất bại') : 'Lỗi xác thực OTP');
        }
      }
    } catch (error) {
      setOtpError('Lỗi kết nối, vui lòng thử lại sau');
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    setOtpError('');
    
    try {
      // Gửi trực tiếp request đến API để lấy OTP mới
      const response = await fetch('https://localhost:7125/api/Auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email, 
          purpose: 'registration' 
        }),
      });
      
      // Kiểm tra kết quả từ API
      const responseData = await response.json();
      console.log('Resend OTP API response:', responseData);
      
      if (response.ok) {
        // Trích xuất thông tin quan trọng từ phản hồi
        let sessionId = null;
        let expirySeconds = 300; // Mặc định 5 phút
        
        // Tìm verificationId hoặc sessionId trong mọi cấu trúc có thể có của phản hồi
        if (responseData.data && responseData.data.sessionId) {
          sessionId = responseData.data.sessionId;
          if (responseData.data.otpExpiry) {
            expirySeconds = responseData.data.otpExpiry;
          }
        } else if (responseData.sessionId) {
          sessionId = responseData.sessionId;
          if (responseData.otpExpiry) {
            expirySeconds = responseData.otpExpiry;
          }
        } else if (responseData.data && responseData.data.verificationId) {
          sessionId = responseData.data.verificationId;
        } else if (responseData.verificationId) {
          sessionId = responseData.verificationId;
        }
        
        if (sessionId) {
          // Lưu sessionId mới vào localStorage
          authService.saveOtpSession(
            sessionId,
            formData.email,
            'registration',
            expirySeconds
          );
          
          // Lấy thông tin phiên mới từ localStorage
          const session = authService.getCurrentSession();
          if (session) {
            setRemainingTime(session.remainingSeconds);
            alert('Đã gửi lại mã OTP. Vui lòng kiểm tra email.');
          } else {
            setOtpError('Có lỗi xảy ra khi lưu thông tin phiên mới');
          }
        } else {
          // Không tìm thấy sessionId, tạo tạm giá trị tạm thời
          console.warn('Không tìm thấy sessionId trong phản hồi API - tạo giá trị tạm thời');
          const tempSessionId = `temp_${Date.now()}_${formData.email.replace(/[^a-zA-Z0-9]/g, '')}`;
          
          authService.saveOtpSession(
            tempSessionId,
            formData.email,
            'registration',
            expirySeconds
          );
          
          setRemainingTime(expirySeconds);
          alert('Đã gửi lại mã OTP. Vui lòng kiểm tra email.');
          setOtpError('Lưu ý: Có thể gặp vấn đề khi xác thực OTP do không tìm thấy mã xác thực từ server');
        }
      } else {
        // Xử lý lỗi từ API
        setOtpError(responseData.message || 'Không thể gửi lại mã OTP, vui lòng thử lại sau');
      }
    } catch (error) {
      setOtpError('Lỗi kết nối, vui lòng thử lại sau');
      console.error('Resend OTP error:', error);
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
  
  // Hàm quay lại form đăng ký từ form OTP
  const handleBackToRegister = () => {
    setShowOtpForm(false);
    setOtpError('');
    setOtpCode('');
    // Xóa phiên OTP hiện tại
    authService.clearSession();
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Đăng Ký Tài Khoản</h2>
        
        {!showOtpForm ? (
          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && <div className="error-message">{errors.general}</div>}
            
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ tên đầy đủ"
              />
              {errors.fullName && <div className="error-message">{errors.fullName}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
              {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
              />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>
            
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
            </button>
            
            <div className="auth-links">
              <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="auth-form">
            <p className="otp-message">
              Chúng tôi đã gửi mã OTP đến email {formData.email}.<br />
              Vui lòng kiểm tra và nhập mã để hoàn tất đăng ký.
              {remainingTime > 0 && (
                <span className="otp-timer">Thời gian còn lại: {formatTime(remainingTime)}</span>
              )}
            </p>
            
            <div className="form-group">
              <label htmlFor="otpCode">Mã OTP</label>
              <input
                type="text"
                id="otpCode"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value);
                  setOtpError('');
                }}
                placeholder="Nhập mã OTP từ email"
              />
              {otpError && <div className="error-message">{otpError}</div>}
            </div>
            
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Xác Nhận'}
            </button>
            
            <div className="auth-links">
              <p>
                Không nhận được mã? 
                <button 
                  type="button" 
                  className="resend-button"
                  disabled={isLoading || remainingTime > 0}
                  onClick={resendOtp}
                >
                  Gửi lại
                </button>
              </p>
              <p>
                <button
                  type="button"
                  className="back-button"
                  onClick={handleBackToRegister}
                >
                  Quay lại
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;