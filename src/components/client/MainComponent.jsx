import React, { useEffect, useState } from 'react';
import './css/style.css';
import Header from './Header.jsx';
import PropertyList from './PropertyList.jsx';
import PropertyType from './PropertyType';
import './css/Navbar.css';
import './css/MainComponent.css';
import 'animate.css';
import 'font-awesome/css/font-awesome.min.css';
import { FaHome } from 'react-icons/fa';

const MainComponent = () => {
  const [showSpinner, setShowSpinner] = useState(true);

  // Spinner effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
        const WOW = require('wow.js');
        new WOW().init();  // Cách khởi tạo này có thể giúp bạn tránh lỗi
        console.log('WOW.js initialization okkkk:');
      }
    } catch (error) {
      console.log('WOW.js initialization error:', error);
    }
  }, []);

  return (
    <div className="container-xxl bg-white p-0">

      {/* Custom Spinner */}
      {showSpinner && (
        <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
          <div className="loader-container">
            <div className="spinner-wrapper">
              <div className="spinner-circle"></div>
              <div className="spinner-icon">
                <FaHome style={{ fontSize: '24px', color: 'white' }} />
              </div>
              <div className="spinner-text">MAKAAN</div>
            </div>
            <div className="loading-text">Đang tải dữ liệu bất động sản...</div>
          </div>
        </div>
      )}

      {/* Header (with Navbar inside) */}
      <Header isHomePage={true} />

      {/* Search Section */}
      <div className="container-fluid mb-5 wow fadeIn" data-wow-delay="0.1s" style={{ padding: '35px', backgroundColor: '#00B98E', boxShadow: '0 4px 15px rgba(0, 185, 142, 0.2)' }}>
      {/* <div className="container-fluid bg-primary mb-5" style={{ padding: '35px' }}> */}
        <div className="container">
          <div className="row g-2">
            <div className="col-lg-10 col-md-12">
              <div className="row g-2">
                <div className="col-md-4 col-sm-6 col-12 mb-2 mb-sm-0">
                  <select className="form-select border-0 py-3 animate-input">
                    <option>Loại Bất Động Sản</option>
                    <option value="1">Chung cư</option>
                    <option value="2">Biệt thự</option>
                    <option value="3">Nhà phố</option>
                    <option value="4">Văn phòng</option>
                    <option value="5">Đất nền</option>
                  </select>
                </div>
                <div className="col-md-4 col-sm-6 col-12 mb-2 mb-sm-0">
                  <select className="form-select border-0 py-3 animate-input">
                    <option>Khu Vực</option>
                    <option value="1">Quận 1</option>
                    <option value="2">Quận 2</option>
                    <option value="3">Quận 3</option>
                    <option value="4">Quận 7</option>
                    <option value="5">Quận Bình Thạnh</option>
                  </select>
                </div>
                <div className="col-md-4 col-sm-12 col-12">
                  <select className="form-select border-0 py-3 animate-input">
                    <option>Giá Tiền</option>
                    <option value="1">Dưới 1 tỷ</option>
                    <option value="2">1 - 2 tỷ</option>
                    <option value="3">2 - 3 tỷ</option>
                    <option value="4">3 - 5 tỷ</option>
                    <option value="5">Trên 5 tỷ</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-12 mt-2 mt-lg-0">
              <button className="btn border-0 w-100 py-3 animate-input" style={{ backgroundColor: '#0E2E50', color: 'white', fontWeight: 'bold', boxShadow: '0 3px 10px rgba(14, 46, 80, 0.3)' }}>Tìm Kiếm</button>
            </div>
          </div>
        </div>
      </div>

      {/* Property Type Section */}
      <PropertyType />

      {/* Property List Section */}
      <div className="container">
        <PropertyList />
      </div>

    </div>
  );
};

export default MainComponent;