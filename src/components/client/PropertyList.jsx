import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import propertyService from '../../services/client/propertyService';
import apiHelper from '../../services/client/apiHelper';
import { FaMapMarkerAlt, FaRulerCombined, FaBed, FaBath, FaSearch, FaFilter, FaSortAmountDown, FaRegHeart, FaHeart } from 'react-icons/fa';
import './PropertyList.css';
import BackToTop from './BackToTop';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noDataMessage, setNoDataMessage] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    propertyType: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    searchTerm: '',
    approvedOnly: false
  });
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageChanging, setIsPageChanging] = useState(false);

  const getPropertyImages = (property) => {
    if (property.images && property.images.length > 0) {
      const validImages = property.images.filter(img => img && img.trim() !== '');
      if (validImages.length > 0) {
        return validImages;
      }
    }
    
    if (property.featuredImage) {
      return [property.featuredImage];
    }
    
    return ['/img/property-default.jpg'];
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const result = await propertyService.getProperties(filters);
      
      if (result.success && result.data) {
        const propertyData = Array.isArray(result.data) ? result.data : 
                           result.data.data ? result.data.data :
                           result.data.items ? result.data.items : [];
                           
        setProperties(propertyData);
        
        // Tính toán tổng số trang
        const total = result.data.totalPages || Math.ceil(propertyData.length / filters.limit);
        setTotalPages(total > 0 ? total : 1);
        
        setError(null);
      } else {
        setProperties([]);
        setError('Không có dữ liệu bất động sản');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setProperties([]);
      setError('Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (isPageChanging) {
      // Khi fetchProperties hoàn tất, sẽ tắt trạng thái đang tải
      const timer = setTimeout(() => {
        setIsPageChanging(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [properties, isPageChanging]);

  // Hàm kiểm tra dữ liệu đầu vào
  const validatePropertiesData = (data) => {
    if (!data || data.length === 0) {
      console.log("Không có dữ liệu bất động sản");
      return false;
    }

    // Kiểm tra các trường dữ liệu cần thiết
    const requiredFields = ['realEstateID', 'title', 'price', 'area'];
    const missingFields = [];

    data.forEach((property, index) => {
      const propertyId = property.realEstateID || property.id || `property_at_index_${index}`;
      requiredFields.forEach(field => {
        if (property[field] === undefined || property[field] === null) {
          missingFields.push(`${field} (ID: ${propertyId})`);
          console.warn(`Thiếu trường ${field} trong bất động sản ID: ${propertyId}`);
        }
      });
    });

    if (missingFields.length > 0) {
      console.warn("Có các trường dữ liệu bị thiếu:", missingFields);
      // Vẫn tiếp tục trả về true vì chúng ta vẫn muốn hiển thị dữ liệu
      return true;
    }

    console.log("Dữ liệu hợp lệ, tất cả các trường cần thiết đều tồn tại");
    return true;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== filters.page) {
      setIsPageChanging(true);
      
      // Cuộn lên đầu danh sách bất động sản
      const propertyListElement = document.querySelector('.property-grid');
      if (propertyListElement) {
        propertyListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      // Cập nhật state trang hiện tại
      setCurrentPage(newPage);
      
      // Tạo hiệu ứng đang tải bằng cách trì hoãn một chút
      setTimeout(() => {
        setFilters(prev => ({
          ...prev,
          page: newPage
        }));
        
        // Khi đã cập nhật filters, setIsPageChanging sẽ được tắt trong useEffect
      }, 300);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/img/property-default.jpg';
  };

  // Kiểm tra xem một bất động sản có được yêu thích hay không
  const isFavorite = (propertyId) => {
    return favorites.includes(propertyId);
  };

  // Xử lý khi nhấp vào nút yêu thích
  const toggleFavorite = (e, propertyId) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ Link
    e.stopPropagation(); // Ngăn chặn sự kiện lan ra các phần tử cha
    
    console.log("Toggle favorite for:", propertyId);
    
    if (isFavorite(propertyId)) {
      // Nếu đã yêu thích, xóa khỏi danh sách
      setFavorites(favorites.filter(id => id !== propertyId));
    } else {
      // Nếu chưa yêu thích, thêm vào danh sách
      setFavorites([...favorites, propertyId]);
    }
  };

  if (loading) {
    return (
      <div className="property-list">
        <div className="container">
          <div className="spinner-container">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p>Đang tải danh sách bất động sản...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-list">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            <h3>Không tìm thấy dữ liệu</h3>
            <p>{error}</p>
            <div className="mt-3">
              <button className="btn btn-primary me-2" onClick={fetchProperties}>
                <i className="fas fa-sync-alt me-2"></i>Tải lại dữ liệu
              </button>
              <Link to="/" className="btn btn-secondary">
                <i className="fas fa-home me-2"></i>Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="property-breadcrumb">
        <div className="container">
          <h1 className="breadcrumb-title text-center">Danh Sách Bất Động Sản</h1>
        </div>
      </div>

      <div className="property-list">
        <div className="container">
          <div className="property-list-header text-center">
            <h2>Khám Phá Bất Động Sản</h2>
            <p>Tìm kiếm và khám phá các bất động sản đang được rao bán và cho thuê với đa dạng lựa chọn phù hợp với nhu cầu của bạn</p>
          </div>

          <div className="filters-container">
            <div className="filter-item">
              <FaFilter className="filter-icon" />
              <select 
                className="filter-select"
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
              >
                <option value="">Tất cả loại BĐS</option>
                <option value="apartment">Chung cư</option>
                <option value="house">Nhà phố</option>
                <option value="villa">Biệt thự</option>
                <option value="land">Đất nền</option>
              </select>
            </div>

            <div className="filter-item">
              <FaSearch className="filter-icon" />
              <select 
                className="filter-select"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Trạng thái</option>
                <option value="rent">Cho thuê</option>
                <option value="sale">Đang bán</option>
              </select>
            </div>

            <div className="filter-item">
              <FaSortAmountDown className="filter-icon" />
              <select 
                className="filter-select"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
              >
                <option value="createdAt">Mới nhất</option>
                <option value="priceAsc">Giá tăng dần</option>
                <option value="priceDesc">Giá giảm dần</option>
                <option value="areaAsc">Diện tích tăng dần</option>
                <option value="areaDesc">Diện tích giảm dần</option>
              </select>
            </div>
          </div>

          <div className="property-grid">
            {isPageChanging ? (
              <div className="page-changing-spinner">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Đang tải trang...</span>
                </div>
                <p>Đang tải dữ liệu trang {currentPage}...</p>
              </div>
            ) : properties.length > 0 ? (
              properties.map((property) => (
                <div key={property.realEstateID || property.id} className="property-card" data-type={property.propertyTypeName?.toLowerCase()}>
                  <div className="property-image">
                    <img 
                      src={getPropertyImages(property)[0]}
                      alt={property.title || "Bất động sản"}
                      onError={handleImageError}
                    />
                    <span className="property-tag">
                      {property.transactionTypeName || (property.transactionTypeID === 2 ? 'Cho thuê' : (property.status === 'rent' ? 'Cho thuê' : 'Đang bán'))}
                    </span>
                    <button 
                      className="favorite-btn" 
                      onClick={(e) => toggleFavorite(e, property.realEstateID || property.id)}
                    >
                      {isFavorite(property.realEstateID || property.id) ? (
                        <FaHeart className="favorite-icon" />
                      ) : (
                        <FaRegHeart className="favorite-icon" />
                      )}
                    </button>
                  </div>
                  <div className="property-content">
                    <div className="property-type">
                      {property.propertyTypeName || 'Bất động sản'}
                    </div>
                    <Link to={`/properties/${property.realEstateID || property.id}`} className="property-title">
                      {property.title 
                        ? property.title.split(' ').length > 8 
                          ? property.title.split(' ').slice(0, 8).join(' ') + '...'
                          : property.title
                        : "Bất động sản không có tiêu đề"}
                    </Link>
                    <div className="property-price">
                      {property.price ? formatPrice(property.price) : "Đang cập nhật"}
                    </div>
                    <div className="property-location">
                      <FaMapMarkerAlt />
                      <span>
                        {[property.wardName, property.districtName, property.provinceName].filter(Boolean).join(', ') || "Đang cập nhật vị trí"}
                      </span>
                    </div>
                    <div className="property-features">
                      <div className="feature">
                        <FaRulerCombined />
                        <span>{property.area ? `${property.area} m²` : "N/A"}</span>
                      </div>
                      <div className="feature">
                        <FaBed />
                        <span>{property.bedrooms || '0'} PN</span>
                      </div>
                      <div className="feature">
                        <FaBath />
                        <span>{property.bathrooms || '0'} PT</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <h3>Không tìm thấy bất động sản nào</h3>
                {noDataMessage && (
                  <div className="alert alert-info">
                    <strong>Thông báo hệ thống:</strong> {noDataMessage}
                  </div>
                )}
                <p>Có thể do một trong các nguyên nhân sau:</p>
                <ul className="text-left">
                  <li>Không có bất động sản nào trong hệ thống</li>
                  <li>Bất động sản có StatusID chưa được duyệt (StatusID = 1)</li>
                  <li>Có vấn đề về kết nối API giữa Frontend và Backend</li>
                  <li>Bộ lọc hiện tại không khớp với dữ liệu trong cơ sở dữ liệu</li>
                </ul>
                <p className="mt-3">Thử các giải pháp sau:</p>
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      console.log("Đang refresh dữ liệu...");
                      fetchProperties();
                    }}
                  >
                    <i className="fas fa-sync-alt me-2"></i> Làm mới dữ liệu
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setFilters({
                      page: 1,
                      limit: 10,
                      sortBy: 'createdAt',
                      sortOrder: 'desc',
                      propertyType: '',
                      status: '',
                      minPrice: '',
                      maxPrice: '',
                      location: '',
                      searchTerm: '',
                      approvedOnly: false
                    })}
                  >
                    <i className="fas fa-filter-slash me-2"></i> Xóa bộ lọc
                  </button>
                  <button 
                    className="btn btn-info"
                    onClick={async () => {
                      try {
                        const exactUrl = 'http://localhost:5278/api/properties?page=1&limit=10';
                        console.log("Kiểm tra API trực tiếp:", exactUrl);
                        
                        const response = await fetch(exactUrl);
                        const data = await response.json();
                        console.log("Dữ liệu từ API trực tiếp:", data);
                        
                        // Hiển thị thông báo dễ hiểu
                        if (data) {
                          let propertyData = [];
                          
                          if (Array.isArray(data)) {
                            propertyData = data;
                          } else if (data.data && Array.isArray(data.data)) {
                            propertyData = data.data;
                          } else if (data.items && Array.isArray(data.items)) {
                            propertyData = data.items;
                          }
                          
                          if (propertyData.length > 0) {
                            // Cập nhật state và hiển thị dữ liệu mới
                            setProperties(propertyData);
                            alert(`Đã tìm thấy ${propertyData.length} bất động sản từ API!`);
                          } else {
                            alert("API trả về 0 bất động sản. Kiểm tra xem đã có dữ liệu trong hệ thống chưa.");
                          }
                        } else {
                          alert("API trả về dữ liệu không hợp lệ hoặc rỗng!");
                        }
                      } catch (error) {
                        console.error("Lỗi khi truy cập API trực tiếp:", error);
                        alert("Lỗi kết nối API: " + error.message);
                      }
                    }}
                  >
                    <i className="fas fa-server me-2"></i> Kiểm tra API
                  </button>
                </div>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className={`page-link ${filters.page === 1 ? 'disabled' : ''}`}
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
              >
                Previous
              </button>
              
              {(() => {
                const pageButtons = [];
                const maxPagesToShow = 5;
                const showEllipsis = totalPages > maxPagesToShow;
                
                if (showEllipsis) {
                  // Luôn hiển thị trang đầu tiên
                  pageButtons.push(
                    <button
                      key={1}
                      className={`page-link ${filters.page === 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </button>
                  );
                  
                  // Hiển thị dấu "..." nếu trang hiện tại > 3
                  if (filters.page > 3) {
                    pageButtons.push(
                      <button key="ellipsis1" className="page-link ellipsis" disabled>
                        ...
                      </button>
                    );
                  }
                  
                  // Hiển thị các trang xung quanh trang hiện tại
                  const startPage = Math.max(2, filters.page - 1);
                  const endPage = Math.min(totalPages - 1, filters.page + 1);
                  
                  for (let i = startPage; i <= endPage; i++) {
                    pageButtons.push(
                      <button
                        key={i}
                        className={`page-link ${filters.page === i ? 'active' : ''}`}
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </button>
                    );
                  }
                  
                  // Hiển thị dấu "..." nếu trang hiện tại < totalPages - 2
                  if (filters.page < totalPages - 2) {
                    pageButtons.push(
                      <button key="ellipsis2" className="page-link ellipsis" disabled>
                        ...
                      </button>
                    );
                  }
                  
                  // Luôn hiển thị trang cuối cùng
                  if (totalPages > 1) {
                    pageButtons.push(
                      <button
                        key={totalPages}
                        className={`page-link ${filters.page === totalPages ? 'active' : ''}`}
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    );
                  }
                } else {
                  // Nếu tổng số trang <= maxPagesToShow, hiển thị tất cả các trang
                  for (let i = 1; i <= totalPages; i++) {
                    pageButtons.push(
                      <button
                        key={i}
                        className={`page-link ${filters.page === i ? 'active' : ''}`}
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </button>
                    );
                  }
                }
                
                return pageButtons;
              })()}
              
              <button
                className={`page-link ${filters.page === totalPages ? 'disabled' : ''}`}
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Back to Top Button */}
      <BackToTop />
    </>
  );
};

export default PropertyList; 