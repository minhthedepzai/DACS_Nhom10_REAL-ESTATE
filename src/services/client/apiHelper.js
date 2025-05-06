import axios from 'axios';

// URL API chính
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5278/api';

// Cấu hình chung cho các yêu cầu API
const defaultConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000
};

// Helper để thêm auth token nếu có
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Bọc fetch API với xử lý lỗi và quản lý token
 */
const apiHelper = {
  /**
   * Lấy danh sách bất động sản từ API
   * @param {Object} params Tham số truy vấn
   * @returns {Promise<Array>} Danh sách bất động sản
   */
  getProperties: async (params = {}) => {
    try {
      console.log('Fetching properties with params:', params);
      
      // Chuẩn bị URL với tham số truy vấn
      let url = `${API_BASE_URL}/properties`;
      
      // Thêm query params
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.propertyType) queryParams.append('propertyType', params.propertyType);
      
      // Ngăn cache bằng timestamp
      queryParams.append('_nocache', Date.now());
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      
      console.log('Requesting URL:', url);
      
      // Thực hiện yêu cầu API
      const response = await axios.get(url, {
        ...defaultConfig,
        headers: {
          ...defaultConfig.headers,
          ...getAuthHeader()
        }
      });
      
      console.log('API response:', response);
      
      // Xử lý phản hồi
      if (response.status === 200) {
        // Kiểm tra cấu trúc dữ liệu
        const data = response.data;
        
        // Xác định dữ liệu bất động sản từ phản hồi
        if (Array.isArray(data)) {
          return data;
        } else if (data && data.data && Array.isArray(data.data)) {
          return data.data;
        } else if (data && data.items && Array.isArray(data.items)) {
          return data.items;
        } else if (data && data.data && data.data.items && Array.isArray(data.data.items)) {
          return data.data.items;
        } else {
          console.error('Unexpected API response structure:', data);
          return [];
        }
      } else {
        console.error('API returned non-200 status:', response.status);
        return [];
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  },
  
  /**
   * Lấy chi tiết bất động sản từ API
   * @param {number|string} id ID của bất động sản
   * @returns {Promise<Object>} Chi tiết bất động sản
   */
  getPropertyById: async (id) => {
    try {
      const url = `${API_BASE_URL}/properties/${id}`;
      console.log('Fetching property details from:', url);
      
      const response = await axios.get(url, {
        ...defaultConfig,
        headers: {
          ...defaultConfig.headers,
          ...getAuthHeader()
        }
      });
      
      console.log('Property details response:', response);
      
      if (response.status === 200) {
        return response.data;
      } else {
        console.error('API returned non-200 status:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
      return null;
    }
  }
};

export default apiHelper; 