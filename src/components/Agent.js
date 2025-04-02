import React, { useState, useEffect } from 'react';
import './css/Agent.css';
import Navbar from './Navbar';
import Footer from './Footer';
import './css/Navbar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
    <div className="container-xxl bg-white p-0">
      <Navbar />
      
      {/* Header */}
      <div className="container-fluid header bg-white p-0">
        <div className="row g-0 align-items-center">
          <div className="col-md-12 p-5 mt-lg-5">
            <div className="text-center">
              <h1 className="display-5 mb-4">Đội Ngũ Chuyên Viên Tư Vấn</h1>
              <p className="text-muted mb-4 pb-2">
                Với đội ngũ chuyên viên giàu kinh nghiệm, chúng tôi cam kết mang đến cho bạn những giải pháp bất động sản tốt nhất
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent List */}
      <div className="container py-5">
        <div className="row g-4">
          {agents.map((agent) => (
            <div key={agent.id} className="col-lg-4 col-md-6">
              <div className="agent-item rounded-3 overflow-hidden">
                <div className="position-relative overflow-hidden">
                  <img 
                    className="img-fluid w-100" 
                    src={agent.image} 
                    alt={agent.name}
                    style={{ height: "400px", objectFit: "cover" }}
                  />
                  <div className="agent-overlay">
                    <div className="d-flex align-items-center justify-content-center">
                      <a className="btn btn-light btn-square mx-1" href={agent.social.facebook}>
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a className="btn btn-light btn-square mx-1" href={agent.social.twitter}>
                        <i className="bi bi-twitter"></i>
                      </a>
                      <a className="btn btn-light btn-square mx-1" href={agent.social.instagram}>
                        <i className="bi bi-instagram"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="agent-content p-4">
                  <h5 className="text-primary mb-2">{agent.name}</h5>
                  <p className="text-muted mb-2">{agent.role}</p>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      <span>{agent.rating}/5.0</span>
                    </div>
                    <div>
                      <i className="bi bi-building me-1"></i>
                      <span>{agent.properties} BĐS</span>
                    </div>
                  </div>
                  <p className="mb-3">
                    <i className="bi bi-clock-history text-primary me-2"></i>
                    {agent.experience}
                  </p>
                  <div className="d-flex border-top pt-3">
                    <a href={`tel:${agent.phone}`} className="flex-fill text-center border-end py-2">
                      <i className="bi bi-telephone text-primary me-2"></i>
                      Gọi ngay
                    </a>
                    <a href={`mailto:${agent.email}`} className="flex-fill text-center py-2">
                      <i className="bi bi-envelope text-primary me-2"></i>
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Agent; 