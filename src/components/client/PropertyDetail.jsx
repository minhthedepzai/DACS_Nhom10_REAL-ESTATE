import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaHome, FaBed, FaBath, FaRulerCombined, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane, FaUser, FaFireAlt, FaChevronRight, FaArrowRight, FaSearchLocation, FaBuilding, FaChartLine, FaArrowUp, FaMinus, FaChartPie, FaClock, FaSearchDollar, FaInfoCircle, FaSubway, FaCity, FaWarehouse, FaFlag, FaExclamationTriangle } from 'react-icons/fa';
import { BsFullscreen, BsHeart, BsHeartFill, BsArrowLeft, BsArrowRight, BsX, BsStarFill, BsStar } from 'react-icons/bs';
import propertyService from '../../services/client/propertyService';
import authService from '../../services/client/authService';
import Footer from './Footer';
import './css/PropertyDetail.css';
import './css/AgentContactForm.css';
import './css/MarketAnalysis.css';
import './css/ReportModal.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5278/api';

// Cấu hình cho fetch API
const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  mode: 'cors',
  cache: 'no-cache'
};

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentThumbnailPage, setCurrentThumbnailPage] = useState(0);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [contactExpanded, setContactExpanded] = useState(false);
  const [agentFormData, setAgentFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [agentFormStatus, setAgentFormStatus] = useState({
    submitted: false,
    success: false,
    error: ''
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  // Helper function to get property images
  const getPropertyImages = (propertyId) => {
    // Tạo một mảng ảnh dựa trên ID của bất động sản
    const images = [];
    
    // Thêm ảnh chính
    images.push({
      id: 1,
      src: `/img/properties/${propertyId}/1.jpg`,
      alt: 'Hình ảnh chính của bất động sản'
    });
    
    // Thêm các ảnh thumbnail (tối đa 8 ảnh)
    for (let i = 2; i <= 8; i++) {
      images.push({
        id: i,
        src: `/img/properties/${propertyId}/${i}.jpg`,
        alt: `Hình ảnh ${i} của bất động sản`
      });
    }
    
    return images;
  };

  // Kiểm tra localStorage một cách an toàn
  const safeLocalStorageGet = (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
      return null;
    } catch (e) {
      console.error('LocalStorage error:', e);
      return null;
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        console.log('Fetching property with ID:', id);
        
        const response = await fetch(`${API_URL}/properties/${id}`, fetchConfig);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API data:', result);
        
        if (result.success && result.data) {
          // Kiểm tra nếu data là mảng
          if (Array.isArray(result.data) && result.data.length > 0) {
            // Tìm bất động sản có ID phù hợp hoặc lấy phần tử đầu tiên
            const propertyItem = result.data.find(item => item.realEstateID.toString() === id.toString()) || result.data[0];
            setProperty(propertyItem);
            setError(null);
          } else if (typeof result.data === 'object') {
            // Trường hợp data là một đối tượng đơn lẻ
            setProperty(result.data);
            setError(null);
          } else {
            setError('Không tìm thấy dữ liệu bất động sản');
            setProperty(null);
          }
        } else {
          setError(result.message || 'Không thể tải thông tin bất động sản');
          setProperty(null);
        }

        // Kiểm tra trạng thái đăng nhập một cách an toàn
        const token = safeLocalStorageGet('token');
        setIsLoggedIn(!!token);

      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Không thể tải thông tin bất động sản: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Effect riêng để lấy bất động sản tương tự
  useEffect(() => {
    if (property && property.realEstateID) {
      fetchSimilarProperties();
    }
  }, [property, id]);

  // Hàm lấy danh sách bất động sản tương tự
  const fetchSimilarProperties = async () => {
    try {
      console.log('Đang lấy bất động sản tương tự...');
      setLoadingSimilar(true);
      
      // Lấy loại bất động sản hiện tại
      const currentPropertyType = property?.propertyTypeID;
      
      const response = await fetch(`${API_URL}/properties`, {
        ...fetchConfig,
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Kết quả API bất động sản tương tự:', result);
      
      if (result && Array.isArray(result)) {
        // Lọc bất động sản tương tự dựa trên loại bất động sản
        const filteredProperties = result
          .filter(p => {
            // Loại bỏ bất động sản hiện tại
            if (p.realEstateID?.toString() === id?.toString()) {
              return false;
            }
            return true;
          })
          .slice(0, 3);  // Lấy tối đa 3 bất động sản
        
        console.log('Bất động sản tương tự sau khi lọc:', filteredProperties);
        setSimilarProperties(filteredProperties);
      } else {
        console.error('Không tìm thấy dữ liệu bất động sản tương tự', result);
        setSimilarProperties([]);
      }
    } catch (err) {
      console.error('Lỗi khi lấy bất động sản tương tự:', err);
      setSimilarProperties([]);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    // Tự động chuyển đến trang thumbnail chứa hình ảnh được chọn
    setCurrentThumbnailPage(Math.floor(index / thumbnailsPerPage));
  };

  const handleFullscreenClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePrevImage = () => {
    const images = getPropertyImages(id);
    setSelectedImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    const images = getPropertyImages(id);
    setSelectedImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
      return;
    }

    try {
      if (isFavorite) {
        await propertyService.removeFavorite(id);
      } else {
        await propertyService.addFavorite(id);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Lấy URL hình ảnh phù hợp
  const getImageUrl = (index) => {
    // Nếu có dữ liệu hình ảnh từ API, sử dụng nó
    if (property.images && property.images.length > 0) {
      if (index < property.images.length) {
        const imgPath = property.images[index];
        // Xử lý trường hợp đường dẫn tuyệt đối từ máy local
        if (imgPath.includes('/DACS_Nhom10_REAL-ESTATE/public/')) {
          // Lấy phần sau "public/"
          const relPath = imgPath.split('/public/')[1];
          return `/${relPath}`;
        } else if (imgPath.includes('\\DACS_Nhom10_REAL-ESTATE\\public\\')) {
          // Xử lý đường dẫn Windows (dấu \ thay vì /)
          const relPath = imgPath.split('\\public\\')[1].replace(/\\/g, '/');
          return `/${relPath}`;
        }
        return property.images[index];
      }
      return property.images[0];
    }
    
    // Nếu có hình ảnh chính từ API
    if (index === 0 && property.featuredImage) {
      const featImgPath = property.featuredImage;
      // Xử lý trường hợp đường dẫn tuyệt đối từ máy local
      if (featImgPath.includes('/DACS_Nhom10_REAL-ESTATE/public/')) {
        // Lấy phần sau "public/"
        const relPath = featImgPath.split('/public/')[1];
        return `/${relPath}`;
      } else if (featImgPath.includes('\\DACS_Nhom10_REAL-ESTATE\\public\\')) {
        // Xử lý đường dẫn Windows (dấu \ thay vì /)
        const relPath = featImgPath.split('\\public\\')[1].replace(/\\/g, '/');
        return `/${relPath}`;
      }
      return property.featuredImage;
    }
    
    // Sử dụng hình ảnh từ thư mục local với định dạng "ct[số].jpg"
    const propertyId = property.realEstateID || property.id || id;
    return `/img/properties/${propertyId}/ct${index + 1}.jpg`;
  };

  // Lấy danh sách hình ảnh
  const propertyImages = getPropertyImages(id);
  const mainImage = propertyImages[selectedImageIndex];
  
  // Xử lý page cho thumbnails
  const thumbnailsPerPage = 6;
  const totalThumbnailPages = Math.ceil(propertyImages.length / thumbnailsPerPage);
  
  // Lấy thumbnails cho trang hiện tại
  const startIndex = currentThumbnailPage * thumbnailsPerPage;
  const endIndex = startIndex + thumbnailsPerPage;
  const displayThumbnails = propertyImages.slice(startIndex, endIndex);
  
  // Xử lý chuyển trang thumbnail
  const handlePrevThumbnailPage = () => {
    setCurrentThumbnailPage(prev => (prev > 0 ? prev - 1 : totalThumbnailPages - 1));
  };

  const handleNextThumbnailPage = () => {
    setCurrentThumbnailPage(prev => (prev < totalThumbnailPages - 1 ? prev + 1 : 0));
  };

  // Hàm lấy URL hình ảnh cho các bất động sản tương tự
  const getSimilarPropertyImage = (property) => {
    // Nếu có ảnh đại diện
    if (property.featuredImage) {
      const featImgPath = property.featuredImage;
      // Xử lý trường hợp đường dẫn tuyệt đối từ máy local
      if (featImgPath.includes('/DACS_Nhom10_REAL-ESTATE/public/')) {
        // Lấy phần sau "public/"
        const relPath = featImgPath.split('/public/')[1];
        return `/${relPath}`;
      } else if (featImgPath.includes('\\DACS_Nhom10_REAL-ESTATE\\public\\')) {
        // Xử lý đường dẫn Windows (dấu \ thay vì /)
        const relPath = featImgPath.split('\\public\\')[1].replace(/\\/g, '/');
        return `/${relPath}`;
      }
      return property.featuredImage;
    }
    
    // Nếu có mảng ảnh, lấy ảnh đầu tiên
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    
    // Mặc định sử dụng ct1.jpg
    return `/img/properties/${property.realEstateID}/ct1.jpg`;
  };

  // Thêm code để lưu lịch sử bất động sản đã xem vào localStorage
  useEffect(() => {
    if (property && (property.id || property.realEstateID)) {
      try {
        // Lấy danh sách bất động sản đã xem từ localStorage
        const viewedProperties = JSON.parse(localStorage.getItem('viewedProperties') || '[]');
        
        // ID chính của property (ưu tiên realEstateID nếu có)
        const propertyId = property.realEstateID || property.id;
        
        // Kiểm tra xem bất động sản này đã tồn tại trong danh sách chưa
        const existingIndex = viewedProperties.findIndex(item => (item.id === propertyId || item.realEstateID === propertyId));
        
        // Lấy ảnh đại diện
        const featuredImage = property.featuredImage || 
                            (property.images && property.images.length > 0 ? property.images[0] : 
                            `/img/property-default.jpg`);
        
        // Tạo đối tượng bất động sản với thời gian xem hiện tại và đầy đủ thông tin
        const viewedProperty = {
          id: propertyId,
          realEstateID: propertyId,
          title: property.title || "Bất động sản không có tiêu đề",
          price: property.price || 0,
          area: property.area || 0,
          bedrooms: property.bedrooms || 0,
          bathrooms: property.bathrooms || 0,
          image: featuredImage,
          propertyType: property.propertyTypeName || getPropertyType(),
          saleType: property.transactionTypeName || getTransactionType(),
          address: getLocationString(),
          viewedAt: new Date().toISOString()
        };
        
        // Nếu đã tồn tại, cập nhật thời gian xem và thông tin
        if (existingIndex !== -1) {
          viewedProperties[existingIndex] = {
            ...viewedProperties[existingIndex],
            ...viewedProperty
          };
        } else {
          // Nếu chưa tồn tại, thêm vào đầu danh sách
          viewedProperties.unshift(viewedProperty);
        }
        
        // Giới hạn danh sách đã xem tối đa 20 bất động sản
        const limitedViewedProperties = viewedProperties.slice(0, 20);
        
        // Lưu lại vào localStorage
        localStorage.setItem('viewedProperties', JSON.stringify(limitedViewedProperties));
        
        console.log("Đã lưu bất động sản vào danh sách đã xem:", viewedProperty);
      } catch (error) {
        console.error("Lỗi khi lưu bất động sản đã xem:", error);
      }
    }
  }, [property]);

  // Handler for agent form input changes
  const handleAgentFormChange = (e) => {
    const { name, value } = e.target;
    setAgentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handler for form submission
  const handleAgentFormSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!agentFormData.name.trim() || !agentFormData.email.trim() || 
        !agentFormData.phone.trim() || !agentFormData.message.trim()) {
      setAgentFormStatus({
        submitted: true,
        success: false,
        error: 'Vui lòng điền đầy đủ thông tin'
      });
      return;
    }

    // Simple email validation
    if (!agentFormData.email.includes('@')) {
      setAgentFormStatus({
        submitted: true,
        success: false,
        error: 'Email không hợp lệ'
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Submitted form data:', agentFormData);
      
      // Show success message
      setAgentFormStatus({
        submitted: true,
        success: true,
        error: ''
      });
      
      // Reset form after successful submission
      setAgentFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Reset message after 5 seconds
      setTimeout(() => {
        setAgentFormStatus({
          submitted: false,
          success: false,
          error: ''
        });
      }, 5000);
    }, 1000);
  };

  const toggleContactInfo = () => {
    setContactExpanded(!contactExpanded);
  };

  // Hàm xử lý báo cáo bất động sản
  const handleReportSubmit = (e) => {
    e.preventDefault();
    console.log('Báo cáo tin đăng:', {
      propertyId: property.realEstateID || property.id,
      reason: reportReason,
      description: reportDescription
    });
    
    // Giả lập gửi báo cáo thành công
    setTimeout(() => {
      setReportSuccess(true);
      
      // Sau 3 giây, đóng modal
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportReason('');
        setReportDescription('');
      }, 3000);
    }, 1000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || reviewComment.trim() === '') return;

    // TODO: Implement review submission logic here
    console.log('Review submitted:', { rating, comment: reviewComment });
    
    // Reset form and close modal
    setRating(0);
    setReviewComment('');
    setShowReviewModal(false);
  };

  if (loading) {
    return (
      <div className="property-detail-container">
        <div className="property-detail-loading">
          <div className="spinner-container">
            <div className="spinner-border"></div>
            <p>Đang tải thông tin bất động sản...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-detail-container">
        <div className="container">
          <div className="error-container">
            <h2>Đã xảy ra lỗi</h2>
            <p>{error || 'Không tìm thấy thông tin bất động sản'}</p>
            <Link to="/properties" className="btn-primary">Quay lại danh sách bất động sản</Link>
          </div>
        </div>
      </div>
    );
  }

  // Định dạng giá an toàn
  const formatPrice = (price) => {
    try {
      if (typeof price === 'number') {
        return price.toLocaleString('vi-VN');
      } else if (typeof price === 'string' && !isNaN(price)) {
        return Number(price).toLocaleString('vi-VN');
      }
      return 'Liên hệ để biết giá';
    } catch (err) {
      return 'Liên hệ để biết giá';
    }
  };

  // Định dạng diện tích an toàn
  const formatArea = (area) => {
    try {
      if (typeof area === 'number') {
        return area.toString();
      } else if (typeof area === 'string' && !isNaN(area)) {
        return area;
      }
      return '0';
    } catch (err) {
      return '0';
    }
  };

  // Lấy tên vị trí
  const getLocationString = () => {
    const wardName = property.wardName || '';
    const districtName = property.districtName || '';
    const provinceName = property.provinceName || '';
    
    return [wardName, districtName, provinceName].filter(Boolean).join(', ');
  };

  // Lấy loại bất động sản
  const getPropertyType = () => {
    return property.propertyTypeName || 
           (property.propertyTypeID === 1 ? 'Căn hộ' : 
            property.propertyTypeID === 2 ? 'Nhà phố' : 
            property.propertyTypeID === 3 ? 'Biệt thự' : 
            property.propertyTypeID === 4 ? 'Đất nền' : 'Không xác định');
  };

  // Lấy trạng thái bất động sản
  const getPropertyStatus = () => {
    return property.statusName || 
           (property.statusID === 1 ? 'Đang bán' : 
            property.statusID === 2 ? 'Đã bán' : 
            property.statusID === 3 ? 'Đang cho thuê' : 
            property.statusID === 4 ? 'Đã cho thuê' : 'Không xác định');
  };

  // Lấy loại giao dịch
  const getTransactionType = () => {
    return property.transactionTypeName || 
           (property.transactionTypeID === 1 ? 'Mua bán' : 
            property.transactionTypeID === 2 ? 'Cho thuê' : 'Không xác định');
  };

  // Lấy tình trạng pháp lý
  const getLegalStatus = () => {
    return property.legalStatusName || 
           (property.legalStatusID === 1 ? 'Sổ hồng/Sổ đỏ' : 
            property.legalStatusID === 2 ? 'Hợp đồng mua bán' : 
            property.legalStatusID === 3 ? 'Đang chờ sổ' : 'Không xác định');
  };

  return (
    <div className="property-detail-container">
      <div className="container">
        {/* Property Header */}
        <div className="property-header">
          <div className="property-status-container">
            <span className="dang-dang">ĐANG ĐĂNG</span>
          </div>
          <div className="property-title-container">
            <h1 className="property-title">{property.title || ''}</h1>
            <button 
              className="btn-report-property" 
              onClick={() => setShowReportModal(true)}
              title="Báo cáo tin đăng"
            >
              <FaFlag />
            </button>
          </div>
          <div className="property-price">{formatPrice(property.price)} VNĐ</div>
          <div className="property-tags">
            <span className="property-tag property-type">
              <FaHome />
              {getPropertyType()}
            </span>
            <span className="property-tag property-status">
              <FaCalendarAlt />
              {getPropertyStatus()}
            </span>
            {property.featured && (
              <span className="property-tag property-featured">
                <FaFireAlt />
                Nổi bật
              </span>
            )}
          </div>
        </div>
        
        {/* Property Main Content */}
        <div className="property-main">
          {/* Left Column */}
          <div className="property-left-column">
            {/* Property Gallery */}
            <div className="property-section property-gallery">
              <div className="property-main-image">
                <img
                  src={getImageUrl(selectedImageIndex)}
                  alt={mainImage.alt}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/img/property-placeholder.jpg';
                  }}
                />
                <div className="image-controls">
                  <div className="image-count">{selectedImageIndex + 1}/{propertyImages.length}</div>
                  <button className="btn-fullscreen" onClick={handleFullscreenClick}>
                    <BsFullscreen />
                  </button>
                  <button className={`btn-favorite ${isFavorite ? 'active' : ''}`} onClick={handleToggleFavorite}>
                    {isFavorite ? <BsHeartFill /> : <BsHeart />}
                  </button>
                </div>
              </div>
              <div className="property-thumbnails-container">
                <div className="property-thumbnails">
                  {displayThumbnails.map((image, index) => {
                    const actualIndex = startIndex + index;
                    return (
                      <div
                        key={image.id}
                        className={`property-thumbnail ${actualIndex === selectedImageIndex ? 'active' : ''}`}
                        onClick={() => handleImageClick(actualIndex)}
                      >
                        <img
                          src={getImageUrl(actualIndex)}
                          alt={image.alt}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/property-placeholder.jpg';
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                {propertyImages.length > thumbnailsPerPage && (
                  <div className="thumbnail-navigation">
                    <button className="thumbnail-nav-btn prev" onClick={handlePrevThumbnailPage}>
                      <BsArrowLeft />
                    </button>
                    <div className="thumbnail-page-info">
                      {currentThumbnailPage + 1}/{totalThumbnailPages}
                    </div>
                    <button className="thumbnail-nav-btn next" onClick={handleNextThumbnailPage}>
                      <BsArrowRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Property Highlights */}
            <div className="property-section">
              <h2 className="section-title">Thông tin tổng quan</h2>
              <div className="property-highlights">
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FaHome />
                  </div>
                  <div className="highlight-info">
                    <div className="highlight-label">Loại</div>
                    <div className="highlight-value">{getPropertyType()}</div>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FaBed />
                  </div>
                  <div className="highlight-info">
                    <div className="highlight-label">Phòng ngủ</div>
                    <div className="highlight-value">{property.bedrooms || '0'}</div>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FaBath />
                  </div>
                  <div className="highlight-info">
                    <div className="highlight-label">Phòng tắm</div>
                    <div className="highlight-value">{property.bathrooms || '0'}</div>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FaRulerCombined />
                  </div>
                  <div className="highlight-info">
                    <div className="highlight-label">Diện tích</div>
                    <div className="highlight-value">{formatArea(property.area)} m²</div>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="highlight-info">
                    <div className="highlight-label">Loại giao dịch</div>
                    <div className="highlight-value">{getTransactionType()}</div>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FaHome />
                  </div>
                  <div className="highlight-info">
                    <div className="highlight-label">Tình trạng pháp lý</div>
                    <div className="highlight-value">{getLegalStatus()}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Property Description */}
            <div className="property-section">
              <h2 className="section-title">Mô tả</h2>
              <div className="property-description">
                <p>{property.description || 'Không có thông tin mô tả.'}</p>
              </div>
            </div>
            
            {/* Property Features */}
            {/* Xóa toàn bộ phần Property Features */}
            
            {/* Property Location */}
            <div className="property-section">
              <h2 className="section-title">Vị trí</h2>
              <div className="property-location-detail">
                <p>
                  <FaMapMarkerAlt className="location-icon" />
                  {getLocationString() || 'Đang cập nhật vị trí'}
                </p>
                <div className="location-map">
                  {/* Sử dụng cách nhúng trực tiếp vị trí với marker ở trung tâm */}
                  <iframe
                    src={`https://maps.google.com/maps?q=${property.latitude || 10.7769},${property.longitude || 106.6982}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="350"
                    style={{ border: 0, borderRadius: 'var(--border-radius)' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                  ></iframe>
                </div>
                {/* Thêm liên kết đến Google Maps */}
                <div className="view-on-map">
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${property.latitude || 10.7769},${property.longitude || 106.6982}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-map-link"
                  >
                    <FaMapMarkerAlt /> Xem trên Google Maps
                  </a>
                </div>
              </div>
            </div>
            
            {/* Similar Properties */}
            <div className="similar-properties-section">
              <h2 className="section-title">
                <div className="section-icon"><FaBuilding /></div>
                Bất động sản tương tự
              </h2>
              <div className="similar-properties">
                {loadingSimilar ? (
                  <div className="loading-similar-properties">
                    <p>Đang tải bất động sản tương tự...</p>
                  </div>
                ) : similarProperties && similarProperties.length > 0 ? (
                  similarProperties.map((similarProperty) => (
                    <Link
                      to={`/properties/${similarProperty.realEstateID}`}
                      className="similar-property"
                      key={similarProperty.realEstateID}
                    >
                      <div className="similar-property-img">
                        <img
                          src={getSimilarPropertyImage(similarProperty)}
                          alt={similarProperty.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/property-placeholder.jpg';
                          }}
                        />
                        <div className="similar-property-price-tag">
                          {formatPrice(similarProperty.price)} VNĐ
                        </div>
                      </div>
                      <div className="similar-property-info">
                        <h3 className="similar-property-title">{similarProperty.title}</h3>
                        <div className="similar-property-details">
                          <div className="similar-property-detail">
                            <FaBed className="similar-property-detail-icon" />
                            <span className="similar-property-detail-value">{similarProperty.bedrooms || 0}</span>
                          </div>
                          <div className="similar-property-detail">
                            <FaBath className="similar-property-detail-icon" />
                            <span className="similar-property-detail-value">{similarProperty.bathrooms || 0}</span>
                          </div>
                          <div className="similar-property-detail">
                            <FaRulerCombined className="similar-property-detail-icon" />
                            <span className="similar-property-detail-value">{formatArea(similarProperty.area)} m²</span>
                          </div>
                        </div>
                        <div className="similar-property-location">
                          <FaMapMarkerAlt className="similar-property-location-icon" />
                          <span className="similar-property-location-text">
                            {similarProperty.districtName ? `${similarProperty.districtName}, ${similarProperty.provinceName || ''}` : similarProperty.provinceName || 'Đang cập nhật'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="no-similar-properties">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0'}}>
                      <FaSearchLocation style={{fontSize: '60px', color: '#cbd5e1', marginBottom: '20px'}} />
                      <p style={{fontSize: '18px', fontWeight: '500', color: '#64748b', marginBottom: '15px'}}>Không tìm thấy bất động sản tương tự</p>
                      <p style={{marginTop: '10px', fontSize: '15px', color: '#94a3b8', textAlign: 'center', maxWidth: '400px', lineHeight: '1.6'}}>
                        Hãy khám phá các bất động sản khác trong khu vực hoặc điều chỉnh tiêu chí tìm kiếm của bạn để tìm thấy bất động sản phù hợp.
                      </p>
                      <div style={{marginTop: '25px', display: 'flex', gap: '15px'}}>
                        <button style={{
                          padding: '10px 20px',
                          background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '15px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 10px rgba(34, 197, 94, 0.2)',
                          transition: 'all 0.3s ease'
                        }}>
                          <FaHome style={{fontSize: '16px'}} /> Xem tất cả bất động sản
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {similarProperties && similarProperties.length > 0 && (
                <Link to="/properties" className="view-more-properties">
                  Xem thêm bất động sản <FaArrowRight />
                </Link>
              )}
            </div>
          </div>
          
          {/* Right Column - Agent Information */}
          <div className="property-right-column">
            {/* Khu vực bất động sản hot */}
            <div className="property-section hot-areas-card">
              <h3 className="section-title">
                <FaFireAlt className="section-icon" /> Khu vực bất động sản hot
              </h3>
              <div className="hot-areas-list">
                <Link to="/properties?district=Quận 1" className="hot-area-item hot-area-item-top">
                  <div className="hot-area-icon"><FaFireAlt /></div>
                  <div className="hot-area-info">
                    <div className="hot-area-name">Quận 1</div>
                    <div className="hot-area-count">254 bất động sản</div>
                  </div>
                  <div className="hot-area-arrow"><FaChevronRight /></div>
                </Link>
                
                <Link to="/properties?district=Quận 2" className="hot-area-item hot-area-item-top">
                  <div className="hot-area-icon"><FaFireAlt /></div>
                  <div className="hot-area-info">
                    <div className="hot-area-name">Quận 2 (Thủ Đức)</div>
                    <div className="hot-area-count">189 bất động sản</div>
                  </div>
                  <div className="hot-area-arrow"><FaChevronRight /></div>
                </Link>
                
                <Link to="/properties?district=Quận 7" className="hot-area-item hot-area-item-top">
                  <div className="hot-area-icon"><FaFireAlt /></div>
                  <div className="hot-area-info">
                    <div className="hot-area-name">Quận 7</div>
                    <div className="hot-area-count">175 bất động sản</div>
                  </div>
                  <div className="hot-area-arrow"><FaChevronRight /></div>
                </Link>
                
                <Link to="/properties?district=Bình Thạnh" className="hot-area-item">
                  <div className="hot-area-icon"><FaFireAlt /></div>
                  <div className="hot-area-info">
                    <div className="hot-area-name">Quận Bình Thạnh</div>
                    <div className="hot-area-count">163 bất động sản</div>
                  </div>
                  <div className="hot-area-arrow"><FaChevronRight /></div>
                </Link>
                
                <Link to="/properties?district=Tân Bình" className="hot-area-item">
                  <div className="hot-area-icon"><FaFireAlt /></div>
                  <div className="hot-area-info">
                    <div className="hot-area-name">Quận Tân Bình</div>
                    <div className="hot-area-count">142 bất động sản</div>
                  </div>
                  <div className="hot-area-arrow"><FaChevronRight /></div>
                </Link>
              </div>
              <Link to="/properties" className="view-all-areas">
                Xem tất cả khu vực <FaArrowRight />
              </Link>
            </div>

            {/* Giao diện đánh giá và bình luận bất động sản */}
            <div className="property-section reviews-card">
              <h3 className="section-title">
                <i className="fas fa-star section-icon" style={{color: '#FFD700'}}></i> Đánh giá & Nhận xét
              </h3>
              <div className="property-reviews">
                {/* Tổng quan đánh giá */}
                <div className="review-summary" style={{
                  display: 'flex',
                  padding: '20px',
                  background: 'linear-gradient(145deg, #f9f9f9, #ffffff)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                  marginBottom: '25px',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div className="review-rating" style={{textAlign: 'center'}}>
                    <div className="rating-big" style={{
                      fontSize: '48px',
                      fontWeight: '700',
                      color: '#2A2A2A',
                      lineHeight: '1.1',
                      marginBottom: '5px'
                    }}>4.8</div>
                    <div className="rating-stars" style={{marginBottom: '8px'}}>
                      <i className="fas fa-star" style={{color: '#FFD700', marginRight: '2px'}}></i>
                      <i className="fas fa-star" style={{color: '#FFD700', marginRight: '2px'}}></i>
                      <i className="fas fa-star" style={{color: '#FFD700', marginRight: '2px'}}></i>
                      <i className="fas fa-star" style={{color: '#FFD700', marginRight: '2px'}}></i>
                      <i className="fas fa-star-half-alt" style={{color: '#FFD700'}}></i>
                    </div>
                    <div className="rating-count" style={{
                      fontSize: '14px',
                      color: '#757575',
                      fontWeight: '500'
                    }}>Dựa trên 42 đánh giá</div>
                  </div>
                  <div className="rating-bars" style={{
                    flex: '1',
                    marginLeft: '30px',
                    maxWidth: '280px'
                  }}>
                    <div className="rating-bar-item" style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span className="rating-label" style={{
                        width: '45px',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center'
                      }}>5 <i className="fas fa-star" style={{fontSize: '11px', color: '#FFD700', marginLeft: '3px'}}></i></span>
                      <div className="progress" style={{
                        flex: '1',
                        height: '8px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        margin: '0 10px'
                      }}>
                        <div className="progress-bar" style={{
                          width: '75%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                          borderRadius: '10px'
                        }}></div>
                      </div>
                      <span className="rating-count" style={{
                        fontSize: '14px',
                        color: '#757575',
                        width: '25px',
                        textAlign: 'right'
                      }}>32</span>
                    </div>
                    <div className="rating-bar-item" style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span className="rating-label" style={{
                        width: '45px',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center'
                      }}>4 <i className="fas fa-star" style={{fontSize: '11px', color: '#FFD700', marginLeft: '3px'}}></i></span>
                      <div className="progress" style={{
                        flex: '1',
                        height: '8px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        margin: '0 10px'
                      }}>
                        <div className="progress-bar" style={{
                          width: '15%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                          borderRadius: '10px'
                        }}></div>
                      </div>
                      <span className="rating-count" style={{
                        fontSize: '14px',
                        color: '#757575',
                        width: '25px',
                        textAlign: 'right'
                      }}>6</span>
                    </div>
                    <div className="rating-bar-item" style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span className="rating-label" style={{
                        width: '45px',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center'
                      }}>3 <i className="fas fa-star" style={{fontSize: '11px', color: '#FFD700', marginLeft: '3px'}}></i></span>
                      <div className="progress" style={{
                        flex: '1',
                        height: '8px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        margin: '0 10px'
                      }}>
                        <div className="progress-bar" style={{
                          width: '8%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                          borderRadius: '10px'
                        }}></div>
                      </div>
                      <span className="rating-count" style={{
                        fontSize: '14px',
                        color: '#757575',
                        width: '25px',
                        textAlign: 'right'
                      }}>3</span>
                    </div>
                    <div className="rating-bar-item" style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span className="rating-label" style={{
                        width: '45px',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center'
                      }}>2 <i className="fas fa-star" style={{fontSize: '11px', color: '#FFD700', marginLeft: '3px'}}></i></span>
                      <div className="progress" style={{
                        flex: '1',
                        height: '8px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        margin: '0 10px'
                      }}>
                        <div className="progress-bar" style={{
                          width: '2%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                          borderRadius: '10px'
                        }}></div>
                      </div>
                      <span className="rating-count" style={{
                        fontSize: '14px',
                        color: '#757575',
                        width: '25px',
                        textAlign: 'right'
                      }}>1</span>
                    </div>
                    <div className="rating-bar-item" style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span className="rating-label" style={{
                        width: '45px',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center'
                      }}>1 <i className="fas fa-star" style={{fontSize: '11px', color: '#FFD700', marginLeft: '3px'}}></i></span>
                      <div className="progress" style={{
                        flex: '1',
                        height: '8px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        margin: '0 10px'
                      }}>
                        <div className="progress-bar" style={{
                          width: '0%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                          borderRadius: '10px'
                        }}></div>
                      </div>
                      <span className="rating-count" style={{
                        fontSize: '14px',
                        color: '#757575',
                        width: '25px',
                        textAlign: 'right'
                      }}>0</span>
                    </div>
                  </div>
                </div>
                
                {/* Hiển thị các bình luận nổi bật */}
                <div className="featured-reviews" style={{
                  marginBottom: '20px',
                  background: 'linear-gradient(90deg, rgba(34,197,94,0.05), rgba(74,222,128,0.05))',
                  borderRadius: '12px',
                  padding: '15px 20px',
                  border: '1px solid rgba(34, 197, 94, 0.1)'
                }}>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#22c55e',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-award" style={{marginRight: '8px'}}></i>
                    Đánh giá nổi bật
                  </div>
                  <div style={{
                    fontStyle: 'italic',
                    color: '#4B5563',
                    fontSize: '15px',
                    lineHeight: '1.6',
                    position: 'relative',
                    paddingLeft: '20px'
                  }}>
                    <i className="fas fa-quote-left" style={{
                      position: 'absolute',
                      left: '0',
                      top: '0',
                      color: '#22c55e',
                      opacity: '0.4'
                    }}></i>
                    Vị trí rất thuận tiện, gần trung tâm thương mại, trường học và bệnh viện. Khu vực an ninh tốt và môi trường sống yên tĩnh.
                  </div>
                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    fontSize: '14px',
                    color: '#64748B',
                    fontWeight: '500'
                  }}>
                    — Nguyễn Văn Minh
                  </div>
                </div>
                
                {/* Các bình luận */}
                <div className="review-list" style={{marginBottom: '25px'}}>
                  <div className="review-item" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                    marginBottom: '15px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                    background: 'white',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <div className="review-content" style={{flex: '1'}}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}>
                        <div className="reviewer-name" style={{
                          fontWeight: '600',
                          fontSize: '16px',
                          color: '#2A2A2A'
                        }}>Nguyễn Văn Minh</div>
                        <span className="review-date" style={{
                          fontSize: '14px',
                          color: '#94A3B8'
                        }}>12/04/2023</span>
                      </div>
                      <div className="review-rating" style={{
                        display: 'flex',
                        marginBottom: '12px'
                      }}>
                        <i className="fas fa-star" style={{color: '#FFD700'}}></i>
                        <i className="fas fa-star" style={{color: '#FFD700'}}></i>
                        <i className="fas fa-star" style={{color: '#FFD700'}}></i>
                        <i className="fas fa-star" style={{color: '#FFD700'}}></i>
                        <i className="fas fa-star" style={{color: '#FFD700'}}></i>
                      </div>
                      <div className="review-text" style={{
                        color: '#4B5563',
                        lineHeight: '1.6',
                        fontSize: '15px'
                      }}>
                        Vị trí rất thuận tiện, gần trung tâm thương mại, trường học và bệnh viện. Khu vực an ninh tốt, môi trường sống rất yên tĩnh và thân thiện.
                      </div>
                    </div>
                  </div>
                  
                  <div className="review-item" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                    marginBottom: '15px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                    background: 'white',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <div className="review-content" style={{flex: '1'}}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}>
                        <div className="reviewer-name" style={{
                          fontWeight: '600',
                          fontSize: '16px',
                          color: '#2A2A2A'
                        }}>Trần Thị Hương</div>
                        <span className="review-date" style={{
                          fontSize: '14px',
                          color: '#94A3B8'
                        }}>05/04/2023</span>
                      </div>
                      <div className="review-rating" style={{
                        display: 'flex',
                        marginBottom: '12px'
                      }}>
                        <i className="fas fa-star" style={{color: '#FFD700'}}></i>
                        <i className="fas fa-star" style={{color: '#FFD700'}}></i>
                        <i className="fas fa-star" style={{color: '#FFD700'}}></i>
                        <i className="fas fa-star" style={{color: '#FFD700'}}></i>
                        <i className="far fa-star" style={{color: '#E5E7EB'}}></i>
                      </div>
                      <div className="review-text" style={{
                        color: '#4B5563',
                        lineHeight: '1.6',
                        fontSize: '15px'
                      }}>
                        Thiết kế hiện đại, thoáng mát và nhiều ánh sáng tự nhiên. Chất lượng xây dựng tốt nhưng hơi ồn vào giờ cao điểm.
                      </div>
                    </div>
                  </div>
                  
                  <div className="review-item" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                    marginBottom: '15px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                    background: 'white',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <div className="review-content" style={{flex: '1'}}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                      }}>
                        <div className="reviewer-name" style={{
                          fontWeight: '600',
                          fontSize: '16px',
                          color: '#2A2A2A'
                        }}>Lê Hoàng Nam</div>
                        <span className="review-date" style={{
                          fontSize: '14px',
                          color: '#94A3B8'
                        }}>28/03/2023</span>
                      </div>
                      <div className="review-rating" style={{
                        display: 'flex',
                        marginBottom: '12px'
                      }}>
                        <i className="fas fa-star" style={{color: '#FFD700'}}></i>
                        <i className="fas fa-star" style={{color: '#FFD700'}}></i>
                        <i className="fas fa-star" style={{color: '#FFD700'}}></i>
                        <i className="fas fa-star" style={{color: '#FFD700'}}></i>
                        <i className="fas fa-star-half-alt" style={{color: '#FFD700'}}></i>
                      </div>
                      <div className="review-text" style={{
                        color: '#4B5563',
                        lineHeight: '1.6',
                        fontSize: '15px'
                      }}>
                        Đánh giá cao không gian sống và tiện ích xung quanh. Giá cả hợp lý so với khu vực. Rất hài lòng với sự lựa chọn này.
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Nút viết đánh giá */}
                <div className="write-review" style={{textAlign: 'center', padding: '10px 0'}}>
                  <button 
                    className="btn-write-review" 
                    onClick={() => setShowReviewModal(true)}
                    style={{
                      background: 'linear-gradient(to right, #22c55e, #4ade80)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '15px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="fas fa-pen" style={{marginRight: '10px'}}></i> Viết đánh giá
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Contact Form */}
      <div className="agent-contact-section">
        <div className="container">
          <div className="agent-contact-container">
            <div className="form-header">
              <h3 className="section-title">
                Liên hệ với nhà môi giới
              </h3>
              <p className="form-subtitle">Hãy điền thông tin của bạn, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất</p>
            </div>
            
            <div className="form-content">
              <div className="row">
                <div className="col-md-4">
                  <div className="agent-card">
                    <div className="agent-avatar">
                      <img 
                        src="/img/agent-avatar.jpg" 
                        alt="Agent" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/img/agent-placeholder.jpg';
                        }}
                      />
                    </div>
                    <h4 className="agent-name">Nguyễn Văn A</h4>
                    <div className="agent-rating">
                      <span className="star">★</span>
                      <span className="star">★</span>
                      <span className="star">★</span>
                      <span className="star">★</span>
                      <span className="star">★</span>
                      <span className="rating-count">(28 đánh giá)</span>
                    </div>
                    <p className="agent-title">Chuyên viên tư vấn BĐS</p>
                    <div className="agent-contact-info">
                      <p><FaPhone className="icon" /> 0987.654.321</p>
                      <p><FaEnvelope className="icon" /> agent@makaan.com</p>
                    </div>
                    <div className="agent-stats">
                      <div className="stat-item">
                        <div className="stat-value">58</div>
                        <div className="stat-label">BĐS đã bán</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-value">96%</div>
                        <div className="stat-label">Khách hài lòng</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-8">
                  {agentFormStatus.submitted && (
                    <div className={`form-status-message ${agentFormStatus.success ? 'success' : 'error'}`}>
                      {agentFormStatus.success 
                        ? 'Yêu cầu của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm.' 
                        : agentFormStatus.error}
                    </div>
                  )}
                  
                  <form onSubmit={handleAgentFormSubmit} className="agent-contact-form">
                    <div className="form-group">
                      <label htmlFor="name">Họ và tên <span className="required">*</span></label>
                      <div className="input-with-icon">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={agentFormData.name}
                          onChange={handleAgentFormChange}
                          className="form-control"
                          placeholder="Nhập họ và tên của bạn"
                          required
                        />
                        <FaUser className="input-icon" />
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="email">Email <span className="required">*</span></label>
                          <div className="input-with-icon">
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={agentFormData.email}
                              onChange={handleAgentFormChange}
                              className="form-control"
                              placeholder="Nhập email của bạn"
                              required
                            />
                            <FaEnvelope className="input-icon" />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
                          <div className="input-with-icon">
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={agentFormData.phone}
                              onChange={handleAgentFormChange}
                              className="form-control"
                              placeholder="Nhập số điện thoại của bạn"
                              required
                            />
                            <FaPhone className="input-icon" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="message">Tin nhắn <span className="required">*</span></label>
                      <textarea
                        id="message"
                        name="message"
                        value={agentFormData.message}
                        onChange={handleAgentFormChange}
                        className="form-control"
                        rows="4"
                        placeholder="Tôi quan tâm đến bất động sản này và muốn biết thêm thông tin chi tiết..."
                        required
                      ></textarea>
                    </div>
                    
                    <div className="form-group form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="consent" 
                        required 
                      />
                      <label className="form-check-label" htmlFor="consent">
                        Tôi đồng ý cho phép lưu trữ thông tin và liên hệ theo các thông tin đã cung cấp
                      </label>
                    </div>
                    
                    <button type="submit" className="btn-submit">
                      <FaPaperPlane className="icon" /> Gửi tin nhắn
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="image-modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              <BsX />
            </button>
            <img
              src={getImageUrl(selectedImageIndex)}
              alt={mainImage.alt}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/property-placeholder.jpg';
              }}
            />
            <div className="modal-nav">
              <button className="modal-nav-btn" onClick={handlePrevImage}>
                <BsArrowLeft />
              </button>
              <button className="modal-nav-btn" onClick={handleNextImage}>
                <BsArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Báo cáo tin đăng */}
      {showReportModal && (
        <div className="report-modal-overlay">
          <div className="report-modal">
            <div className="report-modal-header">
              <h3>Báo cáo tin đăng</h3>
              <button className="btn-close" onClick={() => setShowReportModal(false)}>
                <BsX />
              </button>
            </div>
            {reportSuccess ? (
              <div className="report-success">
                <div className="success-icon">
                  <div className="checkmark">✓</div>
                </div>
                <h4>Báo cáo đã được gửi!</h4>
                <p>Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="report-form">
                <div className="form-group">
                  <label htmlFor="reportReason">Lý do báo cáo <span className="required">*</span></label>
                  <select 
                    id="reportReason" 
                    className="form-control" 
                    value={reportReason} 
                    onChange={(e) => setReportReason(e.target.value)}
                    required
                  >
                    <option value="">-- Chọn lý do --</option>
                    <option value="fake">Tin đăng giả mạo</option>
                    <option value="spam">Tin đăng spam</option>
                    <option value="scam">Lừa đảo</option>
                    <option value="wrong_info">Thông tin không chính xác</option>
                    <option value="sold">Bất động sản đã bán/cho thuê</option>
                    <option value="other">Lý do khác</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="reportDescription">Mô tả chi tiết</label>
                  <textarea 
                    id="reportDescription" 
                    className="form-control"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
                    rows={5}
                  ></textarea>
                </div>
                <div className="report-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowReportModal(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn-submit">
                    Gửi báo cáo
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="review-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="review-modal" style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}>
            <button 
              onClick={() => setShowReviewModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              <BsX />
            </button>

            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Viết đánh giá</h3>

            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#4b5563' }}>
                  Đánh giá của bạn:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                      <span
                        key={index}
                        style={{ cursor: 'pointer', fontSize: '24px' }}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoveredStar(starValue)}
                        onMouseLeave={() => setHoveredStar(0)}
                      >
                        {starValue <= (hoveredStar || rating) ? (
                          <BsStarFill style={{ color: '#fbbf24' }} />
                        ) : (
                          <BsStar style={{ color: '#d1d5db' }} />
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#4b5563' }}>
                  Nội dung đánh giá:
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={rating === 0 || reviewComment.trim() === ''}
                style={{
                  background: 'linear-gradient(to right, #22c55e, #4ade80)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  width: '100%',
                  cursor: rating === 0 || reviewComment.trim() === '' ? 'not-allowed' : 'pointer',
                  opacity: rating === 0 || reviewComment.trim() === '' ? 0.7 : 1
                }}
              >
                Gửi đánh giá
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail; 