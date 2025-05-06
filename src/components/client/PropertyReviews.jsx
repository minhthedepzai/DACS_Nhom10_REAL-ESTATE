import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { BsStarFill, BsStar } from 'react-icons/bs';

const PropertyReviews = ({ reviews = [], onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') return;

    const newReview = {
      id: Date.now(),
      rating,
      comment,
      author: 'Người dùng ẩn danh',
      createdAt: new Date().toLocaleDateString(),
    };

    onSubmit(newReview);
    setRating(0);
    setComment('');
  };

  return (
    <div className="property-reviews mt-5">
      <h4 className="mb-3">Đánh giá & Bình luận</h4>

      {/* Đánh giá trung bình */}
      <div className="mb-4">
        <strong>Đánh giá trung bình:</strong>{' '}
        {[...Array(5)].map((_, i) => (
          <BsStarFill
            key={i}
            color={i < Math.round(averageRating) ? '#ffc107' : '#e4e5e9'}
          />
        ))}{' '}
        <span className="text-muted">({reviews.length} đánh giá)</span>
      </div>

      {/* Danh sách bình luận */}
      {reviews.length === 0 ? (
        <p className="text-muted">Chưa có đánh giá nào.</p>
      ) : (
        reviews.map((review) => (
          <Card key={review.id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>{review.author}</strong>
                <span className="text-muted small">{review.createdAt}</span>
              </div>
              <div className="mb-2">
                {[...Array(5)].map((_, i) => (
                  <BsStarFill
                    key={i}
                    color={i < review.rating ? '#ffc107' : '#e4e5e9'}
                    size={16}
                  />
                ))}
              </div>
              <p className="mb-0">{review.comment}</p>
            </Card.Body>
          </Card>
        ))
      )}

      {/* Gửi bình luận mới */}
      <Card className="mt-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Chọn đánh giá:</Form.Label>
              <div className="star-rating">
                {[...Array(5)].map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <span
                      key={i}
                      style={{
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        marginRight: '5px',
                      }}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoveredStar(starValue)}
                      onMouseLeave={() => setHoveredStar(0)}
                    >
                      {starValue <= (hoveredStar || rating) ? (
                        <BsStarFill color="#ffc107" />
                      ) : (
                        <BsStar color="#ccc" />
                      )}
                    </span>
                  );
                })}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Bình luận của bạn:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Viết bình luận tại đây..."
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={rating === 0 || comment.trim() === ''}>
              Gửi đánh giá
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Inline CSS - hoặc bạn có thể tách ra file riêng */}
      <style jsx="true">{`
        .property-reviews {
          background: #fdfdfd;
          padding: 20px;
          border-radius: 10px;
        }

        .property-reviews h4 {
          font-weight: 600;
          color: #333;
        }

        .property-reviews .star-rating span {
          transition: transform 0.15s;
        }

        .property-reviews .star-rating span:hover {
          transform: scale(1.2);
        }

        .property-reviews .form-control {
          border-radius: 8px;
        }

        .property-reviews .card {
          border: none;
        }
      `}</style>
    </div>
  );
};

export default PropertyReviews;
