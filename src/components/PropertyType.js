import React from 'react';

const PropertyType = () => {
  const propertyTypes = [
    { icon: "icon-apartment.png", name: "Apartment", count: 123 },
    { icon: "icon-villa.png", name: "Villa", count: 123 },
    { icon: "icon-house.png", name: "Home", count: 123 },
    { icon: "icon-housing.png", name: "Office", count: 123 },
    { icon: "icon-building.png", name: "Building", count: 123 },
    { icon: "icon-neighborhood.png", name: "Townhouse", count: 123 },
    { icon: "icon-condominium.png", name: "Shop", count: 123 },
    { icon: "icon-luxury.png", name: "Garage", count: 123 }
  ];

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '600px' }}>
          <h1 className="mb-3">Property Types</h1>
          <p>Eirmod sed ipsum dolor sit rebum labore magna erat. Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero dolor duo.</p>
        </div>
        <div className="row g-4">
          {propertyTypes.map((type, index) => (
            <div key={index} className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay={`${0.1 + (index * 0.2)}s`}>
              <a className="cat-item d-block bg-light text-center rounded p-3" href="">
                <div className="rounded p-4">
                  <div className="icon mb-3">
                    <img className="img-fluid" src={`img/${type.icon}`} alt="Icon" />
                  </div>
                  <h6>{type.name}</h6>
                  <span>{type.count} Properties</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyType;