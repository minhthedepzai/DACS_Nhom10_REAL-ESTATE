import React from 'react';
import './css/HomeImages.css';

const HomeImages = () => {
  // Cách 1: Sử dụng ảnh từ public/images
  const publicImages = [
    {
      id: 1,
      src: '/img/LXVilla.jpg',
      alt: 'Beautiful House 1',
      title: 'Luxury Villa'
    },
    {
      id: 2,
      src: '/img/Modern Apartment.jpg',
      alt: 'Beautiful House 2',
      title: 'Modern Apartment'
    },
    {
      id: 3,
      src: '/img/Cozy Home.jpg',
      alt: 'Beautiful House 3',
      title: 'Cozy Home'
    }
  ];

  return (
    <div className="home-images">
      <div className="container">
        <div className="row g-4">
          {publicImages.map((image) => (
            <div key={image.id} className="col-md-4">
              <div className="image-card">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="img-fluid rounded"
                />
                <div className="image-overlay">
                  <h3>{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeImages; 