import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaDove, FaTwitter } from 'react-icons/fa';
import './css/NotFound.css';

const NotFound = () => {
  const [loaded, setLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const cloudsRef = useRef(null);
  const particlesRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const relativeX = (e.clientX - rect.left - centerX) / centerX;
        const relativeY = (e.clientY - rect.top - centerY) / centerY;
        
        setMousePosition({ x: relativeX, y: relativeY });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const animateScene = () => {
      if (cloudsRef.current && particlesRef.current) {
        // Clouds parallax effect
        cloudsRef.current.style.transform = `
          translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)
        `;
        
        // Particles movement
        particlesRef.current.style.transform = `
          translate(${mousePosition.x * -5}px, ${mousePosition.y * -5}px)
        `;
      }
      
      animationRef.current = requestAnimationFrame(animateScene);
    };
    
    animateScene();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition]);

  // Tạo các phần tử đồ họa cho animation
  const createParticles = () => {
    const particles = [];
    for (let i = 1; i <= 15; i++) {
      particles.push(<div key={i} className={`particle particle-${i}`}></div>);
    }
    return particles;
  };

  return (
    <div ref={containerRef} className={`notfound-container ${loaded ? 'loaded' : ''}`}>
      <div className="scene-3d">
        <div ref={cloudsRef} className="floating-clouds">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          <div className="cloud cloud-4"></div>
        </div>
        
        <div className="birds">
          <FaTwitter className="bird bird-1" />
          <FaDove className="bird bird-2" />
          <FaTwitter className="bird bird-3" />
        </div>
        
        <div ref={particlesRef} className="notfound-particles">
          {createParticles()}
        </div>
      </div>
      
      <div className="notfound-content">
        <div className="notfound-text">
          <h1 className="notfound-404">404</h1>
          <h2 className="notfound-title">Trang không tìm thấy</h2>
          <p className="notfound-description">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Vui lòng kiểm tra lại URL hoặc quay về trang chủ.
          </p>
          <Link to="/" className="notfound-button">
            Về trang chủ
            <span className="button-icon"><FaHome /></span>
          </Link>
        </div>
      </div>
      
      <div className="trees">
        <div className="tree tree-1"></div>
        <div className="tree tree-2"></div>
      </div>
      
      <div className="notfound-text-overlay">404</div>
    </div>
  );
};

export default NotFound; 