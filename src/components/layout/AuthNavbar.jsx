import React, { memo, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';

const AuthNavbar = () => {
  const history = useHistory();

  // Sử dụng useCallback để lưu trữ tham chiếu của hàm
  const navigateToHome = useCallback(() => {
    history.push('/');
  }, [history]);

  return (
    <div className="container-fluid nav-bar bg-transparent">
      <nav className="navbar navbar-expand-lg bg-white navbar-light py-0 px-4">
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
            <button 
              onClick={navigateToHome} 
              className="nav-item nav-link border-0 bg-transparent"
            >
              Trang chủ
            </button>
          </div>
          <div className="ms-3 d-flex align-items-center">
            <div className="dropdown">
              <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-globe me-1"></i> Tiếng Việt
              </button>
              <ul className="dropdown-menu" aria-labelledby="languageDropdown">
                <li><button className="dropdown-item">Tiếng Việt</button></li>
                <li><button className="dropdown-item">English</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

// Sử dụng memo để tối ưu hóa việc render
export default memo(AuthNavbar); 