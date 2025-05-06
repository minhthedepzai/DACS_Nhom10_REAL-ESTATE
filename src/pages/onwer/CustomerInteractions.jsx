import React, { useState } from 'react';
import { Card, Form, Button, ListGroup, Row, Col } from 'react-bootstrap';

const mockChats = [
  {
    id: 1,
    customer: 'Nguyễn Văn A',
    messages: [
      { from: 'customer', text: 'Xin chào, căn hộ này còn không ạ?' },
      { from: 'admin', text: 'Chào anh, căn hộ vẫn còn nhé!' },
    ],
  },
  {
    id: 2,
    customer: 'Trần Thị B',
    messages: [
      { from: 'customer', text: 'Giá còn thương lượng được không?' },
      { from: 'admin', text: 'Chị muốn trả mức giá khoảng bao nhiêu ạ?' },
    ],
  },
];

const CustomerInteractions = () => {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const updated = {
      ...selectedChat,
      messages: [...selectedChat.messages, { from: 'admin', text: newMessage }],
    };
    const newChats = mockChats.map(chat =>
      chat.id === updated.id ? updated : chat
    );
    setSelectedChat(updated);
    setNewMessage('');
  };

  return (
    <Row className="p-4">
      <Col md={4}>
        <Card className="mb-4 shadow-sm">
          <Card.Header><strong>Khách hàng</strong></Card.Header>
          <ListGroup variant="flush">
            {mockChats.map(chat => (
              <ListGroup.Item
                key={chat.id}
                action
                active={chat.id === selectedChat.id}
                onClick={() => setSelectedChat(chat)}
              >
                {chat.customer}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      </Col>

      <Col md={8}>
        <Card className="shadow-sm">
          <Card.Header>
            <strong>Trò chuyện với: </strong>{selectedChat.customer}
          </Card.Header>
          <Card.Body style={{ height: '400px', overflowY: 'auto' }}>
            {selectedChat.messages.map((msg, index) => (
              <div key={index} className={`mb-3 ${msg.from === 'admin' ? 'text-end' : 'text-start'}`}>
                <div
                  className={`d-inline-block p-2 rounded ${
                    msg.from === 'admin' ? 'bg-primary text-white' : 'bg-light'
                  }`}
                  style={{ maxWidth: '80%' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </Card.Body>
          <Card.Footer>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Row className="g-2 align-items-center">
                <Col xs={9}>
                  <Form.Control
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                  />
                </Col>
                <Col xs={3}>
                  <Button type="submit" variant="primary" className="w-100">
                    Gửi
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Footer>
        </Card>
      </Col>

      <style jsx="true">{`
        .card-header {
          background-color: #f8f9fa;
          font-weight: 600;
        }
      `}</style>
    </Row>
  );
};

export default CustomerInteractions;
