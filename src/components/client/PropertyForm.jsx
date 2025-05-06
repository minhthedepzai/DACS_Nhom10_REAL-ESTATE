import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaTrash } from 'react-icons/fa';
import './css/PropertyForm.css';

const PropertyForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    area: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    features: [],
    images: [],
    status: 'draft' // draft, pending, published
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const propertyTypes = [
    'Căn hộ chung cư',
    'Nhà riêng',
    'Biệt thự',
    'Đất nền',
    'Văn phòng',
    'Mặt bằng kinh doanh'
  ];

  const features = [
    'Ban công',
    'Hồ bơi',
    'Bảo vệ 24/7',
    'Chỗ đậu xe',
    'Nội thất',
    'Thang máy',
    'Sân vườn',
    'Gym'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Tạo FormData để upload ảnh
      const submitData = new FormData();
      imageFiles.forEach(file => {
        submitData.append('images', file);
      });

      // Thêm các trường dữ liệu khác
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          submitData.append(key, 
            Array.isArray(formData[key]) 
              ? JSON.stringify(formData[key]) 
              : formData[key]
          );
        }
      });

      // TODO: Gọi API để lưu dữ liệu
      // const response = await propertyService.createProperty(submitData);
      
      // Redirect sau khi lưu thành công
      navigate('/properties');
    } catch (err) {
      setError('Có lỗi xảy ra khi đăng tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  return (
    <div className="property-form-container">
      <h2 className="form-title">Đăng tin bất động sản</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="property-form">
        <div className="form-section">
          <h3>Thông tin cơ bản</h3>
          
          <div className="form-group">
            <label htmlFor="title">Tiêu đề</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="form-control"
              placeholder="Nhập tiêu đề tin đăng"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="form-control"
              rows="5"
              placeholder="Mô tả chi tiết về bất động sản"
            />
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="price">Giá (VNĐ)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="form-control"
                placeholder="Nhập giá"
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="area">Diện tích (m²)</label>
              <input
                type="number"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                className="form-control"
                placeholder="Nhập diện tích"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Địa chỉ</h3>
          
          <div className="form-group">
            <label htmlFor="address">Địa chỉ cụ thể</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="form-control"
              placeholder="Số nhà, tên đường"
            />
          </div>

          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="city">Tỉnh/Thành phố</label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="form-control"
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {/* TODO: Add city options */}
              </select>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="district">Quận/Huyện</label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                required
                className="form-control"
              >
                <option value="">Chọn quận/huyện</option>
                {/* TODO: Add district options */}
              </select>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="ward">Phường/Xã</label>
              <select
                id="ward"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                required
                className="form-control"
              >
                <option value="">Chọn phường/xã</option>
                {/* TODO: Add ward options */}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Thông tin chi tiết</h3>
          
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="propertyType">Loại bất động sản</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
                className="form-control"
              >
                <option value="">Chọn loại</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="bedrooms">Số phòng ngủ</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="form-control"
                min="0"
                placeholder="Số phòng ngủ"
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="bathrooms">Số phòng tắm</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="form-control"
                min="0"
                placeholder="Số phòng tắm"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tiện ích</label>
            <div className="features-grid">
              {features.map(feature => (
                <div key={feature} className="feature-item">
                  <input
                    type="checkbox"
                    id={`feature-${feature}`}
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                  />
                  <label htmlFor={`feature-${feature}`}>{feature}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Hình ảnh</h3>
          
          <div className="image-upload-container">
            <div className="image-upload-button">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
              <label htmlFor="images" className="upload-label">
                <FaUpload />
                <span>Tải ảnh lên</span>
              </label>
            </div>

            <div className="image-preview-grid">
              {previewImages.map((url, index) => (
                <div key={index} className="image-preview-item">
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng tin'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm; 