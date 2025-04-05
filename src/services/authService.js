// Cấu hình API cơ bản
const API_URL = 'https://localhost:7125/api/Auth';

// Các khóa lưu trữ cho localStorage
const STORAGE_KEYS = {
  SESSION_ID: 'auth_session_id',
  SESSION_EMAIL: 'auth_session_email',
  SESSION_PURPOSE: 'auth_session_purpose',
  SESSION_EXPIRY: 'auth_session_expiry'
};

// Hàm xử lý phản hồi từ API với khả năng linh hoạt hơn
const handleResponse = async (response) => {
  try {
    // Thử đọc dữ liệu JSON
    const data = await response.json();
    console.log('API Response:', response.url, data);
    
    // Kiểm tra và xử lý nhiều dạng cấu trúc phản hồi có thể có
    const result = {
      success: response.ok,
      status: response.status,
      data: null,
      message: 'Không xác định',
      error: null
    };
    
    // Xử lý dữ liệu trả về
    if (data) {
      // Xử lý linh hoạt nhiều loại cấu trúc phản hồi
      
      // 1. Kiểm tra trường data
      if (data.hasOwnProperty('data')) {
        result.data = data.data;
      } 
      // 2. Kiểm tra token trực tiếp
      else if (data.hasOwnProperty('token') || data.hasOwnProperty('accessToken')) {
        result.data = data;
      }
      // 3. Nếu là object và API thành công, coi toàn bộ là data
      else if (response.ok && typeof data === 'object') {
        result.data = data;
      }
      // 4. Nếu là string và API thành công, có thể là token trực tiếp
      else if (response.ok && typeof data === 'string') {
        result.data = data;
      }
      
      // Xử lý thông báo
      if (data.hasOwnProperty('message')) {
        result.message = data.message;
      } else if (response.ok) {
        result.message = 'Thành công';
      }
      
      // Xử lý lỗi
      if (!response.ok) {
        result.error = data.error || data.errors || data.message || 'Lỗi không xác định';
        result.message = data.message || 'Có lỗi xảy ra';
      }
    }
    
    // Log chi tiết kết quả xử lý phản hồi
    console.log('Processed API response:', result);
    
    return result;
  } catch (error) {
    console.error('Error processing API response:', error);
    
    // Kiểm tra lỗi SyntaxError (phản hồi không phải JSON)
    if (error instanceof SyntaxError) {
      try {
        // Thử đọc phản hồi dưới dạng text
        const textResponse = await response.text();
        console.log('Non-JSON response:', textResponse);
        
        // Nếu có phản hồi text và API thành công
        if (textResponse && response.ok) {
          return {
            success: true,
            status: response.status,
            data: textResponse, // Có thể là token
            message: 'Phản hồi không phải JSON',
            error: null
          };
        }
      } catch (textError) {
        console.error('Error reading response as text:', textError);
      }
    }
    
    return {
      success: false,
      status: response.status,
      data: null,
      message: 'Lỗi xử lý dữ liệu từ server',
      error: error.message
    };
  }
};

// Lưu thông tin phiên OTP vào localStorage
const saveOtpSession = (sessionId, email, purpose, expiryInSeconds = 600) => {
  const expiryTime = new Date().getTime() + (expiryInSeconds * 1000);
  
  localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  localStorage.setItem(STORAGE_KEYS.SESSION_EMAIL, email);
  localStorage.setItem(STORAGE_KEYS.SESSION_PURPOSE, purpose);
  localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiryTime.toString());
  
  return {
    sessionId,
    email,
    purpose,
    expiryTime
  };
};

// Lấy thông tin phiên OTP từ localStorage
const getOtpSession = () => {
  const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  const email = localStorage.getItem(STORAGE_KEYS.SESSION_EMAIL);
  const purpose = localStorage.getItem(STORAGE_KEYS.SESSION_PURPOSE);
  const expiryTimeStr = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY);
  
  if (!sessionId || !email || !purpose || !expiryTimeStr) {
    return null;
  }
  
  const expiryTime = parseInt(expiryTimeStr, 10);
  const now = new Date().getTime();
  
  // Kiểm tra hết hạn
  if (now > expiryTime) {
    clearOtpSession();
    return null;
  }
  
  return {
    sessionId,
    email,
    purpose,
    expiryTime,
    remainingSeconds: Math.floor((expiryTime - now) / 1000)
  };
};

