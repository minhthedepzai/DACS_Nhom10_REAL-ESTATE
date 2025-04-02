import React from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyItem = ({ property }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="property-item rounded overflow-hidden">
      <div className="position-relative overflow-hidden">
        <a href=""><img className="img-fluid" src={`img/${property.image}`} alt="" /></a>
        <div className="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">{property.status}</div>
        <div className="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">{property.type}</div>
      </div>
      <div className="p-4 pb-0">
        <h5 className="text-primary mb-3">{property.price}</h5>
        <a className="d-block h5 mb-2" href="">{property.title}</a>
        <p><i className="fa fa-map-marker-alt text-primary me-2"></i>{property.location}</p>
      </div>
      <div className="d-flex border-top">
        <small className="flex-fill text-center border-end py-2"><i className="fa fa-ruler-combined text-primary me-2"></i>{property.area}</small>
        <small className="flex-fill text-center border-end py-2"><i className="fa fa-bed text-primary me-2"></i>{property.beds} Bed</small>
        <small className="flex-fill text-center py-2"><i className="fa fa-bath text-primary me-2"></i>{property.baths} Bath</small>
      </div>
    </div>
  );
};

export default PropertyItem;