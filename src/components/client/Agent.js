import React, { useState, useEffect } from 'react';
import './css/Agent.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';

const Agent = () => {
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavoriteCount(favorites.length);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  const agents = [
    {
      id: 1,
      name: "Vương Minh Thế",
      role: "Chuyên viên tư vấn BĐS",
      image: "/img/anh1.jpg",
      experience: "5 năm kinh nghiệm",
      properties: 120,
      rating: 4.8,
      phone: "0123.456.789",
      email: "minhthe@makaan.com",
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      id: 2,
      name: "Hồng Duy Điền",
      role: "Chuyên viên tư vấn BĐS",
      image: "/img/anh2.jpg",
      experience: "7 năm kinh nghiệm",
      properties: 150,
      rating: 4.9,
      phone: "0123.456.789",
      email: "duydien@makaan.com",
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      id: 3,
      name: "Nguyễn Tùng Dương",
      role: "Chuyên viên tư vấn BĐS",
      image: "/img/Capture.PNG",
      experience: "4 năm kinh nghiệm",
      properties: 90,
      rating: 4.7,
      phone: "0123.456.789",
      email: "tungduong@makaan.com",
      social: {
        facebook: "#",
        twitter: "#",
        instagram: "#"
      }
    }
  ];

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <h1 className="mb-3">Đội Ngũ Chuyên Viên Tư Vấn</h1>
          <p>Đội ngũ chuyên viên giàu kinh nghiệm, tận tâm và chuyên nghiệp sẽ hỗ trợ bạn tìm kiếm bất động sản phù hợp nhất.</p>
        </div>
        <div className="row g-4">
          {agents.map((agent, index) => (
            <div key={agent.id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={`${0.1 + index * 0.2}s`}>
              <div className="agent-card">
                <div className="agent-image-wrapper">
                  <img className="agent-image" src={agent.image} alt={agent.name} />
                  <div className="agent-overlay">
                    <div className="social-links">
                      <a href={agent.social.facebook} className="social-btn">
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a href={agent.social.twitter} className="social-btn">
                        <i className="bi bi-twitter"></i>
                      </a>
                      <a href={agent.social.instagram} className="social-btn">
                        <i className="bi bi-instagram"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="agent-info">
                  <h3 className="agent-name">{agent.name}</h3>
                  <span className="agent-title">{agent.role}</span>
                  <div className="agent-stats">
                    <div className="stat-item">
                      <i className="bi bi-award"></i>
                      <span>{agent.experience}</span>
                    </div>
                    <div className="stat-item">
                      <i className="bi bi-house-door"></i>
                      <span>{agent.properties} Bất động sản</span>
                    </div>
                    <div className="stat-item">
                      <i className="bi bi-star-fill"></i>
                      <span>{agent.rating} Đánh giá</span>
                    </div>
                  </div>
                  <div className="agent-contact">
                    <a href={`tel:${agent.phone}`} className="contact-btn">
                      <i className="bi bi-telephone"></i>
                      <span>{agent.phone}</span>
                    </a>
                    <a href={`mailto:${agent.email}`} className="contact-btn">
                      <i className="bi bi-envelope"></i>
                      <span>{agent.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agent; 