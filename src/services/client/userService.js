import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/api/users` 
  : 'http://localhost:5278/api/users';

// Hàm helper để lấy headers với token mới
const getHeaders = async () => {
  const token = await authService.getToken(); // Đợi lấy token mới nếu cần
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

// Hàm helper để xử lý response
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
      // Token hết hạn, chuyển về trang login
      authService.logout();
      return;
    }
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }

  return data;
};

const userService = {
  // Lấy thông tin user
  getUserInfo: async () => {
    try {
      console.log('Fetching user info from:', `${API_URL}/info`);
      
      const headers = await getHeaders();
      console.log('Request headers:', headers);

      const response = await fetch(`${API_URL}/info`, {
        method: 'GET',
        headers,
        credentials: 'include'
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error in getUserInfo:', error);
      throw error;
    }
  },

  // Cập nhật thông tin user
  updateUserInfo: async (userData) => {
    try {
      console.log('Updating user info:', userData);

      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/update`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error in updateUserInfo:', error);
      throw error;
    }
  }
};

export default userService; 