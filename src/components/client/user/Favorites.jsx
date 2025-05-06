import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Badge, Tabs, Tab, Placeholder, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsHeartFill, BsGeoAlt, BsRulers, BsDoorClosed, BsDroplet, BsClock, BsGrid, BsList } from 'react-icons/bs';
import { IoCloseOutline } from 'react-icons/io5';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid hoặc list

  // Hàm mô phỏng lấy danh sách yêu thích
  useEffect(() => {
    const fetchFavorites = async () => {
      // Thay bằng API call thực tế
      setTimeout(() => {
        const mockFavorites = [
          {
            id: 1,
            title: 'Căn hộ cao cấp Vinhomes Central Park',
            price: 5500000000,
            location: 'Quận Bình Thạnh, TP. HCM',
            area: 98.5,
            bedrooms: 3,
            bathrooms: 2,
            type: 'apartment',
            status: 'sale',
            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
            addedDate: '2023-11-15',
          },
          {
            id: 2,
            title: 'Biệt thự vườn Thảo Điền',
            price: 28000000000,
            location: 'Quận 2, TP. HCM',
            area: 350,
            bedrooms: 5,
            bathrooms: 6,
            type: 'villa',
            status: 'sale',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
            addedDate: '2023-10-20',
          },
          {
            id: 3,
            title: 'Nhà phố liền kề The Palm',
            price: 12500000000,
            location: 'Quận 9, TP. HCM',
            area: 125,
            bedrooms: 4,
            bathrooms: 3,
            type: 'house',
            status: 'sale',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
            addedDate: '2023-11-02',
          },
          {
            id: 4,
            title: 'Căn hộ dịch vụ Masteri Thảo Điền',
            price: 15000000,
            location: 'Quận 2, TP. HCM',
            area: 68,
            bedrooms: 2,
            bathrooms: 1,
            type: 'apartment',
            status: 'rent',
            image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7',
            addedDate: '2023-11-10',
          },
        ];
        setFavorites(mockFavorites);
        setLoading(false);
      }, 800);
    };

    fetchFavorites();
  }, []);

  // Xử lý xóa khỏi yêu thích
  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  // Format giá
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Tính thời gian đã thêm vào danh sách yêu thích
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const addedDate = new Date(dateString);
    const diffTime = Math.abs(now - addedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hôm nay';
    } else if (diffDays === 1) {
      return 'Hôm qua';
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} tuần trước`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng trước`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} năm trước`;
    }
  };

  // Render loading placeholders
  const renderLoadingPlaceholders = () => {
    return Array(4).fill(0).map((_, index) => (
      <Col key={index} lg={6} xl={viewMode === 'grid' ? 6 : 12} className="mb-4">
        <Card className="favorite-card h-100 border-0 shadow-sm">
          <Placeholder as={Card.Img} animation="glow" variant="top" xs={12} style={{ height: '220px', background: '#e9ecef' }} />
          <Card.Body>
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={8} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={6} /> <Placeholder xs={4} /> <Placeholder xs={7} />
            </Placeholder>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  // Render property card
  const renderPropertyCard = (property) => {
    if (viewMode === 'grid') {
      return (
        <div
          key={property.id}
          className="col-md-6 col-xl-6 mb-4 animate-fade-in"
        >
          <Card className="favorite-card h-100 border-0 shadow-sm position-relative overflow-hidden">
            <div className="favorite-image-container">
              <Card.Img 
                variant="top" 
                src={property.image} 
                className="favorite-img"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400?text=Bất+động+sản';
                }}
              />
              <div className="favorite-overlay">
                <button 
                  variant="link" 
                  className="favorite-button active"
                  onClick={() => handleRemoveFavorite(property.id)}
                  aria-label="Xóa khỏi yêu thích"
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
              <div className="favorite-badges">
                <Badge bg={property.status === 'sale' ? 'primary' : 'success'} className="me-2">
                  {property.status === 'sale' ? 'Bán' : 'Cho thuê'}
                </Badge>
                <Badge bg="secondary">
                  {property.type === 'apartment' ? 'Căn hộ' : property.type === 'villa' ? 'Biệt thự' : 'Nhà phố'}
                </Badge>
              </div>
            </div>
            <Card.Body className="p-3">
              <div className="d-flex align-items-center mb-2">
                <BsClock className="text-muted me-2 small" />
                <small className="text-muted">Đã thêm {getTimeAgo(property.addedDate)}</small>
              </div>
              <Card.Title className="favorite-title mb-3">{property.title}</Card.Title>
              <div className="location-text mb-3">
                <BsGeoAlt className="me-2 text-primary" />
                <span>{property.location}</span>
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
                  <span>{property.bathrooms} WC</span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="text-primary fw-bold mb-0">
                  {formatPrice(property.price)}
                  {property.status === 'rent' && '/tháng'}
                </h5>
                <Link 
                  to={`/property/${property.id}`} 
                  className="btn btn-outline-primary btn-sm rounded-pill px-3"
                >
                  Xem chi tiết
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      );
    } else {
      return (
        <div
          key={property.id}
          className="col-12 mb-3 animate-slide-in"
        >
          <Card className="favorite-list-card border-0 shadow-sm overflow-hidden">
            <div className="row g-0">
              <div className="col-md-4 position-relative">
                <div className="favorite-image-container h-100">
                  <Card.Img 
                    src={property.image} 
                    className="favorite-img h-100"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/600x400?text=Bất+động+sản';
                    }}
                  />
                  <div className="favorite-overlay">
                    <button 
                      variant="link" 
                      className="favorite-button active"
                      onClick={() => handleRemoveFavorite(property.id)}
                      aria-label="Xóa khỏi yêu thích"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex gap-2 mb-2">
                      <Badge bg={property.status === 'sale' ? 'primary' : 'success'}>
                        {property.status === 'sale' ? 'Bán' : 'Cho thuê'}
                      </Badge>
                      <Badge bg="secondary">
                        {property.type === 'apartment' ? 'Căn hộ' : property.type === 'villa' ? 'Biệt thự' : 'Nhà phố'}
                      </Badge>
                    </div>
                    <div className="d-flex align-items-center">
                      <BsClock className="text-muted me-2 small" />
                      <small className="text-muted">Đã thêm {getTimeAgo(property.addedDate)}</small>
                    </div>
                  </div>
                  <Card.Title className="favorite-title mb-3">{property.title}</Card.Title>
                  <div className="location-text mb-3">
                    <BsGeoAlt className="me-2 text-primary" />
                    <span>{property.location}</span>
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
                      <span>{property.bathrooms} WC</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <h5 className="text-primary fw-bold mb-0">
                      {formatPrice(property.price)}
                      {property.status === 'rent' && '/tháng'}
                    </h5>
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
        </div>
      );
    }
  };

  return (
    <div className="favorites-container">
      {/* Phần tiêu đề và điều khiển hiển thị */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <BsHeartFill className="text-danger me-2" />
          <span className="view-toggle-label">Chế độ xem:</span>
          <div className="view-toggle ms-2">
            <Button 
              variant={viewMode === 'grid' ? 'primary' : 'outline-primary'} 
              size="sm" 
              className="me-2 rounded-pill"
              onClick={() => setViewMode('grid')}
            >
              <BsGrid className="me-1" /> Lưới
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'primary' : 'outline-primary'} 
              size="sm" 
              className="rounded-pill"
              onClick={() => setViewMode('list')}
            >
              <BsList className="me-1" /> Danh sách
            </Button>
          </div>
        </div>
        {favorites.length > 0 && (
          <small className="text-muted">{favorites.length} bất động sản yêu thích</small>
        )}
      </div>

      {/* Danh sách bất động sản */}
      {loading ? (
        <Row>{renderLoadingPlaceholders()}</Row>
      ) : favorites.length === 0 ? (
        <div className="empty-favorites animate-fade-in">
          <div className="text-center py-5">
            <div className="empty-heart-icon mb-3">
              <BsHeartFill size={48} />
            </div>
            <h4>Danh sách yêu thích trống</h4>
            <p className="text-muted">Bạn chưa thêm bất động sản nào vào danh sách yêu thích</p>
            <Link to="/properties" className="btn btn-primary rounded-pill px-4 mt-2">
              Khám phá bất động sản
            </Link>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <Row>
            {favorites.map(property => renderPropertyCard(property))}
          </Row>
        </div>
      )}
    </div>
  );
};

export default Favorites; 