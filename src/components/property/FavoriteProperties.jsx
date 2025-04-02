import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PropertyDetail.css';
import BackToTop from '../BackToTop';
import Footer from '../Footer';

const FavoriteProperties = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
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
    // Lấy danh sách bất động sản yêu thích từ localStorage
    const loadFavorites = () => {
      setLoading(true);
      try {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(savedFavorites);
        setFavoriteCount(savedFavorites.length);
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
    document.title = "Bất động sản yêu thích";
  }, []);

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

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xxl bg-white p-0">
      <div className="property-detail-container py-5">
        <div className="container">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">Bất động sản yêu thích</h1>
            {favorites.length > 0 && (
              <button
                className="btn btn-outline-danger"
                onClick={clearAllFavorites}
              >
                <i className="bi bi-trash me-2"></i>
                Xóa tất cả
              </button>
            )}
          </div>

          {favorites.length === 0 ? (
            <div className="card p-5 text-center">
              <div className="py-5">
                <i className="bi bi-heart text-secondary display-1 mb-4"></i>
                <h3>Bạn chưa có bất động sản yêu thích nào</h3>
                <p className="text-muted">Khám phá các bất động sản và thêm vào danh sách yêu thích của bạn</p>
                <Link to="/properties" className="btn btn-primary mt-3">
                  Khám phá bất động sản
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="text-muted mb-4">Bạn đang có {favorites.length} bất động sản yêu thích</p>
              
              <div className="row">
                {favorites.map((property) => (
                  <div key={property.id} className="col-lg-4 col-md-6 mb-4">
                    <div className="property-card">
                      <div className="property-img">
                        <img src={property.image} alt={property.title} />
                        <button
                          className="favorite-button active"
                          onClick={() => removeFromFavorites(property.id)}
                          aria-label="Xóa khỏi yêu thích"
                        >
                          <i className="bi bi-heart-fill"></i>
                        </button>
                      </div>
                      <div className="property-info">
                        <h5><Link to={`/property/${property.id}`} className="text-decoration-none text-dark">{property.title}</Link></h5>
                        <p className="location">
                          <i className="bi bi-geo-alt me-1"></i>
                          {property.address}
                        </p>
                        <div className="property-features">
                          <span><i className="bi bi-rulers me-1"></i>{property.area}</span>
                          <span><i className="bi bi-house-door me-1"></i>{property.bedrooms} PN</span>
                          <span><i className="bi bi-droplet me-1"></i>{property.bathrooms} VS</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <div className="price">{property.price}</div>
                          <Link to={`/property/${property.id}`} className="btn btn-sm btn-outline-primary">
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default FavoriteProperties; 