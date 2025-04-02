import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PropertyDetail.css';
import BackToTop from '../BackToTop';
import Navbar from '../Navbar';
import Footer from '../Footer';

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
    // Mô phỏng việc gọi API để lấy chi tiết bất động sản dựa vào ID
    const fetchPropertyDetail = async () => {
      setLoading(true);
      try {
        // Dữ liệu mẫu - trong thực tế sẽ gọi API để lấy dữ liệu
        setTimeout(() => {
          // Mô phỏng bất động sản
          const mockProperty = {
            id: parseInt(id),
            title: "Căn hộ cao cấp Vinhomes Central Park",
            description: "Căn hộ cao cấp 3 phòng ngủ tại Vinhomes Central Park với đầy đủ nội thất, view sông và công viên tuyệt đẹp. Căn hộ được thiết kế hiện đại, thông thoáng với không gian sống tiện nghi và sang trọng.\n\nTọa lạc tại tầng 25 của tòa Park 5, căn hộ có hướng nhìn ra sông Sài Gòn và công viên 14ha. Tổng diện tích 90m², gồm 3 phòng ngủ, 2 phòng tắm, phòng khách và bếp được bố trí hợp lý.\n\nNội thất đầy đủ, chất lượng cao cấp bao gồm: sofa, bàn ăn, tủ bếp, máy lạnh, tủ lạnh, máy giặt, giường, tủ quần áo. Bàn giao ngay, có thể dọn vào ở liền hoặc cho thuê sinh lời.",
            price: "5.5 tỷ",
            area: "90m²",
            bedrooms: 3,
            bathrooms: 2,
            legalStatus: "Sổ hồng",
            featuredImage: "https://via.placeholder.com/800x500",
            images: [
              "https://via.placeholder.com/800x500?text=Living+Room",
              "https://via.placeholder.com/800x500?text=Bedroom",
              "https://via.placeholder.com/800x500?text=Kitchen",
              "https://via.placeholder.com/800x500?text=Bathroom",
              "https://via.placeholder.com/800x500?text=Balcony"
            ],
            coordinates: {
              latitude: 10.7956,
              longitude: 106.7218
            },
            address: "Vinhomes Central Park, Quận Bình Thạnh, TP. Hồ Chí Minh",
            features: [
              "Ban công rộng",
              "Hồ bơi chung",
              "Phòng gym",
              "Bảo vệ 24/7",
              "Trường học quốc tế",
              "Siêu thị",
              "Gần công viên",
              "Tầng cao",
              "View sông",
              "Đầy đủ nội thất"
            ],
            additionalDetails: {
              direction: "Đông Nam",
              floor: 25,
              yearBuilt: 2018,
              propertyType: "Căn hộ cao cấp",
              ownership: "Sở hữu tư nhân"
            },
            createdAt: "2023-03-01T08:00:00",
            updatedAt: "2023-03-15T10:30:00",
            contactInfo: {
              name: "Nguyễn Văn A",
              phone: "0987654321",
              email: "nguyenvana@example.com"
            }
          };
          
          setProperty(mockProperty);
          setLoading(false);
          document.title = mockProperty.title;
          
          // Kiểm tra xem bất động sản này có trong danh sách yêu thích không
          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          if (favorites.some(fav => fav.id === parseInt(id))) {
            setIsFavorite(true);
          }
        }, 1000);
      } catch (error) {
        console.error("Error fetching property details:", error);
        setLoading(false);
      }
    };

    fetchPropertyDetail();
    
    // Cuộn lên đầu trang khi component mount
    window.scrollTo(0, 0);
  }, [id]);

  // Xử lý thêm/xóa yêu thích
  const toggleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    
    // Lưu trạng thái yêu thích vào localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (newFavoriteStatus) {
      // Thêm vào yêu thích nếu chưa có
      if (!favorites.some(fav => fav.id === property.id)) {
        const propertyToSave = {
          id: property.id,
          title: property.title,
          price: property.price,
          area: property.area,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          address: property.address,
          image: property.images[0]
        };
        favorites.push(propertyToSave);
      }
    } else {
      // Xóa khỏi yêu thích
      const updatedFavorites = favorites.filter(fav => fav.id !== property.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
    
    if (newFavoriteStatus) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  };

  // Xử lý đặt lịch xem
  const handleScheduleViewing = (e) => {
    e.preventDefault();
    if (!viewingDate || !viewingTime) {
      alert("Vui lòng chọn ngày và giờ xem nhà!");
      return;
    }
    
    // Xử lý logic đặt lịch xem
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
      {/* Navbar with sticky effect */}
      <Navbar />

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
        <div className="container py-4">
          <div className="row">
            {/* Gallery */}
            <div className="col-lg-8 mb-4">
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
                    <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  </button>
                </div>
                
                <div className="thumbnails-container">
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
            <div className="col-lg-4 mb-4">
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
            </div>
          </div>
        </div>
      </div>
      
      {/* Bất động sản tương tự */}
      <div className="similar-properties-section">
        <div className="container py-5">
          <h2 className="section-title text-center mb-4">Bất động sản tương tự</h2>
          <div className="row">
            {[1, 2, 3].map((item) => (
              <div key={item} className="col-lg-4 col-md-6 mb-4">
                <div className="property-card">
                  <div className="property-img">
                    <img src={`https://via.placeholder.com/350x200?text=Property+${item}`} alt={`Property ${item}`} />
                    <div className="property-tag">Mới</div>
                  </div>
                  <div className="property-info">
                    <h5>Căn hộ {item} phòng ngủ tại Quận {item + 1}</h5>
                    <p className="location">
                      <i className="bi bi-geo-alt me-1"></i>
                      Quận {item + 1}, TP. Hồ Chí Minh
                    </p>
                    <div className="property-features">
                      <span><i className="bi bi-rulers me-1"></i>8{item}m²</span>
                      <span><i className="bi bi-house-door me-1"></i>{item} PN</span>
                      <span><i className="bi bi-droplet me-1"></i>{item} VS</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="price">{item}.5 tỷ</div>
                      <Link to={`/property/${item + 10}`} className="btn btn-sm btn-outline-primary">Xem chi tiết</Link>
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
      
      {/* Footer */}
      <Footer />
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default PropertyDetail; 