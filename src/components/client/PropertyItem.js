import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './css/PropertyItem.css';
import { FaHeart } from 'react-icons/fa';

const PropertyItem = ({ property }) => {
  const history = useHistory();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Kiểm tra xem bất động sản đã được yêu thích chưa khi component được render
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.some(fav => fav.id === property.id));
  }, [property.id]);

  const handleClick = () => {
    history.push(`/property/${property.id}`);
  };

  // Xử lý sự kiện khi bấm vào icon tim
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan sang parent
    
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (isFavorite) {
      // Nếu đã yêu thích, xóa khỏi danh sách
      const newFavorites = favorites.filter(fav => fav.id !== property.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      // Nếu chưa yêu thích, thêm vào danh sách
      favorites.push(property);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    // Xóa tất cả các ký tự không phải số (khoảng trắng, đơn vị tiền, dấu phẩy, v.v.)
    const numericPrice = parseFloat(price.toString().replace(/[^\d]/g, ''));
    
    if (isNaN(numericPrice)) return price;
    
    if (numericPrice >= 1000000000) {
      // Giá từ 1 tỷ trở lên
      const billions = numericPrice / 1000000000;
      return billions % 1 === 0 
        ? `${billions} tỷ` 
        : `${billions.toFixed(1).replace(/\.0$/, '')} tỷ`;
    } else if (numericPrice >= 1000000) {
      // Giá từ 1 triệu đến dưới 1 tỷ
      const millions = numericPrice / 1000000;
      return millions % 1 === 0 
        ? `${millions} triệu` 
        : `${millions.toFixed(1).replace(/\.0$/, '')} triệu`;
    } else if (numericPrice >= 1000) {
      // Giá từ 1 nghìn đến dưới 1 triệu
      const thousands = numericPrice / 1000;
      return `${thousands} nghìn`;
    }
    
    return price; // Trả về giá ban đầu nếu không khớp các trường hợp trên
  };

  return (
    <div className="property-item rounded overflow-hidden">
      <div className="position-relative overflow-hidden">
        <img 
          className="img-fluid" 
          src={property.featuredImage} 
          alt={property.title}
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        />
        <div className="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">
          {property.status}
        </div>
        <div className="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">
          {property.type}
        </div>
        {/* Thêm nút tim yêu thích */}
        <div 
          className={`favorite-btn position-absolute end-0 top-0 m-4 p-2 rounded-circle ${isFavorite ? 'favorite-active' : ''}`}
          onClick={handleFavoriteClick}
        >
          <FaHeart />
        </div>
      </div>
      <div className="p-4 pb-0 d-flex flex-column align-items-start">
        <h5 className="text-primary price-tag">
          {formatPrice(property.price)}
          {property.status === 'Cho thuê' ? '/tháng' : ''}
        </h5>
        <h4 
          className="property-title" 
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
        >
          {property.title}
        </h4>
        <p className="text-muted">
          <i className="fa fa-map-marker-alt text-primary me-2"></i>
          <span>{property.location}</span>
        </p>
      </div>
      <div className="d-flex border-top">
        <small className="flex-fill text-start ps-4 border-end py-2">
          <i className="fa fa-ruler-combined text-primary me-2"></i>
          {property.area}
        </small>
        <small className="flex-fill text-start ps-4 border-end py-2">
          <i className="fa fa-bed text-primary me-2"></i>
          {property.bedrooms} PN
        </small>
        <small className="flex-fill text-start ps-4 py-2">
          <i className="fa fa-bath text-primary me-2"></i>
          {property.bathrooms} PT
        </small>
      </div>
    </div>
  );
};

export default PropertyItem;