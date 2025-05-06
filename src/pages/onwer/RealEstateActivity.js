import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RealEstateActivity = () => {
  const [activeTab, setActiveTab] = useState('viewed');

  const viewedProperties = [
    {
      id: 1,
      title: 'Căn hộ cao cấp Quận 1',
      price: '2.5 tỷ',
      area: '80m²',
      location: 'Quận 1, TP.HCM',
      viewedAt: '2024-03-15 14:30'
    },
    {
      id: 2,
      title: 'Nhà phố Thủ Đức',
      price: '5.8 tỷ',
      area: '120m²',
      location: 'Thủ Đức, TP.HCM',
      viewedAt: '2024-03-14 09:15'
    }
  ];

  const savedProperties = [
    {
      id: 1,
      title: 'Biệt thự Phú Mỹ Hưng',
      price: '12 tỷ',
      area: '200m²',
      location: 'Quận 7, TP.HCM',
      savedAt: '2024-03-13 16:45'
    }
  ];

  const chatHistory = [
    {
      id: 1,
      propertyTitle: 'Căn hộ cao cấp Quận 1',
      agentName: 'Nguyễn Văn A',
      lastMessage: 'Xin chào, tôi quan tâm đến căn hộ của bạn',
      lastMessageTime: '2024-03-15 15:20'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'viewed':
        return (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Bất động sản</th>
                  <th>Giá</th>
                  <th>Diện tích</th>
                  <th>Vị trí</th>
                  <th>Thời gian xem</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {viewedProperties.map(property => (
                  <tr key={property.id}>
                    <td>{property.title}</td>
                    <td>{property.price}</td>
                    <td>{property.area}</td>
                    <td>{property.location}</td>
                    <td>{property.viewedAt}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2">Xem chi tiết</button>
                      <button className="btn btn-sm btn-success">Lưu</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'saved':
        return (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Bất động sản</th>
                  <th>Giá</th>
                  <th>Diện tích</th>
                  <th>Vị trí</th>
                  <th>Thời gian lưu</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {savedProperties.map(property => (
                  <tr key={property.id}>
                    <td>{property.title}</td>
                    <td>{property.price}</td>
                    <td>{property.area}</td>
                    <td>{property.location}</td>
                    <td>{property.savedAt}</td>
                    <td>
                      <button className="btn btn-sm btn-primary me-2">Xem chi tiết</button>
                      <button className="btn btn-sm btn-danger">Bỏ lưu</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'chat':
        return (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Bất động sản</th>
                  <th>Môi giới</th>
                  <th>Tin nhắn cuối</th>
                  <th>Thời gian</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {chatHistory.map(chat => (
                  <tr key={chat.id}>
                    <td>{chat.propertyTitle}</td>
                    <td>{chat.agentName}</td>
                    <td>{chat.lastMessage}</td>
                    <td>{chat.lastMessageTime}</td>
                    <td>
                      <button className="btn btn-sm btn-primary">Mở chat</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ 
      margin: '-56px -1rem 0 -225px', 
      padding: '56px 0 0 225px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{ padding: '0.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Hoạt động gần đây</h5>
          </div>
          <div className="card-body">
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'viewed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('viewed')}
                >
                  Đã xem
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'saved' ? 'active' : ''}`}
                  onClick={() => setActiveTab('saved')}
                >
                  Đã lưu
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`}
                  onClick={() => setActiveTab('chat')}
                >
                  Đã chat
                </button>
              </li>
            </ul>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateActivity; 