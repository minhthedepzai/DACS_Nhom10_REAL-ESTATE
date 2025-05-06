import React, { useState, useEffect } from 'react';
// import { Link, useHistory } from 'react-router-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import './Auth.css';
// import authService from '../../services/authService';
import authService from '../../../services/client/authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5278/api';

// Cấu hình cho fetch API
const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  mode: 'cors',
  cache: 'no-cache'
};

const ForgotPassword = () => {
  // const history = useHistory();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP, 3: Đặt lại mật khẩu

  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Key trong localStorage để lưu verificationID
  const VERIFICATION_ID_KEY = 'reset_password_verification_id';

  // Kiểm tra phiên đặt lại mật khẩu khi tải trang
  useEffect(() => {
    // Kiểm tra nếu đã có verificationID trong localStorage
    const verificationId = localStorage.getItem(VERIFICATION_ID_KEY);
    const savedEmail = localStorage.getItem('reset_password_email');

    if (verificationId && savedEmail) {
      setEmail(savedEmail);

      // Xác định bước hiện tại dựa trên dữ liệu trong localStorage
      if (localStorage.getItem('reset_password_verified') === 'true') {
        setStep(3); // Đã xác thực OTP, chuyển đến bước đặt lại mật khẩu
      } else {
        setStep(2); // Đã gửi OTP, chuyển đến bước nhập OTP

        // Kiểm tra thời gian còn lại của OTP nếu có
        const expiryTime = localStorage.getItem('reset_password_expiry');
        if (expiryTime) {
          const remaining = Math.floor((parseInt(expiryTime) - new Date().getTime()) / 1000);
          if (remaining > 0) {
            setRemainingTime(remaining);
          } else {
            setOtpError('Mã OTP đã hết hạn, vui lòng yêu cầu gửi lại');
          }
        }
      }
    }
  }, []);

  // Đếm ngược thời gian OTP
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (remainingTime === 0 && step === 2) {
      // OTP đã hết hạn
      setOtpError('Mã OTP đã hết hạn, vui lòng yêu cầu gửi lại');
    }
  }, [remainingTime, step]);

  // Lưu thông tin xác thực vào localStorage
  const saveVerificationInfo = (verificationId, userEmail, expiryInSeconds = 300) => {
    const expiryTime = new Date().getTime() + (expiryInSeconds * 1000);

    localStorage.setItem(VERIFICATION_ID_KEY, verificationId);
    localStorage.setItem('reset_password_email', userEmail);
    localStorage.setItem('reset_password_expiry', expiryTime.toString());

    return {
      verificationId,
      email: userEmail,
      expiryTime,
      remainingSeconds: expiryInSeconds
    };
  };

  // Xóa thông tin xác thực từ localStorage
  const clearVerificationInfo = () => {
    localStorage.removeItem(VERIFICATION_ID_KEY);
    localStorage.removeItem('reset_password_email');
    localStorage.removeItem('reset_password_expiry');
    localStorage.removeItem('reset_password_verified');
    localStorage.removeItem('reset_password_otp');
  };

  // Format thời gian hết hạn
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Vui lòng nhập email');
      return;
    } else if (!email.includes('@')) {
      setEmailError('Email không hợp lệ: Vui lòng thêm ký tự "@" vào địa chỉ email');
      return;
    } else if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ');
      return;
    }

    setIsLoading(true);

    try {
      // Gửi yêu cầu OTP qua authService thay vì gọi trực tiếp
      const result = await authService.sendOtp(email, 'reset-password');
      console.log('Send OTP result:', result);

      if (result.success) {
        // Trích xuất thông tin từ kết quả API
        let verificationId = null;
        let expirySeconds = 300;

        if (result.data) {
          // Ưu tiên lấy từ result.data
          if (result.data.verificationId) {
            verificationId = result.data.verificationId;
          } else if (result.data.sessionId) {
            verificationId = result.data.sessionId;
          }

          if (result.data.otpExpiry) {
            expirySeconds = result.data.otpExpiry;
          }
        } else {
          // Nếu không có result.data, thử lấy từ result
          if (result.verificationId) {
            verificationId = result.verificationId;
          } else if (result.sessionId) {
            verificationId = result.sessionId;
          }
        }

        if (verificationId) {
          // Lưu thông tin xác thực
          const verificationInfo = saveVerificationInfo(verificationId, email, expirySeconds);
          setRemainingTime(verificationInfo.remainingSeconds);

          // Chuyển sang bước nhập OTP
          setStep(2);
        } else {
          // Tạo ID tạm thời
          console.warn('Không tìm thấy ID xác thực trong API response - tạo giá trị tạm thời');
          const tempVerificationId = `temp_${Date.now()}_${email.replace(/[^a-zA-Z0-9]/g, '')}`;

          const verificationInfo = saveVerificationInfo(tempVerificationId, email, expirySeconds);
          setRemainingTime(verificationInfo.remainingSeconds);

          setStep(2);
          setOtpError('Lưu ý: Có thể gặp vấn đề khi xác thực OTP do không tìm thấy mã xác thực từ server');
        }
      } else {
        setEmailError(result.message || 'Không thể gửi mã OTP, vui lòng thử lại sau');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setEmailError('Lỗi kết nối, vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();

    if (!otpCode.trim()) {
      setOtpError('Vui lòng nhập mã OTP');
      return;
    }

    setIsLoading(true);

    try {
      // Lấy thông tin xác thực từ localStorage
      const verificationId = localStorage.getItem(VERIFICATION_ID_KEY);
      const savedEmail = localStorage.getItem('reset_password_email');

      if (!verificationId || !savedEmail) {
        setOtpError('Phiên xác thực đã hết hạn, vui lòng thực hiện lại');
        setIsLoading(false);
        return;
      }

      console.log('Verifying OTP with:', {
        email: savedEmail,
        verificationId: verificationId,
        otp: otpCode
      });

      // Sử dụng authService để xác thực OTP
      const result = await authService.verifyOtp(savedEmail, otpCode, verificationId);
      console.log('Verify OTP result:', result);

      if (result.success) {
        // Đánh dấu đã xác thực OTP thành công
        localStorage.setItem('reset_password_verified', 'true');
        localStorage.setItem('reset_password_otp', otpCode);

        // Chuyển sang bước đặt lại mật khẩu
        setStep(3);
        setOtpError('');
      } else {
        // Xử lý lỗi từ API
        setOtpError(result.message || 'Mã OTP không đúng');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setOtpError('Lỗi kết nối, vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới
    if (!newPassword) {
      setPasswordError('Vui lòng nhập mật khẩu mới');
      return;
    } else if (newPassword.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    } else if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      // Lấy thông tin xác thực từ localStorage
      const verificationId = localStorage.getItem(VERIFICATION_ID_KEY);
      const savedEmail = localStorage.getItem('reset_password_email');
      const savedOtp = localStorage.getItem('reset_password_otp');

      if (!verificationId || !savedEmail || !savedOtp) {
        setGeneralError('Phiên xác thực đã hết hạn, vui lòng thực hiện lại');
        setIsLoading(false);
        return;
      }

      console.log('Attempting to change password with:', {
        email: savedEmail,
        verificationId: verificationId,
        otp: savedOtp,
        newPassword: '******',
      });

      // Thử sử dụng authService để đặt lại mật khẩu
      try {
        const result = await authService.resetPassword(
          savedEmail,
          savedOtp,
          newPassword,
          confirmPassword,
          verificationId
        );

        console.log('Reset password result:', result);

        if (result.success) {
          // Xóa tất cả thông tin xác thực khỏi localStorage
          clearVerificationInfo();

          // Đặt lại mật khẩu thành công, chuyển hướng đến trang đăng nhập
          // history.push('/login', { 
          //   message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.' 
          // });

          // navigate('/login');
          navigate('/login', { 
            state: { 
              message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.' 
            } 
          });
          
          return;
        }
      } catch (resetError) {
        console.error('Reset password error:', resetError);
      }

      // Nếu không thành công với resetPassword, thử gọi trực tiếp API thay thế
      try {
        // Thử gọi API change-password-after-otp
        const response = await fetch(`${API_URL}/Auth/change-password-after-otp`, {
          ...fetchConfig,
          method: 'POST',
          body: JSON.stringify({
            email: savedEmail,
            sessionId: verificationId,
            otp: savedOtp,
            newPassword: newPassword,
            confirmPassword: confirmPassword
          }),
        });

        const data = await response.json();
        console.log('Direct API response:', data);

        if (response.ok) {
          // Xóa tất cả thông tin xác thực khỏi localStorage
          clearVerificationInfo();

          // Đặt lại mật khẩu thành công, chuyển hướng đến trang đăng nhập
          // history.push('/login', { 
          //   message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.' 
          // });

          navigate('/login', {
            state: {
              message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.'
            }
          });

          return;
        } else {
          setGeneralError(data.message || 'Không thể đổi mật khẩu, vui lòng thử lại sau.');
        }
      } catch (directApiError) {
        console.error('Direct API call error:', directApiError);
        setGeneralError('Lỗi kết nối đến server, vui lòng kiểm tra kết nối mạng.');
      }
    } catch (error) {
      console.error('Change password error:', error);
      setGeneralError('Lỗi kết nối, vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    setOtpError('');

    try {
      // Lấy email từ localStorage
      const savedEmail = localStorage.getItem('reset_password_email');

      // Nếu không có email, quay lại bước 1
      if (!savedEmail) {
        setOtpError('Phiên đã hết hạn, vui lòng bắt đầu lại');
        setStep(1);
        return;
      }

      // Sử dụng authService để gửi lại OTP
      const result = await authService.sendOtp(savedEmail, 'reset-password');
      console.log('Resend OTP result:', result);

      if (result.success) {
        // Trích xuất thông tin từ kết quả API
        let verificationId = null;
        let expirySeconds = 300;

        if (result.data) {
          if (result.data.verificationId) {
            verificationId = result.data.verificationId;
          } else if (result.data.sessionId) {
            verificationId = result.data.sessionId;
          }

          if (result.data.otpExpiry) {
            expirySeconds = result.data.otpExpiry;
          }
        } else {
          if (result.verificationId) {
            verificationId = result.verificationId;
          } else if (result.sessionId) {
            verificationId = result.sessionId;
          }
        }

        if (verificationId) {
          // Cập nhật thông tin xác thực mới
          const verificationInfo = saveVerificationInfo(verificationId, savedEmail, expirySeconds);
          setRemainingTime(verificationInfo.remainingSeconds);

          // Xóa trạng thái xác thực OTP cũ
          localStorage.removeItem('reset_password_verified');

          // Thông báo cho người dùng
          alert('Đã gửi lại mã OTP. Vui lòng kiểm tra email của bạn.');
        } else {
          setOtpError('Không thể lấy mã xác thực, vui lòng thử lại');
        }
      } else {
        setOtpError(result.message || 'Không thể gửi lại mã OTP, vui lòng thử lại');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setOtpError('Lỗi kết nối, vui lòng thử lại sau');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm quay lại bước trước đó
  const handleGoBack = (targetStep) => {
    setStep(targetStep);

    // Nếu quay lại từ bước 3 đến bước 2, xóa trạng thái xác thực
    if (targetStep === 2 && step === 3) {
      localStorage.removeItem('reset_password_verified');
    }

    // Nếu quay lại từ bước 2 đến bước 1, xóa toàn bộ thông tin xác thực
    if (targetStep === 1) {
      clearVerificationInfo();
      setOtpError('');
      setOtpCode('');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        // Bước 1: Nhập email
        return (
          <form onSubmit={handleStep1Submit} className="auth-form">
            <p className="form-description">
              Nhập email đã đăng ký để nhận mã OTP đặt lại mật khẩu
            </p>

            <div className={`form-group ${emailError ? 'has-error' : ''}`}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                placeholder="Nhập email"
                onInvalid={(e) => e.preventDefault()}
                pattern=".*"
              />
              {emailError && (
                <div className="input-error-message">
                  {emailError}
                </div>
              )}
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Gửi mã OTP'}
            </button>

            <div className="auth-links">
              <p>Đã nhớ mật khẩu? <Link to="/login">Đăng nhập</Link></p>
            </div>
          </form>
        );

      case 2:
        // Bước 2: Nhập OTP
        return (
          <form onSubmit={handleStep2Submit} className="auth-form">
            <p className="otp-message">
              Chúng tôi đã gửi mã OTP đến email {email}.<br />
              Vui lòng kiểm tra và nhập mã để tiếp tục.
              {remainingTime > 0 && (
                <span className="otp-timer">Thời gian còn lại: {formatTime(remainingTime)}</span>
              )}
            </p>

            <div className={`form-group ${otpError ? 'has-error' : ''}`}>
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
              {otpError && <div className="input-error-message">{otpError}</div>}
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
            </button>

            <div className="auth-links">
              <p>
                Không nhận được mã?
                <button
                  type="button"
                  className="resend-button"
                  disabled={isLoading || remainingTime > 0}
                  onClick={resendOTP}
                >
                  Gửi lại
                </button>
              </p>
              <p>
                <button
                  type="button"
                  className="back-button"
                  onClick={() => handleGoBack(1)}
                >
                  Quay lại
                </button>
              </p>
            </div>
          </form>
        );

      case 3:
        // Bước 3: Đặt lại mật khẩu
        return (
          <form onSubmit={handleStep3Submit} className="auth-form">
            {generalError && <div className="general-error">{generalError}</div>}

            <div className={`form-group ${passwordError ? 'has-error' : ''}`}>
              <label htmlFor="newPassword">Mật khẩu mới</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              />
            </div>

            <div className={`form-group ${passwordError ? 'has-error' : ''}`}>
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="Nhập lại mật khẩu mới"
              />
              {passwordError && <div className="input-error-message">{passwordError}</div>}
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>

            <div className="auth-links">
              <p>
                <button
                  type="button"
                  className="back-button"
                  onClick={() => handleGoBack(2)}
                >
                  Quay lại
                </button>
              </p>
            </div>
          </form>
        );

      default:
        return null;
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
            <img src="/img/property-2.jpg" alt="Bất động sản" />
            <div className="auth-image-overlay">
              <div className="auth-image-quote">Lấy Lại Mật Khẩu</div>
              <div className="auth-image-text">Hãy nhập email của bạn, chúng tôi sẽ gửi hướng dẫn để bạn có thể đặt lại mật khẩu một cách an toàn và nhanh chóng.</div>
              <button className="auth-image-explore">Quay lại trang đăng nhập</button>
            </div>
          </div>
          <div className="auth-form-container">
            <h2>Quên Mật Khẩu</h2>
            {generalError && <div className="general-error">{generalError}</div>}
            {renderStepContent()}

            <div className="home-button">
              <Link to="/">
                <i className="fas fa-arrow-left"></i>
                Trở về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 