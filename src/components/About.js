import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './css/Navbar.css';
import './css/About.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const About = () => {
  return (
    <div className="container-xxl bg-white p-0">
      <Navbar />
      
      {/* Hero Section */}
      <div className="container-fluid p-0">
        <div className="container">
          <div className="row align-items-center py-5 about-hero">
            <div className="col-lg-6 text-start about-hero-content">
              <h1 className="display-4 mb-4">Về Chúng Tôi</h1>
              <p className="text-muted mb-4">
                Đồng hành cùng bạn trong hành trình tìm kiếm ngôi nhà mơ ước
              </p>
            </div>
            <div className="col-lg-6">
              <img 
                src="/img/about.jpg" 
                alt="About Us"
                className="img-fluid rounded-3"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row align-items-center about-main-content">
          <div className="col-lg-6 text-center text-lg-start">
            <h2 className="display-5 mb-4">Makaan - Nơi Khởi Đầu Của Một Tổ Ấm</h2>
            <p className="text-muted mb-4">
              Chúng tôi không chỉ đơn thuần là một công ty môi giới bất động sản. 
              Chúng tôi là người đồng hành đáng tin cậy, giúp bạn tìm kiếm và sở hữu 
              ngôi nhà mơ ước của mình.
            </p>
            <div className="row g-4">
              <div className="col-6">
                <div className="d-flex align-items-center feature-item">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  <span>Uy tín hàng đầu</span>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center feature-item">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  <span>Tư vấn chuyên sâu</span>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center feature-item">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center feature-item">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  <span>Giá cả cạnh tranh</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <img 
              src="/img/dreamhouse.jpg" 
              alt="Our Services"
              className="img-fluid rounded-3"
              style={{ width: '100%', height: '400px', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Giá trị cốt lõi */}
        <div className="core-values py-5">
          <div className="core-values-content">
            <h2 className="display-5 mb-5 text-center">Giá Trị Cốt Lõi</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="value-item text-center">
                  <i className="bi bi-shield-check"></i>
                  <h4>Uy Tín</h4>
                  <p>Cam kết mang đến những sản phẩm và dịch vụ chất lượng, đáng tin cậy cho khách hàng</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="value-item text-center">
                  <i className="bi bi-people"></i>
                  <h4>Tận Tâm</h4>
                  <p>Luôn đặt lợi ích của khách hàng lên hàng đầu và phục vụ với tinh thần tận tụy nhất</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="value-item text-center">
                  <i className="bi bi-graph-up-arrow"></i>
                  <h4>Chuyên Nghiệp</h4>
                  <p>Đội ngũ nhân viên được đào tạo chuyên sâu, luôn cập nhật xu hướng mới nhất</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section rounded-3">
          <div className="cta-content">
            <h2>Bạn Đang Tìm Kiếm Ngôi Nhà Mơ Ước?</h2>
            <p>
              Hãy để chúng tôi đồng hành cùng bạn trong hành trình này
            </p>
            <a href="/contact" className="btn btn-light px-4 py-2 rounded-pill cta-button">
              Liên Hệ Ngay
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
