import React from 'react';
import { Link } from 'react-router-dom';
import './css/Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4">Liên Hệ Với Chúng Tôi</h5>
            <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>123 Đường ABC, Quận 1, TP.HCM</p>
            <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+84 123 456 789</p>
            <p className="mb-2"><i className="fa fa-envelope me-3"></i>info@makaan.com</p>
            <div className="d-flex pt-2">
              <button onClick={() => window.open('https://twitter.com')} className="btn btn-outline-light btn-social me-2"><i className="fab fa-twitter"></i></button>
              <button onClick={() => window.open('https://facebook.com')} className="btn btn-outline-light btn-social me-2"><i className="fab fa-facebook-f"></i></button>
              <button onClick={() => window.open('https://youtube.com')} className="btn btn-outline-light btn-social me-2"><i className="fab fa-youtube"></i></button>
              <button onClick={() => window.open('https://linkedin.com')} className="btn btn-outline-light btn-social"><i className="fab fa-linkedin-in"></i></button>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4">Liên Kết Nhanh</h5>
            <Link className="btn btn-link text-white-50" to="/about">Về Chúng Tôi</Link>
            <Link className="btn btn-link text-white-50" to="/contact">Liên Hệ</Link>
            <Link className="btn btn-link text-white-50" to="/services">Dịch Vụ</Link>
            <Link className="btn btn-link text-white-50" to="/privacy-policy">Chính Sách Bảo Mật</Link>
            <Link className="btn btn-link text-white-50" to="/terms">Điều Khoản & Điều Kiện</Link>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4">Thư Viện Ảnh</h5>
            <div className="row g-2 pt-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="col-4">
                  <img className="img-fluid rounded bg-light p-1" src={`/img/property-${num}.jpg`} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5 className="text-white mb-4">Đăng Ký Nhận Tin</h5>
            <p>Đăng ký để nhận những thông tin mới nhất về bất động sản</p>
            <div className="position-relative mx-auto" style={{ maxWidth: '400px' }}>
              <input className="form-control bg-transparent w-100 py-3 ps-4 pe-5" type="text" placeholder="Email của bạn" />
              <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">Đăng Ký</button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="copyright">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              &copy; <Link to="/" className="border-bottom">Makaan</Link>, Bản quyền đã được đăng ký.
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="footer-menu">
                <Link to="/">Trang Chủ</Link>
                <Link to="/cookies">Cookies</Link>
                <Link to="/help">Trợ Giúp</Link>
                <Link to="/faq">FAQs</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;