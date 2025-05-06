import React, { useState } from 'react';
import { Card, Form, Button, Alert, Table, Modal } from 'react-bootstrap';

const ReportForm = () => {
  const [reportType, setReportType] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const properties = [
    { id: 'KV001', name: 'Kim Việt', type: 'Căn hộ' },
    { id: 'GT002', name: 'Giá Thủ', type: 'Nhà phố' },
    { id: 'TK003', name: 'Tin Kiểm', type: 'Đất nền' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reportType || !selectedProperty) return;
    
    // Hiển thị popup xác nhận thay vì gửi ngay
    setShowConfirmModal(true);
  };

  const confirmSubmit = () => {
    console.log('Báo cáo đã gửi:', {
      property: selectedProperty,
      type: reportType,
      details
    });

    setSubmitted(true);
    setReportType('');
    setDetails('');
    setSelectedProperty('');
    setShowConfirmModal(false);
  };

  const selectedPropertyData = properties.find(p => p.id === selectedProperty);

  return (
    <div className="real-estate-report-container py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">TÌM NGÔI NHÀ HOÀN HẢO BÊN GIA ĐÌNH THÂN YÊU</h2>
          <p className="text-center mb-4 text-muted">Dịch vụ quản lý tận tâm - vì sự an tâm và thành công bền vững của khách hàng</p>

          <h4 className="mb-3">Báo cáo bất động sản</h4>

          {submitted && (
            <Alert variant="success" className="mt-3">
              Cảm ơn bạn đã gửi báo cáo! Chúng tôi sẽ xử lý yêu cầu của bạn sớm nhất.
            </Alert>
          )}

          <div className="property-table mb-4">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Loại Bất Động Sản</th>
                  <th>Tên Dự Án</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr 
                    key={property.id} 
                    className={selectedProperty === property.id ? 'table-active' : ''}
                    onClick={() => setSelectedProperty(property.id)}
                  >
                    <td>{property.type}</td>
                    <td>{property.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Loại báo cáo</Form.Label>
              <Form.Select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)}
                required
              >
                <option value="">-- Chọn loại báo cáo --</option>
                <option value="thong-tin-sai">Thông tin sai sự thật</option>
                <option value="gia-cao">Giá bán không hợp lý</option>
                <option value="vi-pham">Vi phạm chính sách</option>
                <option value="khac">Lý do khác</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Chi tiết báo cáo</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Mô tả chi tiết vấn đề bạn phát hiện..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center">
              {selectedProperty && (
                <span className="text-muted">
                  Đã chọn: <strong>{selectedPropertyData?.name}</strong>
                </span>
              )}
              
              <Button 
                type="submit" 
                variant="primary" 
                disabled={!selectedProperty}
              >
                Gửi Báo Cáo
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Popup xác nhận */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận gửi báo cáo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn gửi báo cáo này?</p>
          <div className="confirmation-details">
            <p><strong>Dự án:</strong> {selectedPropertyData?.name}</p>
            <p><strong>Loại báo cáo:</strong> {
              reportType === 'thong-tin-sai' ? 'Thông tin sai sự thật' :
              reportType === 'gia-cao' ? 'Giá bán không hợp lý' :
              reportType === 'vi-pham' ? 'Vi phạm chính sách' : 'Lý do khác'
            }</p>
            {details && <p><strong>Chi tiết:</strong> {details}</p>}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Hủy bỏ
          </Button>
          <Button variant="primary" onClick={confirmSubmit}>
            Xác nhận gửi
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx="true">{`
        .real-estate-report-container {
          max-width: 800px;
          margin: 0 auto;
          font-family: 'Arial', sans-serif;
        }
        
        .real-estate-report-container h2 {
          color: #2c3e50;
          font-weight: 700;
        }
        
        .property-table {
          border-radius: 8px;
          overflow: hidden;
        }
        
        .property-table table {
          cursor: pointer;
        }
        
        .property-table th {
          background-color: #3498db;
          color: white;
        }
        
        .real-estate-report-container .form-control,
        .real-estate-report-container .form-select {
          border-radius: 6px;
          border: 1px solid #ddd;
        }
        
        .real-estate-report-container button {
          border-radius: 6px;
          padding: 8px 20px;
          font-weight: 500;
        }
        
        .real-estate-report-container button:disabled {
          opacity: 0.6;
        }
        
        .confirmation-details {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin-top: 15px;
        }
        
        .confirmation-details p {
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default ReportForm;