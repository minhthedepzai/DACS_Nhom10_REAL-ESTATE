import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './css/NotFound.css';

const NotFound = () => {
  const [loaded, setLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const buildingRef = useRef(null);
  const cloudsRef = useRef(null);
  const particlesRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Hiệu ứng hiển thị
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);

    // Theo dõi vị trí chuột
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Tính toán vị trí tương đối so với trung tâm, chuẩn hóa -1 đến 1
      const relativeX = (e.clientX - centerX) / centerX;
      const relativeY = (e.clientY - centerY) / centerY;
      
      setMousePosition({ x: relativeX, y: relativeY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Bắt đầu vòng lặp animation
    const animateScene = () => {
      if (buildingRef.current && cloudsRef.current && particlesRef.current) {
        // Hiệu ứng 3D dựa trên vị trí chuột
        const rotateX = mousePosition.y * 10; // -10 đến 10 độ
        const rotateY = mousePosition.x * 15; // -15 đến 15 độ
        
        // Cập nhật transform cho tòa nhà
        buildingRef.current.style.transform = `
          perspective(1200px) 
          rotateX(${10 - rotateX}deg) 
          rotateY(${15 + rotateY}deg)
        `;
        
        // Hiệu ứng parallax cho mây
        cloudsRef.current.style.transform = `translateZ(-50px) translateX(${-mousePosition.x * 30}px) translateY(${-mousePosition.y * 30}px)`;
        
        // Hiệu ứng parallax cho particles
        particlesRef.current.style.transform = `translateX(${mousePosition.x * 20}px) translateY(${mousePosition.y * 20}px)`;
      }
      
      animationRef.current = requestAnimationFrame(animateScene);
    };
    
    animateScene();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition]);

  // Tạo particles
  const renderParticles = () => {
    const particles = [];
    for (let i = 1; i <= 15; i++) {
      particles.push(<div key={i} className={`particle particle-${i}`}></div>);
    }
    return particles;
  };

  return (
    <div className={`notfound-container ${loaded ? 'loaded' : ''}`}>
      <div className="scene-3d">
        <div className="floating-clouds" ref={cloudsRef}>
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          <div className="cloud cloud-4"></div>
        </div>
        
        <div className="birds">
          <div className="bird bird-1"></div>
          <div className="bird bird-2"></div>
          <div className="bird bird-3"></div>
        </div>
        
        <div className="trees">
          <div className="tree tree-1"></div>
          <div className="tree tree-2"></div>
        </div>
        
        <div className="notfound-particles" ref={particlesRef}>
          {renderParticles()}
        </div>
      </div>
      
      <div className="notfound-content">
        <div className="notfound-text">
          <h1 className="notfound-404">404</h1>
          <h2 className="notfound-title">Trang không tìm thấy</h2>
          <p className="notfound-description">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          <Link to="/" className="notfound-button">
            Quay lại trang chủ
            <span className="button-icon"><FaHome /></span>
          </Link>
        </div>
        
        <div className="notfound-animation">
          <div className="building-3d" ref={buildingRef}>
            <div className="building-roof"></div>
            <div className="building-body">
              <div className="building-window">
                <div className="window-glass"></div>
              </div>
              <div className="building-window">
                <div className="window-glass"></div>
              </div>
              <div className="building-window">
                <div className="window-glass"></div>
              </div>
              <div className="building-window">
                <div className="window-glass"></div>
              </div>
              <div className="building-door">
                <div className="door-knob"></div>
              </div>
            </div>
            <div className="building-shadow"></div>
            <div className="ground"></div>
          </div>
        </div>
      </div>
      
      <div className="notfound-text-overlay">404</div>
    </div>
  );
};

export default NotFound; 