// Xóa thông tin phiên OTP từ localStorage
const clearOtpSession = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
  localStorage.removeItem(STORAGE_KEYS.SESSION_EMAIL);
  localStorage.removeItem(STORAGE_KEYS.SESSION_PURPOSE);
  localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
};

// Dịch vụ xác thực người dùng
const authService = {
  // Đăng ký tài khoản mới
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const result = await handleResponse(response);
      
      // Nếu thành công và có sessionId, lưu vào localStorage
      if (result.success && result.data && result.data.sessionId) {
        saveOtpSession(
          result.data.sessionId, 
          userData.email, 
          'registration', 
          result.data.otpExpiry || 600
        );
      }
      
      return result;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        status: 0,
        data: null,
        message: 'Lỗi kết nối',
        error: error.message
      };
    }
  },
  
  // Bước 1 của đăng nhập: Email và mật khẩu
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await handleResponse(response);
      
      // Nếu thành công và có sessionId, lưu vào localStorage
      if (result.success && result.data && result.data.sessionId) {
        saveOtpSession(
          result.data.sessionId, 
          email, 
          'login', 
          result.data.otpExpiry || 600
        );
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        status: 0,
        data: null,
        message: 'Lỗi kết nối',
        error: error.message
      };
    }
  },
  
  // Bước 2 của đăng nhập: Xác thực OTP
  verifyLoginOtp: async (email, sessionId, otpCode) => {
    try {
      const session = getOtpSession();
      
      // Ghi log thông tin phiên hiện tại để debug
      console.log('Current login OTP session:', session);
      
      // Nếu không có phiên hoặc sessionId khác với phiên lưu trữ
      if (!session || session.sessionId !== sessionId || session.email !== email) {
        console.warn('Login session validation failed:', {
          hasSession: !!session,
          sessionIdMatch: session ? session.sessionId === sessionId : false,
          emailMatch: session ? session.email === email : false
        });
        return {
          success: false,
          status: 400,
          data: null,
          message: 'Phiên xác thực đã hết hạn, vui lòng thực hiện lại',
          error: 'Session expired or invalid'
        };
      }
      
      // Cấu trúc request theo mô tả yêu cầu
      const requestBody = {
        email: email,
        sessionId: sessionId,
        otp: otpCode
      };
      
      console.log('Sending login OTP verification request:', requestBody);
      
      const response = await fetch(`${API_URL}/login-verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const result = await handleResponse(response);
      
      // Ghi log kết quả xác thực OTP
      console.log('Login OTP verification result:', result);
      
      // Nếu xác thực thành công, xóa phiên OTP
      if (result.success) {
        clearOtpSession();
      }
      
      return result;
    } catch (error) {
      console.error('Login OTP verification error:', error);
      return {
        success: false,
        status: 0,
        data: null,
        message: 'Lỗi kết nối',
        error: error.message
      };
    }
  },
  
  // Gửi OTP cho một mục đích cụ thể
  sendOtp: async (email, purpose) => {
    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purpose }),
      });
      
      const result = await handleResponse(response);
      
      // Nếu thành công và có sessionId, lưu vào localStorage
      if (result.success && result.data && result.data.sessionId) {
        saveOtpSession(
          result.data.sessionId, 
          email, 
          purpose, 
          result.data.otpExpiry || (purpose === 'login' ? 600 : 3600)
        );
      }
      
      return result;
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        status: 0,
        data: null,
        message: 'Lỗi kết nối',
        error: error.message
      };
    }
  },
  
  // Xác thực OTP
  verifyOtp: async (email, sessionId, otpCode, purpose) => {
    try {
      const session = getOtpSession();
      
      // Ghi log thông tin phiên hiện tại để debug
      console.log('Current OTP session:', session);
      
      // Nếu không có phiên hoặc sessionId khác với phiên lưu trữ
      if (!session || session.sessionId !== sessionId || session.email !== email) {
        console.warn('Session validation failed:', {
          hasSession: !!session,
          sessionIdMatch: session ? session.sessionId === sessionId : false,
          emailMatch: session ? session.email === email : false
        });
        return {
          success: false,
          status: 400,
          data: null,
          message: 'Phiên xác thực đã hết hạn, vui lòng thực hiện lại',
          error: 'Session expired or invalid'
        };
      }
      
      // Cấu trúc request theo mô tả yêu cầu
      const requestBody = {
        email: email,
        sessionId: sessionId,
        otp: otpCode
      };
      
      console.log('Sending OTP verification request:', requestBody);
      
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const result = await handleResponse(response);
      
      // Ghi log kết quả xác thực OTP
      console.log('OTP verification result:', result);
      
      // Nếu xác thực thành công và không phải để quên mật khẩu, xóa phiên OTP
      if (result.success && purpose !== 'reset-password') {
        clearOtpSession();
      }
      
      return result;
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        status: 0,
        data: null,
        message: 'Lỗi kết nối',
        error: error.message
      };
    }
  },
  
  // Yêu cầu đặt lại mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await handleResponse(response);
      console.log('Forgot password API response:', result);
      
      // Nếu thành công và có sessionId, lưu vào localStorage
      if (result.success && result.data && result.data.sessionId) {
        saveOtpSession(
          result.data.sessionId, 
          email, 
          'reset-password', 
          result.data.otpExpiry || 3600
        );
      } 
      // Trường hợp API không trả về sessionId, tự tạo phiên mới để xử lý OTP
      else if (result.success) {
        console.log('API did not return sessionId, creating temporary session');
        
        // Gửi request tới API send-otp để lấy sessionId
        try {
          const otpResponse = await fetch(`${API_URL}/send-otp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email, 
              purpose: 'reset-password' 
            }),
          });
          
          const otpResult = await handleResponse(otpResponse);
          console.log('Send OTP for reset password response:', otpResult);
          
          // Lưu sessionId từ API send-otp
          if (otpResult.success && otpResult.data && otpResult.data.sessionId) {
            saveOtpSession(
              otpResult.data.sessionId, 
              email, 
              'reset-password', 
              otpResult.data.otpExpiry || 3600
            );
          } else {
            console.error('Failed to get sessionId from send-otp API:', otpResult);
          }
        } catch (otpError) {
          console.error('Error requesting OTP after forgot password:', otpError);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        status: 0,
        data: null,
        message: 'Lỗi kết nối',
        error: error.message
      };
    }
  },
  
  // Đặt lại mật khẩu
  resetPassword: async (resetData) => {
    try {
      const session = getOtpSession();
      
      // Nếu không có phiên hoặc sessionId khác với phiên lưu trữ
      if (!session || session.sessionId !== resetData.sessionId || session.email !== resetData.email) {
        return {
          success: false,
          status: 400,
          data: null,
          message: 'Phiên xác thực đã hết hạn, vui lòng thực hiện lại',
          error: 'Session expired or invalid'
        };
      }
      
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetData),
      });
      
      const result = await handleResponse(response);
      
      // Nếu đặt lại mật khẩu thành công, xóa phiên OTP
      if (result.success) {
        clearOtpSession();
      }
      
      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        status: 0,
        data: null,
        message: 'Lỗi kết nối',
        error: error.message
      };
    }
  },
  
  // Làm mới token
  refreshToken: async (refreshToken) => {
    try {
      const response = await fetch(`${API_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        status: 0,
        data: null,
        message: 'Lỗi kết nối',
        error: error.message
      };
    }
  },
  
  // Thu hồi token (đăng xuất)
  revokeToken: async (refreshToken) => {
    try {
      const response = await fetch(`${API_URL}/revoke-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('Revoke token error:', error);
      return {
        success: false,
        status: 0,
        data: null,
        message: 'Lỗi kết nối',
        error: error.message
      };
    }
  },
  
  // Lấy thông tin phiên OTP hiện tại
  getCurrentSession: () => {
    const session = getOtpSession();
    console.log('Getting current session:', session);
    return session;
  },
  
  // Xóa phiên OTP hiện tại
  clearSession: () => {
    clearOtpSession();
  }
};

export default authService; 