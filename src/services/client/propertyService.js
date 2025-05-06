import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/properties`;

// Cấu hình axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

// Thêm interceptor để tự động thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request Config:', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi phản hồi
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    if (error.code === 'ECONNABORTED') {
      console.error('Kết nối bị hủy do timeout');
    }
    return Promise.reject(error);
  }
);

const propertyService = {
  // Lấy danh sách bất động sản với phân trang và lọc
  getProperties: async (params = {}) => {
    try {
      // Thêm timestamp để tránh cache
      const noCacheParams = {
        ...params,
        _nocache: new Date().getTime()
      };
      
      console.log("Fetching properties with params:", noCacheParams);
      
      // Kiểm tra nếu params có limit thay vì pageSize
      if (noCacheParams.limit && !noCacheParams.pageSize) {
        noCacheParams.pageSize = noCacheParams.limit;
      }
      
      // Thử trực tiếp với URL cụ thể trước
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5278/api';
      const directURL = `${baseURL}/properties?page=${noCacheParams.page || 1}&limit=${noCacheParams.limit || 10}`;
      
      console.log("Direct API URL:", directURL);
      
      try {
        // Thử gọi trực tiếp URL API
        const directResponse = await axios.get(directURL);
        console.log("Direct API response:", directResponse);
        
        if (directResponse.data) {
          return {
            success: true,
            data: directResponse.data,
            message: 'Lấy danh sách bất động sản thành công (direct URL)'
          };
        }
      } catch (directError) {
        console.log("Direct API call failed, falling back to configured endpoint", directError);
      }
      
      // Fallback: Sử dụng axiosInstance đã cấu hình
      const response = await axiosInstance.get('', { params: noCacheParams });
      
      console.log("API raw response:", response);
      return {
        success: true,
        data: response.data,
        message: 'Lấy danh sách bất động sản thành công'
      };
    } catch (error) {
      console.error('Get properties error:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Lỗi kết nối đến server',
        error: error.message
      };
    }
  },

  // Lấy chi tiết một bất động sản
  getPropertyById: async (id) => {
    try {
      const response = await axiosInstance.get(`/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Lấy thông tin bất động sản thành công'
      };
    } catch (error) {
      console.error('Get property details error:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Lỗi kết nối đến server',
        error: error.message
      };
    }
  },

  // Lấy danh sách bất động sản nổi bật
  getFeaturedProperties: async (limit = 6) => {
    try {
      const response = await axiosInstance.get('/featured', {
        params: { limit }
      });
      return {
        success: true,
        data: response.data,
        message: 'Lấy danh sách bất động sản nổi bật thành công'
      };
    } catch (error) {
      console.error('Get featured properties error:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Lỗi kết nối đến server',
        error: error.message
      };
    }
  },

  // Lấy danh sách bất động sản liên quan
  getRelatedProperties: async (propertyId, limit = 3) => {
    try {
      const response = await axiosInstance.get(`/${propertyId}/related`, {
        params: { limit }
      });
      return {
        success: true,
        data: response.data,
        message: 'Lấy danh sách bất động sản liên quan thành công'
      };
    } catch (error) {
      console.error('Get related properties error:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Lỗi kết nối đến server',
        error: error.message
      };
    }
  },

  // Lấy danh sách bất động sản yêu thích của người dùng
  getFavorites: async () => {
    try {
      const response = await axiosInstance.get('/favorites');
      return response.data || [];
    } catch (error) {
      console.error('Get favorites error:', error);
      return [];
    }
  },

  // Thêm một bất động sản vào danh sách yêu thích
  addFavorite: async (propertyId) => {
    try {
      const response = await axiosInstance.post('/favorites', { propertyId });
      return {
        success: true,
        data: response.data,
        message: 'Đã thêm vào danh sách yêu thích'
      };
    } catch (error) {
      console.error('Add favorite error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi thêm vào yêu thích',
        error: error.message
      };
    }
  },

  // Xóa một bất động sản khỏi danh sách yêu thích
  removeFavorite: async (propertyId) => {
    try {
      const response = await axiosInstance.delete(`/favorites/${propertyId}`);
      return {
        success: true,
        data: response.data,
        message: 'Đã xóa khỏi danh sách yêu thích'
      };
    } catch (error) {
      console.error('Remove favorite error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Lỗi khi xóa khỏi yêu thích',
        error: error.message
      };
    }
  }
};

export default propertyService; 