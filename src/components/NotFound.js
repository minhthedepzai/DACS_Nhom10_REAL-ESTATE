import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './css/NotFound.css';

const NotFound = () => {
  return (
    <div className="container-xxl bg-white p-0">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="main-content">
        <div className="container-xxl py-5">
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-8 col-md-6 text-center text-lg-start">
                <h1 className="display-3 text-primary animated slideInLeft">404</h1>
                <h2 className="text-primary animated slideInLeft">Không Tìm Thấy Trang</h2>
                <p className="animated slideInLeft">Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
                <Link to="/" className="btn btn-primary py-3 px-5 animated slideInLeft">Về Trang Chủ</Link>
              </div>
              <div className="col-lg-4 col-md-6">
                <img className="img-fluid" src="/img/404.jpg" alt="404" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 