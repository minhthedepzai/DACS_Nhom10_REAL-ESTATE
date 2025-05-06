import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaHome, FaHouseUser, FaCity, FaWarehouse, FaStore, FaLandmark, FaIndustry } from 'react-icons/fa';

const PropertyType = () => {
  const propertyTypes = [
    { 
      icon: <FaBuilding />, 
      name: "Chung cư", 
      count: 123,
      color: "linear-gradient(135deg, #00B98E, #009975)"
    },
    { 
      icon: <FaHome />, 
      name: "Biệt thự", 
      count: 123,
      color: "linear-gradient(135deg, #00D9A6, #00B98E)"
    },
    { 
      icon: <FaHouseUser />, 
      name: "Nhà phố", 
      count: 123,
      color: "linear-gradient(135deg, #00B98E, #017e61)" 
    },
    { 
      icon: <FaLandmark />, 
      name: "Văn phòng", 
      count: 123,
      color: "linear-gradient(135deg, #00ccaa, #00B98E)"
    },
    { 
      icon: <FaCity />, 
      name: "Tòa nhà", 
      count: 123,
      color: "linear-gradient(135deg, #02e0a8, #00B98E)"
    },
    { 
      icon: <FaHome style={{transform: 'scaleX(-1)'}}/>, 
      name: "Nhà liền kề", 
      count: 123,
      color: "linear-gradient(135deg, #00B98E, #01d4a4)"
    },
    { 
      icon: <FaStore />, 
      name: "Cửa hàng", 
      count: 123,
      color: "linear-gradient(135deg, #00a583, #00B98E)"
    },
    { 
      icon: <FaIndustry />, 
      name: "Nhà xưởng", 
      count: 123,
      color: "linear-gradient(135deg, #00B98E, #008b6c)"
    }
  ];

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center mx-auto mb-4 mb-sm-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '800px' }}>
          <h1 className="mb-3 responsive-heading text-center" style={{ position: 'relative', paddingBottom: '15px' }}>Loại hình Bất động sản</h1>
          <div className="d-inline-block position-relative mb-4">
            <div style={{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '3px', backgroundColor: '#00B98E', borderRadius: '2px' }}></div>
          </div>
          <p className="responsive-text text-center">Khám phá đa dạng các loại hình bất động sản phù hợp với nhu cầu của bạn. Từ căn hộ chung cư hiện đại đến biệt thự sang trọng, chúng tôi có mọi lựa chọn để đáp ứng mong muốn của bạn.</p>
        </div>
        <div className="row g-3 g-sm-4 g-md-4">
          {propertyTypes.map((type, index) => (
            <div key={index} className="col-6 col-md-4 col-lg-3 wow fadeInUp" data-wow-delay={`${0.1 + (index % 4 * 0.1)}s`}>
              <Link to={`/properties?type=${type.name}`} className="cat-item d-block bg-light text-center rounded p-2 p-sm-3 shadow-sm">
                <div className="rounded p-3 p-sm-4">
                  <div className="icon-container mb-3 mb-sm-4" 
                    style={{ 
                      background: type.color,
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1), inset 0 -3px 0 rgba(0, 0, 0, 0.2)',
                      fontSize: '28px',
                      color: 'white',
                      transition: 'all 0.3s ease'
                    }}>
                    {type.icon}
                  </div>
                  <div className="property-type-info">
                    <h5 className="mb-2 property-type-title" style={{fontWeight: 'bold'}}>{type.name}</h5>
                    <p className="property-count mb-0" style={{color: '#666'}}>{type.count} Bất động sản</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyType;