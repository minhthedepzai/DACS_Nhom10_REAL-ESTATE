import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Auth.css';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const history = useHistory();
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
    } else if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Gửi yêu cầu OTP trực tiếp đến API send-otp
      const response = await fetch('https://localhost:7125/api/Auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          purpose: 'reset-password' 
        }),
      });
      
      // Kiểm tra kết quả từ API
      const responseData = await response.json();
      console.log('Send OTP API response:', responseData);
      
      if (response.ok) {
        // Trích xuất thông tin quan trọng từ phản hồi
        let verificationId = null;
        let expirySeconds = 300; // Mặc định 5 phút
        
        // Tìm kiếm verificationId hoặc sessionId trong mọi cấu trúc có thể có của phản hồi
        if (responseData.data && responseData.data.sessionId) {
          verificationId = responseData.data.sessionId;
          if (responseData.data.otpExpiry) {
            expirySeconds = responseData.data.otpExpiry;
          }
        } else if (responseData.sessionId) {
          verificationId = responseData.sessionId;
          if (responseData.otpExpiry) {
            expirySeconds = responseData.otpExpiry;
          }
        } else if (responseData.data && responseData.data.verificationId) {
          verificationId = responseData.data.verificationId;
        } else if (responseData.verificationId) {
          verificationId = responseData.verificationId;
        } else if (typeof responseData === 'string' && responseData.length > 10) {
          // Nếu phản hồi là một chuỗi dài, có thể đó là verificationId
          verificationId = responseData;
        }
        
        // Đã tìm thấy verificationId hoặc tạo một giá trị tạm thời
        if (verificationId) {
          // Lưu thông tin xác thực
          const verificationInfo = saveVerificationInfo(verificationId, email, expirySeconds);
          setRemainingTime(verificationInfo.remainingSeconds);
          
          // Chuyển sang bước nhập OTP
          setStep(2);
        } else {
          // Tạo một verificationId tạm thời dựa trên email và thời gian
          // Đây là giải pháp tạm thời cho frontend và có thể không hoạt động với backend
          console.warn('Không tìm thấy verificationId trong phản hồi API - tạo giá trị tạm thời');
          const tempVerificationId = `temp_${Date.now()}_${email.replace(/[^a-zA-Z0-9]/g, '')}`;
          
          // Lưu thông tin xác thực tạm thời
          const verificationInfo = saveVerificationInfo(tempVerificationId, email, expirySeconds);
          setRemainingTime(verificationInfo.remainingSeconds);
          
          // Chuyển sang bước nhập OTP với cảnh báo
          setStep(2);
          setOtpError('Lưu ý: Có thể gặp vấn đề khi xác thực OTP do không tìm thấy mã xác thực từ server');
        }
      } else {
        // Xử lý lỗi từ API
        setEmailError(responseData.message || 'Không thể gửi mã OTP, vui lòng thử lại sau');
      }
    } catch (error) {
      setEmailError('Lỗi kết nối, vui lòng thử lại sau');
      console.error('Send OTP error:', error);
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
      
      console.log('Sending OTP verification with:', {
        email: savedEmail,
        verificationId: verificationId,
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
            email: savedEmail,
            sessionId: verificationId,
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
              email: savedEmail,
              verificationId: verificationId,
              otp: otpCode
            }),
          });
          
          if (!response.ok) {
            console.log('Cấu trúc 2 không thành công, thử cấu trúc 3...');
            throw new Error('Thử cấu trúc request tiếp theo');
          }
        } catch (err2) {
          // Cấu trúc 3: Sử dụng token và code
          response = await fetch('https://localhost:7125/api/Auth/verify-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: savedEmail,
              code: otpCode,
              token: verificationId
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
        // Lưu trạng thái xác thực OTP thành công vào localStorage
        localStorage.setItem('reset_password_verified', 'true');
        
        // Lưu mã OTP để sử dụng cho bước 3
        localStorage.setItem('reset_password_otp', otpCode);
        
        // Xác thực OTP thành công, chuyển sang bước đặt lại mật khẩu
        setStep(3);
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
          setOtpError(responseData ? (responseData.message || 'Xác thực OTP thất bại, vui lòng thử lại') : 'Lỗi xác thực OTP');
        }
      }
    } catch (error) {
      setOtpError('Lỗi kết nối, vui lòng thử lại sau');
      console.error('OTP verification error:', error);
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
      
      // Thử với API đầy đủ
      const baseApiUrl = 'https://localhost:7125';
      
      // Danh sách các cấu trúc request có thể dùng
      const requestStructures = [
        // Cấu trúc 1: /api/Auth/change-password-after-otp với sessionId
        {
          url: `${baseApiUrl}/api/Auth/change-password-after-otp`,
          body: {
            email: savedEmail,
            sessionId: verificationId,
            otp: savedOtp,
            newPassword: newPassword,
            confirmPassword: confirmPassword
          }
        },
        // Cấu trúc 2: /api/Auth/change-password-after-otp với verificationId
        {
          url: `${baseApiUrl}/api/Auth/change-password-after-otp`,
          body: {
            email: savedEmail,
            verificationId: verificationId,
            otp: savedOtp,
            newPassword: newPassword,
            confirmPassword: confirmPassword
          }
        },
        // Cấu trúc 3: /api/Auth/change-password-after-otp với token/code
        {
          url: `${baseApiUrl}/api/Auth/change-password-after-otp`,
          body: {
            email: savedEmail,
            token: verificationId,
            code: savedOtp,
            newPassword: newPassword,
            confirmPassword: confirmPassword
          }
        },
        // Cấu trúc 4: /api/Auth/reset-password với sessionId
        {
          url: `${baseApiUrl}/api/Auth/reset-password`,
          body: {
            email: savedEmail,
            sessionId: verificationId,
            otp: savedOtp,
            newPassword: newPassword,
            confirmPassword: confirmPassword
          }
        },
        // Cấu trúc 5: /api/Auth/reset-password với verificationId
        {
          url: `${baseApiUrl}/api/Auth/reset-password`,
          body: {
            email: savedEmail,
            verificationId: verificationId,
            otp: savedOtp,
            newPassword: newPassword,
            confirmPassword: confirmPassword
          }
        },
        // Cấu trúc 6: /api/Auth/change-password-after-otp với password thay vì newPassword
        {
          url: `${baseApiUrl}/api/Auth/change-password-after-otp`,
          body: {
            email: savedEmail,
            sessionId: verificationId,
            otp: savedOtp,
            password: newPassword,
            confirmPassword: confirmPassword
          }
        },
        // Cấu trúc 7: /api/Auth/change-password-after-otp với password và confirm
        {
          url: `${baseApiUrl}/api/Auth/change-password-after-otp`,
          body: {
            email: savedEmail,
            sessionId: verificationId,
            otp: savedOtp,
            password: newPassword,
            confirm: confirmPassword
          }
        }
      ];
      
      let response = null;
      let responseSuccess = false;
      let attemptCount = 0;
      let responseData = null;
      
      // Thử từng cấu trúc request cho đến khi thành công
      for (const requestStructure of requestStructures) {
        attemptCount++;
        console.log(`Thử cấu trúc ${attemptCount}:`, {
          url: requestStructure.url,
          body: { ...requestStructure.body, newPassword: '******' }
        });
        
        try {
          const fetchResponse = await fetch(requestStructure.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestStructure.body),
          });
          
          // Thử xử lý phản hồi
          try {
            const data = await fetchResponse.json();
            console.log(`Phản hồi cấu trúc ${attemptCount}:`, data);
            responseData = data;
          } catch (jsonError) {
            console.log(`Phản hồi không phải JSON từ cấu trúc ${attemptCount}:`, await fetchResponse.text());
          }
          
          if (fetchResponse.ok) {
            console.log(`Cấu trúc ${attemptCount} thành công!`);
            response = fetchResponse;
            responseSuccess = true;
            break;
          } else {
            console.log(`Cấu trúc ${attemptCount} không thành công (${fetchResponse.status}).`);
          }
        } catch (fetchError) {
          console.error(`Lỗi khi thử cấu trúc ${attemptCount}:`, fetchError);
        }
      }
      
      // Nếu không có cấu trúc nào thành công
      if (!responseSuccess) {
        setGeneralError('Không thể đổi mật khẩu với bất kỳ phương thức nào. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.');
        console.error('Tất cả các cấu trúc request đều thất bại');
        setIsLoading(false);
        return;
      }
      
      // Nếu có ít nhất một cấu trúc thành công
      console.log('Đổi mật khẩu thành công!');
      
      // Xóa tất cả thông tin xác thực khỏi localStorage
      clearVerificationInfo();
      
      // Đặt lại mật khẩu thành công, chuyển hướng đến trang đăng nhập
      history.push('/login', { 
        message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.' 
      });
      
    } catch (error) {
      setGeneralError('Lỗi kết nối, vui lòng thử lại sau');
      console.error('Change password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    setOtpError('');
    
    try {
      // Lấy email đã lưu
      const savedEmail = localStorage.getItem('reset_password_email') || email;
      
      if (!savedEmail) {
        setOtpError('Không tìm thấy thông tin email, vui lòng thực hiện lại');
        setIsLoading(false);
        return;
      }
      
      // Gửi lại yêu cầu OTP
      const response = await fetch('https://localhost:7125/api/Auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: savedEmail, 
          purpose: 'reset-password' 
        }),
      });
      
      // Kiểm tra kết quả từ API
      const responseData = await response.json();
      console.log('Resend OTP API response:', responseData);
      
      if (response.ok) {
        // Trích xuất thông tin quan trọng từ phản hồi
        let verificationId = null;
        let expirySeconds = 300; // Mặc định 5 phút
        
        // Tìm verificationId trong cấu trúc phản hồi
        if (responseData.data && responseData.data.sessionId) {
          verificationId = responseData.data.sessionId;
          if (responseData.data.otpExpiry) {
            expirySeconds = responseData.data.otpExpiry;
          }
        } else if (responseData.sessionId) {
          verificationId = responseData.sessionId;
          if (responseData.otpExpiry) {
            expirySeconds = responseData.otpExpiry;
          }
        }
        
        if (verificationId) {
          // Cập nhật thông tin xác thực
          const verificationInfo = saveVerificationInfo(verificationId, savedEmail, expirySeconds);
          setRemainingTime(verificationInfo.remainingSeconds);
          
          // Thông báo đã gửi lại OTP
          alert('Đã gửi lại mã OTP. Vui lòng kiểm tra email.');
        } else {
          // Không tìm thấy verificationId
          setOtpError('Có lỗi xảy ra khi gửi lại mã OTP, vui lòng thử lại sau');
          console.error('VerificationId not found in API response:', responseData);
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
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                placeholder="Nhập email"
              />
              {emailError && <div className="error-message">{emailError}</div>}
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
            {generalError && <div className="error-message">{generalError}</div>}
            
            <div className="form-group">
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
            
            <div className="form-group">
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
              {passwordError && <div className="error-message">{passwordError}</div>}
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
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Quên mật khẩu</h2>
        {renderStepContent()}
      </div>
    </div>
  );
};

export default ForgotPassword; 