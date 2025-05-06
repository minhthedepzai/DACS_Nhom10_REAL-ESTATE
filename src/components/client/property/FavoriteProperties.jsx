import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { BsHeart, BsHeartFill, BsGeoAlt, BsRulers, BsDoorClosed, BsDroplet, BsTrash } from 'react-icons/bs';
import './PropertyDetail.css';
import '../user/Favorites.css';
import BackToTop from '../BackToTop';

const FavoriteProperties = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid hoặc list
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Lấy danh sách bất động sản yêu thích từ localStorage
    const loadFavorites = () => {
      setLoading(true);
      try {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(savedFavorites);
      } catch (error) {
        console.error("Lỗi khi tải danh sách yêu thích:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
    document.title = "Bất động sản yêu thích";

    // Theo dõi thay đổi kích thước màn hình
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Tự động chuyển sang chế độ list nếu màn hình nhỏ
      if (window.innerWidth < 576 && viewMode === 'grid') {
        setViewMode('list');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Gọi một lần khi component mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [viewMode]);

  // Xóa một bất động sản khỏi danh sách yêu thích
  const removeFromFavorites = (id) => {
    const updatedFavorites = favorites.filter(property => property.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Xóa tất cả bất động sản khỏi danh sách yêu thích
  const clearAllFavorites = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả bất động sản yêu thích?')) {
      setFavorites([]);
      localStorage.removeItem('favorites');
    }
  };

  // Format giá 
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(price);
    }
    return price; // Trả về nguyên chuỗi nếu không phải số
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </Container>
    );
  }

  // Render property card
  const renderPropertyCard = (property) => {
    if (viewMode === 'grid') {
      return (
        <Col key={property.id} lg={4} md={6} sm={6} className="mb-4 animate-fade-in">
          <Card className="favorite-card h-100 border-0 shadow-sm">
            <div className="favorite-image-container">
              <Card.Img 
                variant="top" 
                src={property.image} 
                className="favorite-img"
                alt={property.title}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400?text=Bất+động+sản';
                }}
              />
              <div className="favorite-overlay">
                <button 
                  className="favorite-button active"
                  onClick={() => removeFromFavorites(property.id)}
                  aria-label="Xóa khỏi yêu thích"
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
            </div>
            <Card.Body className="p-3">
              <Card.Title className="favorite-title mb-3">{property.title}</Card.Title>
              <div className="location-text mb-3">
                <BsGeoAlt className="me-2 text-primary" />
                <span>{property.address}</span>
              </div>
              <div className="favorite-features mb-3">
                <div className="feature-item">
                  <BsRulers className="me-1" />
                  <span>{property.area} m²</span>
                </div>
                <div className="feature-item">
                  <BsDoorClosed className="me-1" />
                  <span>{property.bedrooms} PN</span>
                </div>
                <div className="feature-item">
                  <BsDroplet className="me-1" />
                  <span>{property.bathrooms} VS</span>
                </div>
              </div>
              <div className={`d-flex ${windowWidth <= 375 ? 'flex-column align-items-start' : 'justify-content-between align-items-center'} mt-3`}>
                <div className="text-primary fw-bold fs-5 mb-2">{formatPrice(property.price)}</div>
                <Link 
                  to={`/property/${property.id}`} 
                  className="btn btn-outline-primary btn-sm rounded-pill px-3"
                >
                  Xem chi tiết
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      );
    } else {
      return (
        <Col key={property.id} xs={12} className="mb-3 animate-slide-in">
          <Card className="favorite-list-card border-0 shadow-sm">
            <div className="row g-0">
              <div className={`${windowWidth <= 375 ? 'col-12' : 'col-md-4 col-5'} position-relative`}>
                <div className="favorite-image-container h-100">
                  <Card.Img 
                    src={property.image} 
                    className="favorite-img h-100"
                    alt={property.title}
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x400?text=Bất+động+sản';
                    }}
                  />
                  <div className="favorite-overlay">
                    <button 
                      className="favorite-button active"
                      onClick={() => removeFromFavorites(property.id)}
                      aria-label="Xóa khỏi yêu thích"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className={`${windowWidth <= 375 ? 'col-12' : 'col-md-8 col-7'}`}>
                <Card.Body className={`p-${windowWidth <= 375 ? '2' : '4'}`}>
                  <Card.Title className="favorite-title mb-3">{property.title}</Card.Title>
                  <div className="location-text mb-3">
                    <BsGeoAlt className="me-2 text-primary" />
                    <span>{property.address}</span>
                  </div>
                  <div className="favorite-features mb-3">
                    <div className="feature-item">
                      <BsRulers className="me-1" />
                      <span>{property.area} m²</span>
                    </div>
                    <div className="feature-item">
                      <BsDoorClosed className="me-1" />
                      <span>{property.bedrooms} PN</span>
                    </div>
                    <div className="feature-item">
                      <BsDroplet className="me-1" />
                      <span>{property.bathrooms} VS</span>
                    </div>
                  </div>
                  <div className={`d-flex ${windowWidth <= 375 ? 'flex-column align-items-start' : 'justify-content-between align-items-center'} mt-3`}>
                    <div className="text-primary fw-bold fs-5 mb-2">{formatPrice(property.price)}</div>
                    <Link 
                      to={`/property/${property.id}`} 
                      className="btn btn-outline-primary btn-sm rounded-pill px-3"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </Card.Body>
              </div>
            </div>
          </Card>
        </Col>
      );
    }
  };

  return (
    <div className="favorites-container py-5">
      <Container>
        {/* Header */}
        <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center mb-2">
            <BsHeartFill className="text-danger me-2" size={windowWidth <= 375 ? 20 : 24} />
            <h2 className="mb-0">Bất động sản yêu thích</h2>
          </div>
          <div className="d-flex align-items-center">
            {windowWidth > 375 && (
              <div className="view-toggle me-3">
                <Button 
                  variant={viewMode === 'grid' ? 'primary' : 'outline-primary'} 
                  size="sm" 
                  className="me-2 rounded-pill"
                  onClick={() => setViewMode('grid')}
                >
                  <i className="bi bi-grid"></i>
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'primary' : 'outline-primary'} 
                  size="sm" 
                  className="rounded-pill"
                  onClick={() => setViewMode('list')}
                >
                  <i className="bi bi-list"></i>
                </Button>
              </div>
            )}
            
            {favorites.length > 0 && (
              <Button
                variant="outline-danger"
                size="sm"
                className="rounded-pill px-3"
                onClick={clearAllFavorites}
              >
                <BsTrash className="me-1" /> {windowWidth <= 375 ? '' : 'Xóa tất cả'}
              </Button>
            )}
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-favorites animate-fade-in">
            <div className="text-center py-5">
              <div className="empty-heart-icon mb-3">
                <BsHeartFill size={windowWidth <= 375 ? 36 : 48} />
              </div>
              <h4>Danh sách yêu thích trống</h4>
              <p className="text-muted">Bạn chưa thêm bất động sản nào vào danh sách yêu thích</p>
              <Link to="/properties" className="btn btn-primary rounded-pill px-4 mt-2">
                Khám phá bất động sản
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-muted mb-4">Bạn đang có {favorites.length} bất động sản yêu thích</p>
            <Row className={viewMode === 'grid' ? 'g-4' : 'g-3'}>
              {favorites.map(property => renderPropertyCard(property))}
            </Row>
          </>
        )}
      </Container>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default FavoriteProperties; 