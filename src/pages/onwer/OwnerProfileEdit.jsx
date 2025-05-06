import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

const OwnerProfileEdit = () => {
  const [formData, setFormData] = useState({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0909123456',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    dob: '1990-01-01',
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Thông tin cập nhật:', formData);
    alert('Thông tin đã được lưu!');
  };

  return (
    <div className="  p-4">
      <h3 className="mb-4">Chỉnh sửa thông tin cá nhân</h3>
      <Card className="shadow-sm p-4">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Ảnh đại diện</Form.Label>
            <Form.Control
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
            />
            {formData.avatar && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(formData.avatar)}
                  alt="Avatar Preview"
                  height="100"
                  className="rounded"
                />
              </div>
            )}
          </Form.Group>

          <Button variant="primary" type="submit">
            Lưu thay đổi
          </Button>
        </Form>
      </Card>

      <style jsx="true">{`
        .form-label {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default OwnerProfileEdit;
