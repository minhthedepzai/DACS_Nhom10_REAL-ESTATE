import React, { useState } from 'react';
import { Card, Button, Form, InputGroup, Row, Col, Badge } from 'react-bootstrap';
import { BsStarFill, BsStar } from 'react-icons/bs';

const mockFeedbacks = [
  {
    id: 1,
    name: 'Trần Minh',
    rating: 5,
    comment: 'Nhà rất đẹp, chủ thân thiện!',
    date: '2024-12-15',
    replied: true,
  },
  {
    id: 2,
    name: 'Ngọc Linh',
    rating: 4,
    comment: 'Vị trí ổn, giá tốt.',
    date: '2025-01-10',
    replied: false,
  },
  {
    id: 3,
    name: 'Vũ Tuấn',
    rating: 3,
    comment: 'Dịch vụ hỗ trợ chưa nhanh lắm.',
    date: '2025-03-22',
    replied: false,
  },
];

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState(mockFeedbacks);
  const [filter, setFilter] = useState('all');
  const [replyContent, setReplyContent] = useState({});
  const [replyMode, setReplyMode] = useState(null);

  const filteredFeedbacks = feedbacks.filter(fb => {
    if (filter === 'all') return true;
    return filter === 'replied' ? fb.replied : !fb.replied;
  });

  const handleReply = (id) => {
    setFeedbacks(prev =>
      prev.map(fb =>
        fb.id === id ? { ...fb, replied: true } : fb
      )
    );
    setReplyMode(null);
    setReplyContent(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className=" p-4">
      <h3 className="mb-4">Quản lý phản hồi từ khách hàng</h3>

      {/* Filter */}
      <div className="mb-4">
        <Form.Select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: '250px' }}>
          <option value="all">Tất cả phản hồi</option>
          <option value="unreplied">Chưa phản hồi</option>
          <option value="replied">Đã phản hồi</option>
        </Form.Select>
      </div>

      {filteredFeedbacks.length === 0 ? (
        <p className="text-muted">Không có phản hồi nào phù hợp.</p>
      ) : (
        filteredFeedbacks.map(fb => (
          <Card key={fb.id} className="mb-3 shadow-sm">
            <Card.Body>
              <Row>
                <Col md={8}>
                  <h5>{fb.name}</h5>
                  <div className="mb-2">
                    {[...Array(5)].map((_, i) =>
                      i < fb.rating ? (
                        <BsStarFill key={i} color="#ffc107" />
                      ) : (
                        <BsStar key={i} color="#ccc" />
                      )
                    )}
                    <span className="ms-2 text-muted small">({fb.date})</span>
                  </div>
                  <p>{fb.comment}</p>
                  {fb.replied ? (
                    <Badge bg="success">Đã phản hồi</Badge>
                  ) : (
                    <Badge bg="warning" text="dark">Chưa phản hồi</Badge>
                  )}
                </Col>
                <Col md={4} className="text-end">
                  {!fb.replied && (
                    <>
                      {replyMode === fb.id ? (
                        <>
                          <Form.Group className="mb-2">
                            <Form.Control
                              as="textarea"
                              rows={2}
                              placeholder="Phản hồi khách hàng..."
                              value={replyContent[fb.id] || ''}
                              onChange={(e) =>
                                setReplyContent({
                                  ...replyContent,
                                  [fb.id]: e.target.value,
                                })
                              }
                            />
                          </Form.Group>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleReply(fb.id)}
                            disabled={!replyContent[fb.id]?.trim()}
                          >
                            Gửi phản hồi
                          </Button>{' '}
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setReplyMode(null)}
                          >
                            Hủy
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setReplyMode(fb.id)}
                        >
                          Trả lời
                        </Button>
                      )}
                    </>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}

      <style jsx="true">{`
        .card-body h5 {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default FeedbackManagement;
