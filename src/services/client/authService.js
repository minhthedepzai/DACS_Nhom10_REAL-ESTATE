import { jwtDecode } from 'jwt-decode';

// Cấu hình API cơ bản
const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/Auth` 
  : 'http://localhost:5278/api/Auth';

// Log API URL khi khởi tạo service
console.log('Auth Service API URL:', API_URL);

// Test kết nối API
fetch(`${API_URL}/verify-otp`, { method: 'OPTIONS' })
  .then(response => {
    console.log('API Connection Test:', {
      url: `${API_URL}/verify-otp`,
      status: response.status,
      ok: response.ok
    });
  })
  .catch(error => {
    console.error('API Connection Error:', error);
  });

// Các khóa lưu trữ cho localStorage
const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user',
  SESSION_ID: 'auth_session_id',
  SESSION_EMAIL: 'auth_session_email',
  SESSION_PURPOSE: 'auth_session_purpose',
  SESSION_EXPIRY: 'auth_session_expiry',
  TOKEN_EXPIRY: 'token_expiry'
};

// Cấu hình cho fetch API
const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  credentials: 'include'
};

// Hàm xử lý phản hồi từ API
const handleResponse = async (response) => {
  const text = await response.text();
  let data;
  try {
    data = text && JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Thử refresh token trước khi logout
      try {
        const refreshed = await authService.refreshToken();
        if (refreshed) {
          return refreshed;
        }
      } catch {
        authService.logout();
      }
    }
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }

  return data;
};

// Dịch vụ xác thực người dùng
const authService = {
  // Lưu thông tin đăng nhập
  saveAuthData: (data) => {
    if (data.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      // Lưu thời gian hết hạn của token
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 1); // Token hết hạn sau 1 giờ
      localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiry.toISOString());
    }
    if (data.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(data.user));
    }
  },

  // Kiểm tra token có hết hạn chưa
  isTokenExpired: () => {
    const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    if (!expiry) return true;
    return new Date() > new Date(expiry);
  },

  // Lấy token hiện tại
  getToken: async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) return null;

    // Kiểm tra token hết hạn
    if (authService.isTokenExpired()) {
      try {
        // Thử refresh token
        const refreshed = await authService.refreshToken();
        if (refreshed && refreshed.token) {
          return refreshed.token;
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        authService.logout();
        return null;
      }
    }

    return token;
  },

  // Lấy refresh token
  getRefreshToken: () => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  // Lấy thông tin user
  getUserInfo: () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: async () => {
    const token = await authService.getToken();
    const user = authService.getUserInfo();
    return !!(token && user);
  },

  // Xóa toàn bộ thông tin xác thực
  clearAuthData: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
    authService.clearOtpSession();
  },

  // Lưu thông tin phiên OTP
  saveOtpSession: (sessionId, email, purpose, expiryInSeconds = 600) => {
    const expiryTime = new Date().getTime() + (expiryInSeconds * 1000);
    
    // Lưu thông tin session với verificationId
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
    localStorage.setItem(STORAGE_KEYS.SESSION_EMAIL, email);
    localStorage.setItem(STORAGE_KEYS.SESSION_PURPOSE, purpose);
    localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiryTime.toString());
    
    console.log('Saved OTP session:', {
      sessionId,
      email,
      purpose,
      expiryTime: new Date(expiryTime).toISOString()
    });
    
    return {
      sessionId,
      verificationId: sessionId, // Thêm verificationId vào session
      email,
      purpose,
      expiryTime
    };
  },

  getOtpSession: () => {
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
      authService.clearOtpSession();
      return null;
    }
    
    return {
      sessionId,
      verificationId: sessionId,
      email,
      purpose,
      expiryTime,
      remainingSeconds: Math.floor((expiryTime - now) / 1000)
    };
  },

  clearOtpSession: () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
    localStorage.removeItem(STORAGE_KEYS.SESSION_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.SESSION_PURPOSE);
    localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
  },

  // Đăng ký tài khoản mới
  register: async (userData) => {
    try {
      console.log('Attempting to register with data:', {
        ...userData,
        password: '[HIDDEN]',
        confirmPassword: '[HIDDEN]'
      });

      const response = await fetch(`${API_URL}/register`, {
        ...fetchConfig,
        method: 'POST',
        body: JSON.stringify({
          fullName: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          password: userData.password,
          confirmPassword: userData.confirmPassword
        }),
      });
      
      const result = await handleResponse(response);
      console.log('Register API response:', result);
      
      // Nếu đăng ký thành công, kiểm tra phản hồi có bao gồm dữ liệu về OTP không
      if (result.success && result.data) {
        // Kiểm tra nếu API đã tự động gửi OTP và trả về thông tin phiên
        if (result.data.sessionId || result.data.verificationId) {
          console.log('API returned session data with registration response, no need to send OTP separately');
        } else {
          console.log('API did not return session data, may need to send OTP separately');
        }
      }
      
      return result;
    } catch (error) {
      console.error('Register error details:', {
        message: error.message,
        stack: error.stack,
        type: error.name
      });
      
      return {
        success: false,
        status: 0,
        data: null,
        message: 'Lỗi kết nối, vui lòng thử lại sau',
        error: error.message
      };
    }
  },
  
  // Đăng nhập
  login: async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      
      const response = await fetch(`${API_URL}/login`, {
        ...fetchConfig,
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      const result = await handleResponse(response);
      console.log('Login API response:', result);
      
      if (result.success && result.data) {
        authService.saveAuthData(result.data);
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Xác thực OTP chung
  verifyOtp: async (email, otp, verificationId) => {
    try {
      const session = authService.getOtpSession();
      
      console.log('Verifying OTP:', {
        email,
        otp,
        verificationId,
        session
      });
      
      if (!session) {
        return {
          success: false,
          status: 400,
          message: 'Phiên xác thực không tồn tại hoặc đã hết hạn'
        };
      }

      // Cấu trúc request theo API spec
      const requestBody = {
        email: email,
        verificationId: verificationId,
        otp: otp.toString()
      };
      
      const apiEndpoint = `${API_URL}/verify-otp`;
      console.log('Sending verification request:', {
        url: apiEndpoint,
        body: requestBody
      });
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });
      
      // Log response details for debugging
      console.log('Response details:', {
        url: apiEndpoint,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Verification failed:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          request: requestBody
        });
        
        return {
          success: false,
          status: response.status,
          message: 'Xác thực OTP thất bại. Vui lòng thử lại.',
          error: errorText
        };
      }

      const result = await handleResponse(response);
      console.log('Verification result:', result);
      
      if (result.success) {
        if (result.data) {
          console.log('Saving auth data:', result.data);
          authService.saveAuthData(result.data);
        }
        authService.clearOtpSession();
      }
      
      return result;
    } catch (error) {
      console.error('Verification error:', error);
      return {
        success: false,
        status: 0,
        message: 'Lỗi kết nối, vui lòng thử lại',
        error: error.message
      };
    }
  },

  // Alias cho verifyOtp để tương thích ngược
  verifyLoginOtp: (email, sessionId, otpCode) => {
    return authService.verifyOtp(email, otpCode, sessionId);
  },
  
  // Gửi OTP cho một mục đích cụ thể
  sendOtp: async (email, purpose) => {
    try {
      console.log(`Sending OTP for ${email} with purpose: ${purpose}`);
      const response = await fetch(`${API_URL}/send-otp`, {
        ...fetchConfig,
        method: 'POST',
        body: JSON.stringify({ email, purpose }),
      });
      
      const result = await handleResponse(response);
      console.log('Send OTP result:', result);
      
      return result;
    } catch (error) {
      console.error('Send OTP error:', error);
      return {
        success: false,
        data: null,
        message: 'Lỗi kết nối khi gửi OTP',
        error: error.message
      };
    }
  },
  
  // Yêu cầu đặt lại mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        ...fetchConfig,
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      
      const result = await handleResponse(response);
      console.log('Forgot password API response:', result);
      
      // Nếu thành công và có sessionId, lưu vào localStorage
      if (result.success && result.data && result.data.sessionId) {
        authService.saveOtpSession(
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
            ...fetchConfig,
            method: 'POST',
            body: JSON.stringify({ 
              email, 
              purpose: 'reset-password' 
            }),
          });
          
          const otpResult = await handleResponse(otpResponse);
          console.log('Send OTP for reset password response:', otpResult);
          
          // Lưu sessionId từ API send-otp
          if (otpResult.success && otpResult.data && otpResult.data.sessionId) {
            authService.saveOtpSession(
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
  resetPassword: async (email, otp, newPassword, confirmPassword, verificationId) => {
    try {
      console.log('Resetting password for:', email);
      
      // Danh sách các URL endpoint có thể sử dụng
      const endpoints = [
        'reset-password',
        'change-password-after-otp'
      ];
      
      // Thử từng endpoint
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          
          const response = await fetch(`${API_URL}/${endpoint}`, {
            ...fetchConfig,
            method: 'POST',
            body: JSON.stringify({
              email,
              otp,
              newPassword,
              confirmPassword,
              verificationId,
              sessionId: verificationId  // Thêm cả sessionId để tương thích
            }),
          });
          
          const result = await handleResponse(response);
          console.log(`${endpoint} result:`, result);
          
          if (result.success) {
            return result;
          }
        } catch (endpointError) {
          console.error(`Error trying ${endpoint}:`, endpointError);
        }
      }
      
      // Nếu không có endpoint nào thành công
      return {
        success: false,
        message: 'Không thể đặt lại mật khẩu, vui lòng thử lại sau'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Lỗi kết nối, vui lòng thử lại sau',
        error: error.message
      };
    }
  },
  
  // Làm mới token
  refreshToken: async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_URL}/refresh-token`, {
        ...fetchConfig,
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });

      const data = await handleResponse(response);
      if (data && data.token) {
        authService.saveAuthData(data);
        return data;
      }
      throw new Error('Failed to refresh token');
    } catch (error) {
      console.error('Refresh token error:', error);
      authService.clearAuthData();
      throw error;
    }
  },
  
  // Đăng xuất
  logout: async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      if (refreshToken) {
        await fetch(`${API_URL}/revoke-token`, {
          ...fetchConfig,
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.clearAuthData();
      window.location.href = '/login';
    }
  },
  
  // Lấy thông tin phiên OTP hiện tại
  getCurrentSession: () => {
    return authService.getOtpSession();
  },
  
  // Xóa phiên OTP hiện tại
  clearSession: () => {
    authService.clearOtpSession();
  },

  getUserRole: () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      console.log('Token from localStorage:', token); // Debug token

      if (!token) {
        console.log('No token found');
        return null;
      }
      
      const decodedToken = jwtDecode(token);
      console.log('Decoded token:', decodedToken); // Debug decoded token

      // Kiểm tra các trường hợp khác nhau của role trong token
      const role = decodedToken.role || 
                  decodedToken.Role || 
                  decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
                  decodedToken.roles;
                  
      console.log('Extracted role:', role); // Debug extracted role
      return role;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  },

  isAdmin: () => {
    const role = authService.getUserRole();
    return role === 'ADMIN';
  },

  isOwner: () => {
    const role = authService.getUserRole();
    return role === 'OWNER';
  },

  hasManagementAccess: () => {
    const role = authService.getUserRole();
    return role === 'ADMIN' || role === 'OWNER';
  }
};

export default authService; 