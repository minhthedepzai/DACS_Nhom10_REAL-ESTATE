import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import './css/Navbar.css';
import 'animate.css';

// Tạm bỏ import WOW để tránh lỗi nếu có
// import WOW from 'wowjs';

const About = () => {
  const [animatedHeader, setAnimatedHeader] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    about: false,
    action: false,
    team: false
  });

  useEffect(() => {
    // Loại bỏ WOW.js để tránh hiệu ứng không mong muốn
    // Kích hoạt hiệu ứng header sau khi tải trang
    const timer = setTimeout(() => {
      setAnimatedHeader(true);
    }, 300);
    
    const handleScroll = () => {
      const sections = {
        about: document.querySelector('.about-section'),
        action: document.querySelector('.action-card'),
        team: document.querySelector('.team-section')
      };

      Object.entries(sections).forEach(([key, section]) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          const isVisible = rect.top <= window.innerHeight * 0.75;
          setVisibleSections(prev => ({ ...prev, [key]: isVisible }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial visibility

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="container-xxl bg-white p-0">
        {/* About Content Start */}
        <div className={`about-section ${visibleSections.about ? 'animate__animated animate__fadeIn' : ''}`}>
            <div className="container">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6">
                        <div className="about-img position-relative overflow-hidden p-5 pe-0">
                            <img className="img-fluid w-100 about-main-img" src="/img/about-team.jpg" alt="About" />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <h1 className="mb-4 content-title text-center animate__animated animate__fadeInDown">Nơi Lý Tưởng Để Tìm Bất Động Sản Hoàn Hảo</h1>
                        <p className="mb-4 content-paragraph text-center animate__animated animate__fadeIn">Chúng tôi tự hào là đơn vị tiên phong trong lĩnh vực bất động sản, mang đến cho khách hàng những trải nghiệm tốt nhất với dịch vụ chuyên nghiệp và uy tín.</p>
                        <div className="animate__animated animate__fadeInUp">
                            <p className="feature-item"><i className="fa fa-check text-primary me-3 icon-check"></i>Đội ngũ tư vấn chuyên nghiệp</p>
                            <p className="feature-item"><i className="fa fa-check text-primary me-3 icon-check"></i>Danh mục bất động sản đa dạng</p>
                            <p className="feature-item"><i className="fa fa-check text-primary me-3 icon-check"></i>Dịch vụ hỗ trợ tận tâm</p>
                        </div>
                        <div className="text-center animate__animated animate__fadeInUp">
                            <Link className="btn btn-primary py-3 px-5 mt-3 btn-animate" to="/contact">Xem Thêm</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* About Content End */}
        
        {/* Call to Action Start */}
        <div className="container-xxl py-5">
            <div className="container">
                <div className={`bg-light rounded p-3 action-card ${visibleSections.action ? 'animate__animated animate__fadeInUp' : ''}`}>
                    <div className="bg-white rounded p-4" style={{border: '1px dashed rgba(0, 185, 142, .3)'}}>
                        <div className="row g-5 align-items-center">
                            <div className="col-lg-6">
                                <div className="action-img-container">
                                    <img className="img-fluid rounded w-100 action-img" src="/img/chuyenvien.png" alt="Call to action" />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="mb-4 action-content text-center">
                                    <h1 className="mb-3 content-title">Liên Hệ Với Chuyên Viên Tư Vấn</h1>
                                    <p className="content-paragraph">Đội ngũ chuyên viên tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ ngay để được tư vấn chi tiết về các dự án bất động sản phù hợp.</p>
                                </div>
                                <div className="text-center">
                                    <a href="tel:+0123456789" className="btn btn-primary py-3 px-4 me-2 btn-animate">
                                        <i className="fa fa-phone-alt me-2 icon-rotate"></i>Gọi Ngay
                                    </a>
                                    <Link to="/contact" className="btn btn-dark py-3 px-4 btn-animate">
                                        <i className="fa fa-calendar-alt me-2 icon-bounce"></i>Đặt Lịch Hẹn
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Call to Action End */}

        {/* Team Section */}
        <div className={`container-xxl py-5 team-section ${visibleSections.team ? 'animate__animated animate__fadeIn' : ''}`}>
            <div className="container">
                <div className="text-center mx-auto mb-5" style={{maxWidth: '600px'}}>
                    <h1 className="mb-3 section-title">Đội Ngũ Chuyên Viên</h1>
                    <p className="section-description">
                        Với đội ngũ chuyên viên tư vấn nhiều kinh nghiệm, 
                        chúng tôi cam kết mang đến cho khách hàng những dịch vụ tốt nhất và sự hài lòng tuyệt đối.
                    </p>
                </div>
                <div className="row g-4">
                    {[
                        {
                            name: "Nguyễn Văn A",
                            role: "Giám đốc kinh doanh",
                            image: "anh1.jpg"
                        },
                        {
                            name: "Trần Thị B",
                            role: "Chuyên viên tư vấn",
                            image: "anh2.jpg"
                        },
                        {
                            name: "Lê Văn C",
                            role: "Chuyên viên phân tích",
                            image: "anh3.jpg"
                        },
                        {
                            name: "Phạm Thị D",
                            role: "Chuyên viên tư vấn",
                            image: "Capture.PNG"
                        }
                    ].map((member, index) => (
                        <div key={index} className="col-lg-3 col-md-6">
                            <div className="team-item rounded overflow-hidden team-card">
                                <div className="position-relative team-img-container">
                                    <img 
                                        className="img-fluid team-img" 
                                        src={`/img/${member.image}`} 
                                        alt={`Team ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            objectPosition: 'center'
                                        }}
                                    />
                                    <div className="team-social">
                                        <a className="team-social-btn" href="#" onClick={(e) => e.preventDefault()}>
                                            <i className="fab fa-facebook-f"></i>
                                        </a>
                                        <a className="team-social-btn" href="#" onClick={(e) => e.preventDefault()}>
                                            <i className="fab fa-twitter"></i>
                                        </a>
                                        <a className="team-social-btn" href="#" onClick={(e) => e.preventDefault()}>
                                            <i className="fab fa-instagram"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="text-center p-4 mt-3 team-info">
                                    <h5 className="fw-bold mb-0 team-name">{member.name}</h5>
                                    <small className="team-role">{member.role}</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        {/* Team End */}
    </div>
  );
};

export default About;
