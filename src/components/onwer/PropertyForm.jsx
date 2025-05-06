import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaTrash, FaHome, FaMapMarkerAlt, FaInfoCircle, FaImages, 
         FaBed, FaBath, FaParking, FaSwimmingPool, FaTree, FaDumbbell, 
         FaWifi, FaShieldAlt, FaBuilding, FaFan } from 'react-icons/fa';
import './PropertyForm.css';

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
    direction: '', // Hướng nhà
    legalStatus: '', // Tình trạng pháp lý
    furniture: '', // Tình trạng nội thất
    balconyDirection: '', // Hướng ban công
    images: [],
    status: 'draft'
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
    'Mặt bằng kinh doanh',
    'Nhà phố thương mại',
    'Phòng trọ',
    'Kho, xưởng',
    'Resort, nghỉ dưỡng'
  ];

  const features = [
    { icon: <FaBed />, name: 'Phòng ngủ master' },
    { icon: <FaBath />, name: 'Phòng tắm riêng' },
    { icon: <FaParking />, name: 'Chỗ đậu xe' },
    { icon: <FaSwimmingPool />, name: 'Hồ bơi' },
    { icon: <FaTree />, name: 'Sân vườn' },
    { icon: <FaDumbbell />, name: 'Phòng gym' },
    { icon: <FaWifi />, name: 'Internet' },
    { icon: <FaShieldAlt />, name: 'An ninh 24/7' },
    { icon: <FaBuilding />, name: 'Thang máy' },
    { icon: <FaFan />, name: 'Điều hòa' },
    { icon: <FaHome />, name: 'Ban công' },
    { icon: <FaHome />, name: 'Nhà bếp riêng' },
    { icon: <FaHome />, name: 'Tủ lạnh' },
    { icon: <FaHome />, name: 'Máy giặt' },
    { icon: <FaHome />, name: 'Truyền hình cáp' },
    { icon: <FaHome />, name: 'Tủ quần áo' }
  ];

  const directions = [
    'Đông',
    'Tây',
    'Nam',
    'Bắc',
    'Đông-Bắc',
    'Tây-Bắc',
    'Đông-Nam',
    'Tây-Nam'
  ];

  const legalStatuses = [
    'Sổ đỏ/Sổ hồng',
    'Hợp đồng mua bán',
    'Đang chờ sổ',
    'Giấy tờ khác'
  ];

  const furnitureStatuses = [
    'Đầy đủ',
    'Cơ bản',
    'Không nội thất'
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
      navigate('/onwer/quan-ly-bai-dang');
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
          <h3><FaHome /> Thông tin cơ bản</h3>
          
          <div className="form-group">
            <label htmlFor="title">Tiêu đề <span className="required">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="form-control"
              placeholder="VD: Căn hộ cao cấp view sông, full nội thất"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả chi tiết <span className="required">*</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="form-control"
              rows="5"
              placeholder="Mô tả chi tiết về bất động sản (vị trí, đặc điểm nổi bật, tiện ích xung quanh...)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Giá (VNĐ) <span className="required">*</span></label>
              <div className="input-group">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                  placeholder="VD: 2000000000"
                />
                <div className="input-group-append">
                  <span className="input-group-text">VNĐ</span>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="area">Diện tích (m²) <span className="required">*</span></label>
              <div className="input-group">
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                  placeholder="VD: 100"
                />
                <div className="input-group-append">
                  <span className="input-group-text">m²</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="direction">Hướng nhà</label>
              <select
                id="direction"
                name="direction"
                value={formData.direction}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Chọn hướng</option>
                {directions.map((direction, index) => (
                  <option key={index} value={direction}>{direction}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="balconyDirection">Hướng ban công</label>
              <select
                id="balconyDirection"
                name="balconyDirection"
                value={formData.balconyDirection}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Chọn hướng</option>
                {directions.map((direction, index) => (
                  <option key={index} value={direction}>{direction}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><FaMapMarkerAlt /> Địa chỉ bất động sản</h3>
          
          <div className="form-group">
            <label htmlFor="address">Địa chỉ cụ thể <span className="required">*</span></label>
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
            <div className="form-group">
              <label htmlFor="city">Tỉnh/Thành phố <span className="required">*</span></label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="form-control"
                placeholder="VD: Hồ Chí Minh"
              />
            </div>
            <div className="form-group">
              <label htmlFor="district">Quận/Huyện <span className="required">*</span></label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                required
                className="form-control"
                placeholder="VD: Quận 7"
              />
            </div>
            <div className="form-group">
              <label htmlFor="ward">Phường/Xã <span className="required">*</span></label>
              <input
                type="text"
                id="ward"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                required
                className="form-control"
                placeholder="VD: Phường Tân Phú"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><FaInfoCircle /> Thông tin chi tiết</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="propertyType">Loại bất động sản <span className="required">*</span></label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
                className="form-control"
              >
                <option value="">Chọn loại bất động sản</option>
                {propertyTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="legalStatus">Tình trạng pháp lý</label>
              <select
                id="legalStatus"
                name="legalStatus"
                value={formData.legalStatus}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Chọn tình trạng pháp lý</option>
                {legalStatuses.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bedrooms">Số phòng ngủ</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                className="form-control"
                min="0"
                placeholder="VD: 3"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bathrooms">Số phòng tắm</label>
              <input
                type="number"
                id="bathrooms"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                className="form-control"
                min="0"
                placeholder="VD: 2"
              />
            </div>
            <div className="form-group">
              <label htmlFor="furniture">Tình trạng nội thất</label>
              <select
                id="furniture"
                name="furniture"
                value={formData.furniture}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Chọn tình trạng nội thất</option>
                {furnitureStatuses.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tiện ích</label>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <input
                    type="checkbox"
                    id={`feature-${index}`}
                    checked={formData.features.includes(feature.name)}
                    onChange={() => handleFeatureToggle(feature.name)}
                  />
                  <label htmlFor={`feature-${index}`}>
                    {feature.icon} {feature.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><FaImages /> Hình ảnh</h3>
          
          <div className="image-upload-container">
            <label htmlFor="images" className="image-upload-label">
              <FaUpload /> Tải lên hình ảnh
            </label>
            <p className="upload-hint">Hỗ trợ: JPG, PNG (Tối đa 10 hình)</p>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="image-upload-input"
            />
            
            <div className="image-preview-container">
              {previewImages.map((url, index) => (
                <div key={index} className="image-preview-item">
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="remove-image-btn"
                    title="Xóa ảnh"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Hủy
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng tin ngay'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm; 