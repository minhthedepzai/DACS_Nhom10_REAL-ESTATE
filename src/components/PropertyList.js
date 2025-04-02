import React, { useState } from 'react';
import PropertyItem from './PropertyItem';

const PropertyList = () => {
  const [activeTab, setActiveTab] = useState('tab-1');

  const properties = [
    {
      id: 1,
      image: "/img/PHD_Living_Dining_k7o1fs.webp",
      status: "For Sell",
      type: "Appartment",
      price: "$12,345",
      title: "Golden Urban House For Sell",
      location: "123 Street, New York, USA",
      area: "1000 Sqft",
      beds: 3,
      baths: 2
    },
    {
      id: 2,
      image: "property-2.jpg",
      status: "For Rent",
      type: "Villa",
      price: "$12,345",
      title: "Golden Urban House For Sell",
      location: "123 Street, New York, USA",
      area: "1000 Sqft",
      beds: 3,
      baths: 2
    },
    {
      id: 3,
      image: "property-3.jpg",
      status: "For Sell",
      type: "Office",
      price: "$12,345",
      title: "Golden Urban House For Sell",
      location: "123 Street, New York, USA",
      area: "1000 Sqft",
      beds: 3,
      baths: 2
    },
    {
      id: 4,
      image: "property-4.jpg",
      status: "For Rent",
      type: "Building",
      price: "$12,345",
      title: "Golden Urban House For Sell",
      location: "123 Street, New York, USA",
      area: "1000 Sqft",
      beds: 3,
      baths: 2
    },
    {
      id: 5,
      image: "property-5.jpg",
      status: "For Sell",
      type: "Home",
      price: "$12,345",
      title: "Golden Urban House For Sell",
      location: "123 Street, New York, USA",
      area: "1000 Sqft",
      beds: 3,
      baths: 2
    },
    {
      id: 6,
      image: "property-6.jpg",
      status: "For Rent",
      type: "Shop",
      price: "$12,345",
      title: "Golden Urban House For Sell",
      location: "123 Street, New York, USA",
      area: "1000 Sqft",
      beds: 3,
      baths: 2
    }
  ];

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="row g-0 gx-5 align-items-end">
          <div className="col-lg-6">
            <div className="text-start mx-auto mb-5 wow slideInLeft" data-wow-delay="0.1s">
              <h1 className="mb-3">Property Listing</h1>
              <p>Eirmod sed ipsum dolor sit rebum labore magna erat. Tempor ut dolore lorem kasd vero ipsum sit eirmod sit diam justo sed rebum.</p>
            </div>
          </div>
          <div className="col-lg-6 text-start text-lg-end wow slideInRight" data-wow-delay="0.1s">
            <ul className="nav nav-pills d-inline-flex justify-content-end mb-5">
              <li className="nav-item me-2">
                <a
                  className={`btn btn-outline-primary ${activeTab === 'tab-1' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tab-1')}
                  href="#tab-1"
                >
                  Featured
                </a>
              </li>
              <li className="nav-item me-2">
                <a
                  className={`btn btn-outline-primary ${activeTab === 'tab-2' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tab-2')}
                  href="#tab-2"
                >
                  For Sell
                </a>
              </li>
              <li className="nav-item me-0">
                <a
                  className={`btn btn-outline-primary ${activeTab === 'tab-3' ? 'active' : ''}`}
                  onClick={() => setActiveTab('tab-3')}
                  href="#tab-3"
                >
                  For Rent
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="tab-content">
          <div id="tab-1" className={`tab-pane fade ${activeTab === 'tab-1' ? 'show active' : ''} p-0`}>
            <div className="row g-4">
              {properties.map(property => (
                <div key={property.id} className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay={`${0.1 + ((property.id - 1) % 3) * 0.2}s`}>
                  <PropertyItem property={property} />
                </div>
              ))}
              <div className="col-12 text-center wow fadeInUp" data-wow-delay="0.1s">
                <a className="btn btn-primary py-3 px-5" href="">Browse More Property</a>
              </div>
            </div>
          </div>
          {/* Các tab khác tương tự */}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;