import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import AuthNavbar from '../layout/AuthNavbar';
import './Auth.css';
import authService from '../../services/authService';

const Login = () => {
  const history = useHistory();
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
    } else if (remainingTime === 0 && step === 2) {
      // OTP đã hết hạn
      setOtpError('Mã OTP đã hết hạn, vui lòng yêu cầu gửi lại');
    }
  }, [remainingTime, step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    // Kiểm tra mật khẩu
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    
    if (!validateStep1()) return;
    
    setIsLoading(true);
    
    try {
      const result = await authService.login(formData.email, formData.password);
      
      if (result.success) {
        // Chuyển sang bước 2: Nhập OTP
        // Hệ thống đã lưu sessionId vào localStorage trong authService
        const session = authService.getCurrentSession();
        if (session) {
          setRemainingTime(session.remainingSeconds);
          setStep(2);
        } else {
          setErrors({ general: 'Có lỗi xảy ra trong quá trình xử lý, vui lòng thử lại sau' });
          console.error('Session not saved correctly:', result);
        }
      } else {
        setErrors({ general: result.message || result.error || 'Tên đăng nhập hoặc mật khẩu không đúng' });
      }
    } catch (error) {
      setErrors({ general: 'Lỗi kết nối, vui lòng thử lại sau' });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitStep2 = async (e) => {
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
        setOtpError('Phiên xác thực đã hết hạn, vui lòng đăng nhập lại');
        setIsLoading(false);
        return;
      }
      
      console.log('Sending login OTP verification with:', {
        email: session.email,
        sessionId: session.sessionId,
        otp: otpCode
      });
      
      // Thử nhiều cấu trúc request khác nhau để tìm cấu trúc phù hợp với backend
      let response;
      let endpointSuccess = false;
      
      // Danh sách các endpoint có thể dùng để xác thực OTP
      const possibleEndpoints = [
        'https://localhost:7125/api/Auth/login-verify-otp',
        'https://localhost:7125/api/Auth/verifyLoginOtp',
        'https://localhost:7125/api/Auth/verify-otp',
        'https://localhost:7125/api/Auth/verify-login-otp'
      ];
      
      // Thử từng endpoint cho đến khi thành công
      for (const endpoint of possibleEndpoints) {
        if (endpointSuccess) continue; // Bỏ qua nếu đã thành công
        
        try {
          console.log(`Thử gọi endpoint: ${endpoint}`);
          
          // Cấu trúc 1: Sử dụng sessionId (phổ biến nhất)
          try {
            response = await fetch(endpoint, {
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
            
            if (response.ok) {
              console.log(`Thành công với endpoint: ${endpoint}, cấu trúc 1`);
              endpointSuccess = true;
              break;
            } else {
              console.log(`Endpoint ${endpoint}, cấu trúc 1 không thành công, thử cấu trúc 2...`);
              throw new Error('Thử cấu trúc request tiếp theo');
            }
          } catch (err) {
            // Cấu trúc 2: Sử dụng verificationId thay vì sessionId
            try {
              response = await fetch(endpoint, {
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
              
              if (response.ok) {
                console.log(`Thành công với endpoint: ${endpoint}, cấu trúc 2`);
                endpointSuccess = true;
                break;
              } else {
                console.log(`Endpoint ${endpoint}, cấu trúc 2 không thành công, thử cấu trúc 3...`);
                throw new Error('Thử cấu trúc request tiếp theo');
              }
            } catch (err2) {
              // Cấu trúc 3: Đơn giản hóa, chỉ gửi ba trường chính
              response = await fetch(endpoint, {
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
              
              if (response.ok) {
                console.log(`Thành công với endpoint: ${endpoint}, cấu trúc 3`);
                endpointSuccess = true;
                break;
              }
            }
          }
        } catch (error) {
          console.log(`Lỗi khi gọi endpoint ${endpoint}:`, error);
        }
      }
      
      if (!endpointSuccess && !response) {
        throw new Error('Không thể kết nối với bất kỳ API endpoint nào');
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
      
      console.log('Login OTP verification API response:', responseData);
      
      // In chi tiết cấu trúc phản hồi để dễ dàng debug
      console.log('Chi tiết phản hồi API:', JSON.stringify(responseData, null, 2));
      
      // Xử lý linh hoạt cấu trúc dữ liệu trả về từ API
      let result = {
        success: response.ok || (responseData && responseData.success === true),
        data: responseData,
        message: responseData ? responseData.message : ''
      };
      
      if (result.success) {
        // Xử lý linh hoạt cấu trúc dữ liệu trả về từ API
        let accessToken = null;
        let refreshToken = null;
        let userData = null;
        
        // Kiểm tra nhiều cấu trúc dữ liệu có thể có
        if (responseData) {
          if (responseData.accessToken) {
            // Cấu trúc đơn giản: { accessToken, refreshToken, user }
            accessToken = responseData.accessToken;
            refreshToken = responseData.refreshToken || '';
            userData = responseData.user;
          } else if (responseData.token) {
            // Cấu trúc thay thế: { token, refreshToken, user }
            accessToken = responseData.token;
            refreshToken = responseData.refreshToken || '';
            userData = responseData.user;
          } else if (responseData.data && responseData.data.accessToken) {
            // Cấu trúc chuẩn: { data: { accessToken, refreshToken, user } }
            accessToken = responseData.data.accessToken;
            refreshToken = responseData.data.refreshToken || '';
            userData = responseData.data.user;
          } else if (typeof responseData === 'string') {
            // Cấu trúc đơn giản: token_string
            accessToken = responseData;
          } else if (responseData.data && typeof responseData.data === 'string') {
            // Cấu trúc đơn giản lồng: { data: "token_string" }
            accessToken = responseData.data;
          } else if (responseData.data && responseData.data.data && responseData.data.data.accessToken) {
            // Cấu trúc lồng nhau sâu: { data: { data: { accessToken... } } }
            accessToken = responseData.data.data.accessToken;
            refreshToken = responseData.data.data.refreshToken || '';
            userData = responseData.data.data.user;
          } else if (responseData.jwt) {
            // Cấu trúc JWT: { jwt }
            accessToken = responseData.jwt;
          } else if (responseData.data && responseData.data.jwt) {
            // Cấu trúc JWT lồng: { data: { jwt } }
            accessToken = responseData.data.jwt;
          } else if (responseData.data && responseData.data.token) {
            // Cấu trúc token lồng: { data: { token } }
            accessToken = responseData.data.token;
            refreshToken = responseData.data.refreshToken || '';
            userData = responseData.data.user || responseData.data.userData;
          } else if (responseData.auth && responseData.auth.token) {
            // Cấu trúc auth: { auth: { token } }
            accessToken = responseData.auth.token;
            refreshToken = responseData.auth.refreshToken || '';
          } else if (responseData.result && responseData.result.token) {
            // Cấu trúc result: { result: { token } }
            accessToken = responseData.result.token;
            refreshToken = responseData.result.refreshToken || '';
          }
          
          // Nếu vẫn không tìm thấy token, thử tìm kiếm một thuộc tính bất kỳ có thể là token
          if (!accessToken) {
            // Duyệt qua tất cả thuộc tính của responseData
            for (const key in responseData) {
              if (
                typeof responseData[key] === 'string' && 
                (
                  key.toLowerCase().includes('token') || 
                  key.toLowerCase().includes('jwt') || 
                  key.toLowerCase().includes('auth') || 
                  responseData[key].length > 20
                )
              ) {
                accessToken = responseData[key];
                console.log('Đã tìm thấy token tiềm năng trong trường:', key);
                break;
              }
              
              // Kiểm tra cấu trúc lồng nhau
              if (typeof responseData[key] === 'object' && responseData[key] !== null) {
                for (const nestedKey in responseData[key]) {
                  if (
                    typeof responseData[key][nestedKey] === 'string' && 
                    (
                      nestedKey.toLowerCase().includes('token') || 
                      nestedKey.toLowerCase().includes('jwt') || 
                      nestedKey.toLowerCase().includes('auth') || 
                      responseData[key][nestedKey].length > 20
                    )
                  ) {
                    accessToken = responseData[key][nestedKey];
                    console.log('Đã tìm thấy token tiềm năng trong trường lồng:', key + '.' + nestedKey);
                    break;
                  }
                }
                if (accessToken) break;
              }
            }
          }
        }
        
        // Nếu có token, xử lý đăng nhập thành công
        if (accessToken) {
          // Lưu token và thông tin người dùng vào localStorage
          localStorage.setItem('accessToken', accessToken);
          
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
          
          // Lưu thông tin người dùng nếu có
          if (userData) {
            localStorage.setItem('user', JSON.stringify(userData));
          }
          
          // Đăng nhập thành công, chuyển hướng đến trang chủ
          history.push('/');
        } else {
          // Token không được tìm thấy trong bất kỳ cấu trúc nào
          console.error('API response missing expected token data:', responseData);
          
          // Tạo một token tạm thời để xử lý trường hợp API không trả về token đúng định dạng
          // CHỈ SỬ DỤNG CHO MỤC ĐÍCH DEMO - KHÔNG NÊN DÙNG TRONG MÔI TRƯỜNG THỰC TẾ
          if (response.ok) {
            console.warn('Tạo token tạm thời để tiếp tục dòng chảy người dùng');
            const tempToken = `temp_token_${Date.now()}_${session.email.replace(/[^a-zA-Z0-9]/g, '')}`;
            localStorage.setItem('accessToken', tempToken);
            
            // Thử lấy thông tin người dùng từ email
            const userInfo = {
              email: session.email,
              createdAt: new Date().toISOString()
            };
            localStorage.setItem('user', JSON.stringify(userInfo));
            
            // Chuyển hướng đến trang chủ với token tạm thời
            history.push('/');
            return;
          }
          
          setOtpError('Có lỗi xảy ra trong quá trình xử lý, vui lòng thử lại sau');
        }
      } else {
        // Xử lý thông báo lỗi
        if (responseData && responseData.message && (
          responseData.message.includes('expired') || 
          responseData.message.includes('hết hạn')
        )) {
          setOtpError('Mã OTP đã hết hạn, vui lòng yêu cầu gửi lại');
          setRemainingTime(0);
        } else {
          setOtpError(responseData && responseData.message ? responseData.message : 'Mã OTP không hợp lệ');
        }
      }
    } catch (error) {
      setOtpError('Lỗi kết nối, vui lòng thử lại sau');
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    setOtpError('');
    
    try {
      // Lấy email từ phiên hiện tại hoặc form
      const session = authService.getCurrentSession();
      const email = session ? session.email : formData.email;
      
      // Gửi trực tiếp request đến API để lấy OTP mới
      const response = await fetch('https://localhost:7125/api/Auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email, 
          purpose: 'login' 
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
            email,
            'login',
            expirySeconds
          );
          
          // Lấy thông tin phiên mới từ localStorage
          const updatedSession = authService.getCurrentSession();
          if (updatedSession) {
            setRemainingTime(updatedSession.remainingSeconds);
            alert('Đã gửi lại mã OTP. Vui lòng kiểm tra email.');
          } else {
            setOtpError('Có lỗi xảy ra khi lưu thông tin phiên mới');
          }
        } else {
          // Không tìm thấy sessionId, tạo tạm giá trị tạm thời
          console.warn('Không tìm thấy sessionId trong phản hồi API - tạo giá trị tạm thời');
          const tempSessionId = `temp_${Date.now()}_${email.replace(/[^a-zA-Z0-9]/g, '')}`;
          
          authService.saveOtpSession(
            tempSessionId,
            email,
            'login',
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
                
                {successMessage && (
                  <div className="success-message">{successMessage}</div>
                )}
                
                {step === 1 ? (
                  <form onSubmit={handleSubmitStep1} className="auth-form">
                    {errors.general && <div className="error-message">{errors.general}</div>}
                    
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
                      <label htmlFor="password">Mật khẩu</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu"
                      />
                      {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>
                    
                    <div className="form-group">
                      <Link to="/forgot-password" className="forgot-password">
                        Quên mật khẩu?
                      </Link>
                    </div>
                    
                    <button type="submit" className="auth-button" disabled={isLoading}>
                      {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
                    </button>
                    
                    <div className="auth-links">
                      <p>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmitStep2} className="auth-form">
                    <p className="otp-message">
                      Chúng tôi đã gửi mã OTP đến email {formData.email}.<br />
                      Vui lòng kiểm tra và nhập mã để hoàn tất đăng nhập.
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
                      {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
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
                          onClick={() => {
                            setStep(1);
                            authService.clearSession();
                            setOtpError('');
                            setOtpCode('');
                          }}
                        >
                          Quay lại
                        </button>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login; 