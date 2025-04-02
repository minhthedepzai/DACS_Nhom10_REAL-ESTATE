import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/Navbar.css';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const location = useLocation();

  // Xử lý sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 45);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Đếm số bất động sản yêu thích
  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavoriteCount(favorites.length);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Kiểm tra đường dẫn hiện tại để highlight menu item
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`nav-bar ${isSticky ? 'sticky-top' : ''}`}>
      <nav className="navbar navbar-expand-lg bg-white navbar-light">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center text-center">
            <div className="icon p-2 me-2">
              <i className="bi bi-house-door text-primary" style={{ fontSize: '30px' }}></i>
            </div>
            <h1 className="m-0 text-primary">Makaan</h1>
          </Link>
          <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto">
              <Link to="/" className={`nav-item nav-link ${isActive('/') ? 'active' : ''}`}>
                Trang chủ
              </Link>
              <Link to="/about" className={`nav-item nav-link ${isActive('/about') ? 'active' : ''}`}>
                Giới thiệu
              </Link>
              <div className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Bất động sản</button>
                <div className="dropdown-menu rounded-0 m-0">
                  <Link to="/property-list" className={`dropdown-item ${isActive('/property-list') ? 'active' : ''}`}>
                    Danh sách BĐS
                  </Link>
                  <Link to="/property-type" className={`dropdown-item ${isActive('/property-type') ? 'active' : ''}`}>
                    Loại hình BĐS
                  </Link>
                  <Link to="/property-agent" className={`dropdown-item ${isActive('/property-agent') ? 'active' : ''}`}>
                    Nhà môi giới
                  </Link>
                </div>
              </div>
              <div className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Trang</button>
                <div className="dropdown-menu rounded-0 m-0">
                  <Link to="/testimonial" className={`dropdown-item ${isActive('/testimonial') ? 'active' : ''}`}>
                    Đánh giá
                  </Link>
                  <Link to="/404" className={`dropdown-item ${isActive('/404') ? 'active' : ''}`}>
                    404 Error
                  </Link>
                </div>
              </div>
              <Link to="/services" className={`nav-item nav-link ${isActive('/services') ? 'active' : ''}`}>
                Dịch vụ
              </Link>
              <Link to="/contact" className={`nav-item nav-link ${isActive('/contact') ? 'active' : ''}`}>
                Liên hệ
              </Link>
            </div>
            <div className="d-flex">
              <Link to="/login" className={`btn btn-outline-primary me-2 ${isActive('/login') ? 'active' : ''}`}>
                Đăng nhập
              </Link>
              <Link to="/profile" className={`btn btn-outline-primary me-2 ${isActive('/profile') ? 'active' : ''}`}>
                Hồ sơ
              </Link>
              <Link to="/favorites" className={`btn btn-outline-primary me-2 position-relative ${isActive('/favorites') ? 'active' : ''}`}>
                <i className="bi bi-heart me-1"></i>
                Yêu thích
                {favoriteCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {favoriteCount}
                    <span className="visually-hidden">bất động sản yêu thích</span>
                  </span>
                )}
              </Link>
              <Link to="/add-property" className={`btn btn-primary px-3 d-none d-lg-flex ${isActive('/add-property') ? 'active' : ''}`}>
                Đăng tin
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;