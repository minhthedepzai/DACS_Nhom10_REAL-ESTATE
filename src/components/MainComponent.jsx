import React, { useState, useEffect } from 'react';
import './css/style.css';
import { Link } from 'react-router-dom';
import HomeImages from './HomeImages';
import Navbar from './Navbar';
import Footer from './Footer';

const MainComponent = () => {
  // States
  const [showSpinner, setShowSpinner] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Spinner effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // WOW.js initialization
  useEffect(() => {
    try {
      const WOW = require('wowjs');
      const wow = new WOW.WOW({
        live: false
      });
      wow.init();
    } catch (error) {
      console.log('WOW.js initialization error:', error);
    }
  }, []);

  // Load favorite properties
  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavoriteCount(favorites.length);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Scroll effects (sticky navbar and back to top button)
  useEffect(() => {
    const handleScroll = () => {
      // Sticky navbar
      if (window.scrollY > 45) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      // Back to top button
      if (window.scrollY > 300) {
        setIsBackToTopVisible(true);
      } else {
        setIsBackToTopVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Back to top handler
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const testimonials = [
    {
      id: 1,
      content: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd erat eos",
      name: "Client Name",
      profession: "Profession"
    },
    {
      id: 2,
      content: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd erat eos",
      name: "Client Name",
      profession: "Profession" 
    },
    {
      id: 3,
      content: "Tempor stet labore dolor clita stet diam amet ipsum dolor duo ipsum rebum stet dolor amet diam stet. Est stet ea lorem amet est kasd kasd erat eos",
      name: "Client Name",
      profession: "Profession"
    }
  ];

  // Dữ liệu mẫu cho property types
  const propertyTypes = [
    { id: 1, name: 'Apartment', count: 123, icon: 'bi bi-building' },
    { id: 2, name: 'Villa', count: 123, icon: 'bi bi-house' },
    { id: 3, name: 'Home', count: 123, icon: 'bi bi-house-door' },
    { id: 4, name: 'Office', count: 123, icon: 'bi bi-shop' },
    { id: 5, name: 'Building', count: 123, icon: 'bi bi-building-fill' },
    { id: 6, name: 'Townhouse', count: 123, icon: 'bi bi-houses' }
  ];

  // Dữ liệu mẫu cho property listings
  const properties = [
    { 
      id: 1, 
      title: 'Beautiful Apartment',
      location: 'New York, USA',
      price: '$12,345',
      area: '1000 sqft',
      beds: 3,
      baths: 2,
      image: '/img/NY.jpg'
    },
    { 
      id: 2, 
      title: 'Luxury Villa',
      location: 'Los Angeles, USA',
      price: '$23,456',
      area: '2000 sqft',
      beds: 4,
      baths: 3,
      image: '/img/42_01.jpg'
    },
    { 
      id: 3, 
      title: 'Modern Office',
      location: 'Chicago, USA',
      price: '$34,567',
      area: '3000 sqft',
      beds: 0,
      baths: 2,
      image: '/img/modern office space design.jpeg'
    }
  ];

  return (
    <div className="container-xxl bg-white p-0">
      {/* Spinner */}
      {showSpinner && (
        <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {/* Navbar with sticky effect */}
      <Navbar />

      {/* Main content - Everything below navbar should be inside this div */}
      <div className="main-content">
        {/* Header with carousel */}
        <div className="container-fluid header bg-white p-0">
          <div className="row g-0 align-items-center flex-column-reverse flex-md-row">
            <div className="col-md-6 p-5 mt-lg-5">
              <h1 className="display-5 animated fadeIn mb-4">Find A <span className="text-primary">Perfect Home</span> To Live With Your Family</h1>
              <p className="animated fadeIn mb-4 pb-2">Vero elitr justo clita lorem. Ipsum dolor at sed stet
                sit diam no. Kasd rebum ipsum et diam justo clita et kasd rebum sea elitr.</p>
              <button onClick={() => console.log('Get Started clicked')} className="btn btn-primary py-3 px-5 me-3 animated fadeIn">Get Started</button>
            </div>
            <div className="col-md-6 animated fadeIn">
              <div className="position-relative overflow-hidden" style={{ height: "100%" }}>
                <img 
                  src="/img/LXVilla.jpg"
                  alt="Luxury Villa"
                  className="img-fluid w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{ background: "rgba(0,0,0,.1)" }}>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Home Images Section */}
        <HomeImages />

        {/* Search */}
        <div className="container-fluid bg-primary mb-5 wow fadeIn" data-wow-delay="0.1s" style={{ padding: '35px' }}>
          <div className="container">
            <div className="row g-2">
              <div className="col-md-10">
                <div className="row g-2">
                  <div className="col-md-4">
                    <select className="form-select border-0 py-3">
                      <option>Property Type</option>
                      <option value="1">Property Type 1</option>
                      <option value="2">Property Type 2</option>
                      <option value="3">Property Type 3</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select border-0 py-3">
                      <option>Location</option>
                      <option value="1">Location 1</option>
                      <option value="2">Location 2</option>
                      <option value="3">Location 3</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select border-0 py-3">
                      <option>Property Type</option>
                      <option value="1">Type 1</option>
                      <option value="2">Type 2</option>
                      <option value="3">Type 3</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-md-2">
                <button className="btn btn-dark border-0 w-100 py-3">Search</button>
              </div>
            </div>
          </div>
        </div>

        {/* Property Types */}
        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
              <h1 className="mb-3">Property Types</h1>
              <p>Eirmod sed ipsum dolor sit rebum labore magna erat. Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero dolor duo.</p>
            </div>
            <div className="row g-4">
              {propertyTypes.map(type => (
                <div key={type.id} className="col-lg-4 col-sm-6 wow fadeInUp" data-wow-delay={`0.${type.id}s`}>
                  <Link to={`/property-type/${type.id}`} className="cat-item d-block bg-light text-center rounded p-3">
                    <div className="rounded p-4">
                      <div className="icon mb-3">
                        <i className={`${type.icon} fs-1 text-primary`}></i>
                      </div>
                      <h6>{type.name}</h6>
                      <span>{type.count} Properties</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Property Listing */}
        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
              <h1 className="mb-3">Property Listing</h1>
              <p>Eirmod sed ipsum dolor sit rebum labore magna erat. Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero dolor duo.</p>
            </div>
            <div className="row g-4">
              {properties.map(property => (
                <div key={property.id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={`0.${property.id}s`}>
                  <div className="property-item rounded overflow-hidden">
                    <div className="position-relative overflow-hidden">
                      <img 
                        src={property.image}
                        alt={property.title}
                        className="img-fluid w-100"
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                      <div className="bg-primary px-3 py-1 text-white position-absolute end-0 top-0 mt-3 me-3">
                        {property.price}
                      </div>
                    </div>
                    <div className="p-4 pb-0">
                      <h5 className="text-primary mb-3">{property.price}</h5>
                      <Link to={`/property/${property.id}`} className="d-block h5 mb-2">{property.title}</Link>
                      <p><i className="bi bi-geo-alt text-primary me-2"></i>{property.location}</p>
                    </div>
                    <div className="d-flex border-top">
                      <small className="flex-fill text-center border-end py-2">
                        <i className="bi bi-ruler text-primary me-2"></i>{property.area}
                      </small>
                      <small className="flex-fill text-center border-end py-2">
                        <i className="bi bi-bed text-primary me-2"></i>{property.beds} Bed
                      </small>
                      <small className="flex-fill text-center py-2">
                        <i className="bi bi-water text-primary me-2"></i>{property.baths} Bath
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial section */}
        <div className="container-xxl py-5">
          <div className="container">
            <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
              <h1 className="mb-3">Our Clients Say!</h1>
              <p>Eirmod sed ipsum dolor sit rebum labore magna erat. Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero dolor duo.</p>
            </div>
            
            <div className="row g-4">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="col-lg-4 wow fadeInUp" data-wow-delay={`0.${testimonial.id}s`}>
                  <div className="testimonial-item bg-light rounded p-3">
                    <div className="bg-white border rounded p-4">
                      <p>{testimonial.content}</p>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                          <i className="bi bi-person-fill text-white"></i>
                        </div>
                        <div className="ps-3">
                          <h6 className="fw-bold mb-1">{testimonial.name}</h6>
                          <small>{testimonial.profession}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      <button 
        className={`btn btn-lg btn-primary btn-lg-square back-to-top ${isBackToTopVisible ? 'd-flex' : 'd-none'}`}
        onClick={scrollToTop}
      >
        <i className="bi bi-arrow-up"></i>
      </button>
    </div>
  );
};

export default MainComponent;