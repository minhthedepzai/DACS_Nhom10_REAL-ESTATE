import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { properties } from '../../data/properties';
import './PropertyDetail.css';
import BackToTop from '../BackToTop';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Header from '../Header';
import { IoCloseOutline } from 'react-icons/io5';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [viewingDate, setViewingDate] = useState('');
  const [viewingTime, setViewingTime] = useState('');
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
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

  useEffect(() => {
    // Xử lý sticky navbar
    const handleScroll = () => {
      if (window.scrollY > 45) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Đếm số bất động sản yêu thích
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavoriteCount(favorites.length);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, [isFavorite]);

  useEffect(() => {
    // Tìm bất động sản theo ID
    const propertyData = properties.find(p => p.id === parseInt(id));
    if (propertyData) {
      setProperty(propertyData);
      setLoading(false);
      document.title = propertyData.title;

      // Kiểm tra trạng thái yêu thích
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some(fav => fav.id === parseInt(id)));
    }
  }, [id]);

  // Xử lý thêm/xóa yêu thích
  const toggleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (newFavoriteStatus) {
      if (!favorites.some(fav => fav.id === property.id)) {
        favorites.push({
          id: property.id,
          title: property.title,
          price: property.price,
          area: property.area,
          image: property.featuredImage
        });
      }
    } else {
      const index = favorites.findIndex(fav => fav.id === property.id);
      if (index !== -1) {
        favorites.splice(index, 1);
      }
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  // Xử lý đặt lịch xem
  const handleScheduleViewing = (e) => {
    e.preventDefault();
    if (!viewingDate || !viewingTime) {
      alert("Vui lòng chọn ngày và giờ xem nhà!");
      return;
    }
    alert(`Yêu cầu đặt lịch xem vào ${viewingDate} lúc ${viewingTime} đã được gửi!`);
    setShowViewingModal(false);
  };

  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Hiển thị bản đồ
  const openMap = () => {
    if (property && property.coordinates) {
      const { latitude, longitude } = property.coordinates;
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
    }
  };

  // Xác định nếu bất động sản mới được đăng (trong vòng 7 ngày)
  const isNewListing = (dateString) => {
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };
  
  // Xử lý chia sẻ
  const shareProperty = (platform) => {
    const url = window.location.href;
    const title = property.title;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${title}&body=Xem thông tin bất động sản này: ${url}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Đã sao chép đường dẫn vào clipboard!');
        break;
      default:
        break;
    }
  };

  // Xử lý nhập liệu form nhà môi giới
  const handleAgentFormChange = (e) => {
    const { name, value } = e.target;
    setAgentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý gửi form liên hệ với nhà môi giới
  const handleAgentFormSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra form
    if (!agentFormData.name.trim() || !agentFormData.email.trim() || 
        !agentFormData.phone.trim() || !agentFormData.message.trim()) {
      setAgentFormStatus({
        submitted: true,
        success: false,
        error: 'Vui lòng điền đầy đủ thông tin'
      });
      return;
    }

    // Xác thực email đơn giản
    if (!agentFormData.email.includes('@')) {
      setAgentFormStatus({
        submitted: true,
        success: false,
        error: 'Email không hợp lệ'
      });
      return;
    }

    // Mô phỏng gửi dữ liệu đến API
    setTimeout(() => {
      console.log('Gửi thông tin liên hệ:', agentFormData);
      
      // Giả lập thành công
      setAgentFormStatus({
        submitted: true,
        success: true,
        error: ''
      });
      
      // Reset form
      setAgentFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Reset thông báo sau 5 giây
      setTimeout(() => {
        setAgentFormStatus({
          submitted: false,
          success: false,
          error: ''
        });
      }, 5000);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-5 text-center">
        <div className="not-found-container">
          <i className="bi bi-exclamation-triangle-fill text-warning display-1"></i>
          <h2 className="mt-4">Không tìm thấy bất động sản</h2>
          <p className="text-muted">Rất tiếc, chúng tôi không thể tìm thấy bất động sản với ID: {id}</p>
          <Link to="/" className="btn btn-primary mt-3">Quay lại trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />

      <div className="container py-4 d-flex justify-content-between align-items-center" style={{ backgroundImage: 'url(/path/to/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '40px 20px' }}>
        <div>
          <h1 style={{ transition: 'all 0.3s ease', fontSize: '2.5rem', color: '#333', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)' }}>{property.title}</h1>
          <p className="text-muted" style={{ transition: 'all 0.3s ease', fontSize: '1.2rem', margin: '10px 0', fontStyle: 'italic' }}>{property.address}</p>
        </div>
        <div>
          <button className="btn btn-outline-primary" onClick={() => shareProperty('facebook')}>
            <i className="bi bi-share"></i> Chia sẻ
          </button>
        </div>
      </div>

      <div className="property-detail-container">
        {/* Header */}
        <div className="property-header">
          <div className="container py-4">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">Trang chủ</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/properties">Bất động sản</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">{property.title}</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Gallery & Main Info */}
        <div className="container py-1">
          <div className="row">
            {/* Gallery */}
            <div className="col-lg-8 mb-0">
              <div className="property-gallery">
                <div className="main-image-container">
                  <img 
                    src={property.images[activeImage]} 
                    alt={`${property.title} - Hình ${activeImage + 1}`} 
                    className="main-image"
                  />
                  
                  {isNewListing(property.createdAt) && (
                    <div className="new-listing-badge">Mới</div>
                  )}
                  
                  <button 
                    className={`favorite-button ${isFavorite ? 'active' : ''}`}
                    onClick={toggleFavorite}
                    aria-label={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                  >
                    {isFavorite ? <IoCloseOutline size={20} /> : <i className="bi bi-heart"></i>}
                  </button>
                </div>
                
                <div className="thumbnails-container d-flex justify-content-center mt-0">
                  {property.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Thông tin chính & Liên hệ */}
            <div className="col-lg-4 mb-0">
              <div className="property-main-info">
                <div className="header-section">
                  <h1 className="property-title">{property.title}</h1>
                  <p className="property-address">
                    <i className="bi bi-geo-alt-fill"></i> {property.address}
                  </p>
                  <div className="property-price">{property.price}</div>
                </div>
                
                <div className="quick-info-section">
                  <div className="row g-0">
                    <div className="col-6 quick-info-item">
                      <i className="bi bi-rulers"></i>
                      <span>Diện tích</span>
                      <strong>{property.area}</strong>
                    </div>
                    <div className="col-6 quick-info-item">
                      <i className="bi bi-houses"></i>
                      <span>Pháp lý</span>
                      <strong>{property.legalStatus}</strong>
                    </div>
                    <div className="col-6 quick-info-item">
                      <i className="bi bi-house-door"></i>
                      <span>Phòng ngủ</span>
                      <strong>{property.bedrooms}</strong>
                    </div>
                    <div className="col-6 quick-info-item">
                      <i className="bi bi-droplet"></i>
                      <span>Phòng tắm</span>
                      <strong>{property.bathrooms}</strong>
                    </div>
                  </div>
                </div>
                
                <div className="contact-section">
                  <h3>Liên hệ người bán</h3>
                  <div className="contact-info">
                    <div className="contact-item">
                      <i className="bi bi-person-circle"></i>
                      <span>{property.contactInfo.name}</span>
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-telephone"></i>
                      {showPhoneNumber ? (
                        <span>{property.contactInfo.phone}</span>
                      ) : (
                        <button 
                          className="btn btn-link p-0 text-start" 
                          onClick={() => setShowPhoneNumber(true)}
                        >
                          Nhấn để xem số điện thoại
                        </button>
                      )}
                    </div>
                    <div className="contact-item">
                      <i className="bi bi-envelope"></i>
                      <span>{property.contactInfo.email}</span>
                    </div>
                  </div>
                  
                  <div className="action-buttons">
                    <button 
                      className="btn btn-primary w-100 mb-2" 
                      onClick={() => setShowViewingModal(true)}
                    >
                      <i className="bi bi-calendar-event me-2"></i>
                      Đặt lịch xem
                    </button>
                    <a 
                      href={showPhoneNumber ? `tel:${property.contactInfo.phone}` : "#"} 
                      className="btn btn-outline-primary w-100"
                      onClick={!showPhoneNumber ? () => setShowPhoneNumber(true) : undefined}
                    >
                      <i className="bi bi-telephone me-2"></i>
                      {showPhoneNumber ? "Gọi ngay" : "Hiện số để gọi"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mô tả & Chi tiết */}
        <div className="container pb-5">
          <div className="row">
            <div className="col-lg-8">
              {/* Mô tả */}
              <div className="property-section">
                <h3 className="section-title">Mô tả</h3>
                <div className="description-content">
                  {property.description.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
              
              {/* Đặc điểm */}
              <div className="property-section">
                <h3 className="section-title">Đặc điểm bất động sản</h3>
                <div className="features-list">
                  <div className="row">
                    {property.features.map((feature, index) => (
                      <div className="col-md-6 feature-item" key={index}>
                        <i className="bi bi-check-circle-fill text-primary"></i>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Thông tin chi tiết */}
              {property.additionalDetails && (
                <div className="property-section">
                  <h3 className="section-title">Thông tin chi tiết</h3>
                  <div className="row">
                    {Object.entries(property.additionalDetails).map(([key, value], index) => (
                      <div className="col-md-6 mb-3" key={index}>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">
                            {key === 'direction' ? 'Hướng nhà' : 
                            key === 'floor' ? 'Tầng' : 
                            key === 'yearBuilt' ? 'Năm xây dựng' :
                            key === 'propertyType' ? 'Loại hình' :
                            key === 'ownership' ? 'Sở hữu' : key}:
                          </span>
                          <span className="fw-bold">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Vị trí */}
              <div className="property-section">
                <h3 className="section-title">Vị trí</h3>
                <div className="location-content">
                  <p>
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    {property.address}
                  </p>
                  <div className="map-placeholder" onClick={openMap}>
                    <div className="map-overlay">
                      <i className="bi bi-map me-2"></i>
                      Xem bản đồ
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Thông tin đăng tin */}
              <div className="property-section sidebar-box">
                <h3 className="section-title">Thông tin đăng tin</h3>
                <div className="listing-info">
                  <div className="info-item">
                    <span className="label">Mã tin đăng:</span>
                    <span className="value">BDS{property.id.toString().padStart(6, '0')}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Ngày đăng:</span>
                    <span className="value">{formatDate(property.createdAt)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Cập nhật lần cuối:</span>
                    <span className="value">{formatDate(property.updatedAt)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Trạng thái:</span>
                    <span className="value">
                      <span className="badge bg-success">Đang bán</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Chia sẻ */}
              <div className="property-section sidebar-box">
                <h3 className="section-title">Chia sẻ</h3>
                <div className="share-buttons">
                  <button 
                    className="btn btn-outline-primary share-btn facebook"
                    onClick={() => shareProperty('facebook')}
                  >
                    <i className="bi bi-facebook"></i>
                  </button>
                  <button 
                    className="btn btn-outline-primary share-btn twitter"
                    onClick={() => shareProperty('twitter')}
                  >
                    <i className="bi bi-twitter"></i>
                  </button>
                  <button 
                    className="btn btn-outline-primary share-btn email"
                    onClick={() => shareProperty('email')}
                  >
                    <i className="bi bi-envelope"></i>
                  </button>
                  <button 
                    className="btn btn-outline-primary share-btn whatsapp"
                    onClick={() => shareProperty('whatsapp')}
                  >
                    <i className="bi bi-whatsapp"></i>
                  </button>
                  <button 
                    className="btn btn-outline-primary share-btn copy"
                    onClick={() => shareProperty('copy')}
                  >
                    <i className="bi bi-link-45deg"></i>
                  </button>
                </div>
              </div>
              
              {/* Báo cáo */}
              <div className="property-section sidebar-box">
                <div className="report-listing">
                  <button className="btn btn-outline-secondary w-100">
                    <i className="bi bi-flag me-2"></i>
                    Báo cáo tin đăng không hợp lệ
                  </button>
                </div>
              </div>

              {/* Danh sách hot theo thị trường nhà đất */}
              <div className="property-section sidebar-box">
                <h3 className="section-title">Danh sách hot <i className="bi bi-fire text-danger flame-icon"></i></h3>
                <ul className="list-group">
                  {['Căn hộ cao cấp Quận 1', 'Biệt thự ven sông', 'Shophouse trung tâm', 'Căn hộ view biển', 'Nhà phố hiện đại', 'Villa Đà Lạt'].map((item, index) => (
                    <li className="list-group-item" key={index} style={{ transition: 'background-color 0.3s ease', cursor: 'pointer' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                      <h6 className="mb-0" style={{ fontWeight: 'bold', color: '#333' }}>{item}</h6>
                      <small className="text-muted">Vị trí đắc địa, giá hấp dẫn</small>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bất động sản tương tự */}
      <div className="similar-properties-section">
        <div className="container py-5">
          <h2 className="section-title text-center mb-4">Bất động sản tương tự</h2>
          <div className="row">
            {properties.slice(0, 3).map((property) => (
              <div key={property.id} className="col-lg-4 col-md-6 mb-4">
                <div className="property-card">
                  <div className="property-img">
                    <img src={property.featuredImage} alt={property.title} />
                    <div className="property-tag">{property.status}</div>
                  </div>
                  <div className="property-info">
                    <h5>{property.title}</h5>
                    <p className="location">
                      <i className="bi bi-geo-alt me-1"></i>
                      {property.location}
                    </p>
                    <div className="property-features">
                      <span><i className="bi bi-rulers me-1"></i>{property.area}m²</span>
                      <span><i className="bi bi-house-door me-1"></i>{property.bedrooms} PN</span>
                      <span><i className="bi bi-droplet me-1"></i>{property.bathrooms} VS</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="price">{property.price}</div>
                      <Link to={`/property/${property.id}`} className="btn btn-sm btn-outline-primary">Xem chi tiết</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Modal đặt lịch xem */}
      {showViewingModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Đặt lịch xem bất động sản</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowViewingModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleScheduleViewing}>
                  <div className="mb-3">
                    <label htmlFor="viewing-date" className="form-label">Chọn ngày xem</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="viewing-date"
                      value={viewingDate}
                      onChange={(e) => setViewingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="viewing-time" className="form-label">Chọn giờ xem</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      id="viewing-time"
                      value={viewingTime}
                      onChange={(e) => setViewingTime(e.target.value)}
                      required
                    />
                    <small className="text-muted">
                      Giờ xem: 9:00 - 18:00
                    </small>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary me-2"
                      onClick={() => setShowViewingModal(false)}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Xác nhận
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Form nhắn tin cho nhà môi giới */}
      <div className="agent-contact-section py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="agent-contact-container shadow-sm rounded bg-white p-4">
                <h2 className="section-title text-center mb-4">
                  <i className="bi bi-envelope-paper me-2 text-primary"></i>
                  Liên hệ với chúng tôi
                </h2>
                
                <div className="row mb-4">
                  <div className="col-md-4 mb-3 mb-md-0">
                    <div className="agent-card text-center p-3 h-100">
                      <div className="agent-avatar mb-3">
                        <img 
                          src="https://placehold.co/100x100?text=Môi+giới" 
                          alt="Agent" 
                          className="rounded-circle"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                      </div>
                      <h5 className="agent-name">Nguyễn Văn A</h5>
                      <p className="agent-role small text-muted mb-2">Môi giới bất động sản</p>
                      <div className="agent-contact">
                        <p className="agent-phone mb-1">
                          <i className="bi bi-telephone me-1"></i> 0987.654.321
                        </p>
                        <p className="agent-email small text-truncate mb-0">
                          <i className="bi bi-envelope me-1"></i> agent@makaan.com
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-8">
                    {agentFormStatus.submitted && (
                      <div className={`alert ${agentFormStatus.success ? 'alert-success' : 'alert-danger'} mb-3`}>
                        {agentFormStatus.success 
                          ? 'Thông tin của bạn đã được gửi đi! Nhà môi giới sẽ liên hệ lại với bạn sớm.' 
                          : agentFormStatus.error}
                      </div>
                    )}
                    
                    <form onSubmit={handleAgentFormSubmit} className="agent-contact-form">
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Họ và tên <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="form-control"
                          placeholder="Nhập họ và tên của bạn"
                          value={agentFormData.name}
                          onChange={handleAgentFormChange}
                          required
                        />
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                          <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Nhập email của bạn"
                            value={agentFormData.email}
                            onChange={handleAgentFormChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="phone" className="form-label">Số điện thoại <span className="text-danger">*</span></label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="form-control"
                            placeholder="Nhập số điện thoại của bạn"
                            value={agentFormData.phone}
                            onChange={handleAgentFormChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="message" className="form-label">Tin nhắn <span className="text-danger">*</span></label>
                        <textarea
                          id="message"
                          name="message"
                          className="form-control"
                          rows="4"
                          placeholder="Tôi muốn biết thêm thông tin về bất động sản này..."
                          value={agentFormData.message}
                          onChange={handleAgentFormChange}
                          required
                        ></textarea>
                      </div>
                      
                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="consent"
                          required
                        />
                        <label className="form-check-label small" htmlFor="consent">
                          Tôi đồng ý cho phép lưu trữ thông tin và liên hệ theo các thông tin đã cung cấp
                        </label>
                      </div>
                      
                      <div className="text-center">
                        <button type="submit" className="btn btn-primary px-5 py-2">
                          <i className="bi bi-send me-2"></i>
                          Gửi tin nhắn
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default PropertyDetail; 