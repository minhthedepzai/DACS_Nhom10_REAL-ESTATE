import React, { useState, useEffect } from 'react';
import { Container, Button, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsHouseDoor, BsTrash, BsEye } from 'react-icons/bs';
import { FaRulerCombined, FaMapMarkerAlt, FaBed, FaBath, FaRegClock } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import '../css/Profile.css';

const ViewedProperties = () => {
  const [viewedProperties, setViewedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedProperties = localStorage.getItem('viewedProperties');
    if (storedProperties) {
      try {
        const parsedProperties = JSON.parse(storedProperties);
        setViewedProperties(parsedProperties);
      } catch (error) {
        console.error('Lỗi khi parse dữ liệu từ localStorage:', error);
      }
    }
    setLoading(false);
  }, []);

  const removeProperty = (id) => {
    const updatedProperties = viewedProperties.filter(property => property.id !== id);
    setViewedProperties(updatedProperties);
    localStorage.setItem('viewedProperties', JSON.stringify(updatedProperties));
  };

  const clearAllProperties = () => {
    setViewedProperties([]);
    localStorage.removeItem('viewedProperties');
  };

  // Format giá tiền
  const formatPrice = (price) => {
    if (!price) return "Liên hệ";
    return price.toLocaleString('vi-VN') + ' VNĐ';
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="viewed-properties">
      <div className="viewed-properties-header d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0 fw-bold"></h3>
        {viewedProperties.length > 0 && (
          <Button 
            variant="outline-danger" 
            size="sm" 
            onClick={clearAllProperties}
            className="rounded-pill px-3"
          >
            <BsTrash className="me-1" /> Xóa tất cả
          </Button>
        )}
      </div>

      {viewedProperties.length === 0 ? (
        <Alert variant="info" className="viewed-empty text-center py-5">
          <BsHouseDoor size={50} className="mb-3 text-secondary" />
          <h5>Bạn chưa xem bất kỳ bài đăng nào</h5>
          <p className="mb-3">Các bài đăng bạn xem sẽ xuất hiện ở đây để tiện theo dõi</p>
          <Link to="/properties">
            <Button variant="primary" className="rounded-pill px-4">
              Tìm bất động sản ngay
            </Button>
          </Link>
        </Alert>
      ) : (
        <div className="viewed-properties-table-container">
          <Table responsive hover className="viewed-properties-table">
            <thead>
              <tr>
                <th width="30%">Tên bất động sản</th>
                <th width="15%">Loại</th>
                <th width="15%">Giá</th>
                <th width="15%">Thông tin</th>
                <th width="15%">Thời gian xem</th>
                <th width="10%">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {viewedProperties.map(property => (
                <tr key={property.id} className="viewed-property-row">
                  <td>
                    <div className="property-title-col">
                      <Link to={`/properties/${property.id}`} className="property-title-link fw-semibold text-truncate">
                        {property.title.length > 50 ? property.title.substring(0, 50) + "..." : property.title}
                      </Link>
                      <div className="small text-muted text-truncate">
                        <FaMapMarkerAlt className="me-1" size={12} /> {property.address}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="property-type-badge">
                      {property.propertyType}
                    </span>
                    <div className="small text-muted mt-1">
                      {property.saleType}
                    </div>
                  </td>
                  <td className="fw-bold text-primary">
                    {formatPrice(property.price)}
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-1">
                      <div className="property-feature small">
                        <FaRulerCombined className="me-1" /> {property.area} m²
                      </div>
                      <div className="property-feature small">
                        <FaBed className="me-1" /> {property.bedrooms} PN
                      </div>
                      <div className="property-feature small">
                        <FaBath className="me-1" /> {property.bathrooms} PT
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="viewed-time">
                      <FaRegClock className="me-1" />
                      <span className="small">
                        {formatDistanceToNow(new Date(property.viewedAt), { addSuffix: true, locale: vi })}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/properties/${property.id}`} 
                        className="btn btn-sm btn-outline-primary me-2" 
                        title="Xem chi tiết"
                      >
                        <BsEye />
                      </Link>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => removeProperty(property.id)}
                        title="Xóa"
                      >
                        <BsTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default ViewedProperties; 