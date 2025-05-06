import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Tabs, Tab, Badge } from 'react-bootstrap';
import { FaEye, FaHeart, FaComments } from 'react-icons/fa';
import axios from 'axios';
import './css/UserDashboard.css';

const UserDashboard = () => {
  const [viewedProperties, setViewedProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoints
        const [viewedRes, savedRes, chatRes] = await Promise.all([
          axios.get('/api/user/viewed-properties'),
          axios.get('/api/user/saved-properties'),
          axios.get('/api/user/chat-history')
        ]);

        setViewedProperties(viewedRes.data);
        setSavedProperties(savedRes.data);
        setChatHistory(chatRes.data);
      } catch (error) {
        console.error('Error fetching user activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivities();
  }, []);

  const PropertyCard = ({ property }) => (
    <Card className="mb-3 property-card">
      <Row className="no-gutters">
        <Col md={4}>
          <img
            src={property.imageUrl || '/placeholder-image.jpg'}
            alt={property.title}
            className="card-img"
          />
        </Col>
        <Col md={8}>
          <Card.Body>
            <Card.Title>{property.title}</Card.Title>
            <Card.Text>
              <small className="text-muted">
                {property.address}
              </small>
            </Card.Text>
            <Card.Text>
              <strong>Giá: {property.price}</strong>
            </Card.Text>
            <Link to={`/property/${property.id}`} className="btn btn-primary btn-sm">
              Xem chi tiết
            </Link>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );

  const ChatCard = ({ chat }) => (
    <Card className="mb-3 chat-card">
      <Card.Body>
        <div className="d-flex align-items-center">
          <img
            src={chat.otherUser.avatar || '/default-avatar.jpg'}
            alt={chat.otherUser.name}
            className="chat-avatar"
          />
          <div className="ms-3">
            <h6 className="mb-1">{chat.otherUser.name}</h6>
            <p className="mb-1 text-muted small">
              {chat.lastMessage.substring(0, 50)}...
            </p>
            <small className="text-muted">
              {new Date(chat.lastMessageTime).toLocaleDateString()}
            </small>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="user-dashboard">
      <h2 className="mb-4">Hoạt động gần đây</h2>
      
      <Tabs defaultActiveKey="viewed" className="mb-4">
        <Tab 
          eventKey="viewed" 
          title={
            <span>
              <FaEye className="me-2" />
              Đã xem
              <Badge bg="secondary" className="ms-2">{viewedProperties.length}</Badge>
            </span>
          }
        >
          <div className="tab-content-wrapper">
            {viewedProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </Tab>

        <Tab 
          eventKey="saved" 
          title={
            <span>
              <FaHeart className="me-2" />
              Đã lưu
              <Badge bg="secondary" className="ms-2">{savedProperties.length}</Badge>
            </span>
          }
        >
          <div className="tab-content-wrapper">
            {savedProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </Tab>

        <Tab 
          eventKey="chat" 
          title={
            <span>
              <FaComments className="me-2" />
              Tin nhắn
              <Badge bg="secondary" className="ms-2">{chatHistory.length}</Badge>
            </span>
          }
        >
          <div className="tab-content-wrapper">
            {chatHistory.map(chat => (
              <ChatCard key={chat.id} chat={chat} />
            ))}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default UserDashboard; 