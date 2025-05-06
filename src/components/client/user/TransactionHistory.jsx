import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Badge, InputGroup, Tabs, Tab, Card, Dropdown, Row, Col } from 'react-bootstrap';
import { format, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: '',
  });
  const [activeView, setActiveView] = useState('card'); // 'card' hoặc 'table'

  // Mô phỏng dữ liệu giao dịch
  const mockTransactions = [
    {
      id: 'TRX-2023-001',
      date: '2023-11-28',
      property: 'Căn hộ cao cấp tại Quận 2',
      amount: '4,500,000,000 VND',
      type: 'purchase',
      status: 'completed',
      agent: 'Nguyễn Văn A',
      details: 'Thanh toán đợt 1/3 cho căn hộ',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'TRX-2023-002',
      date: '2023-10-15',
      property: 'Đất nền KDC Phú Mỹ',
      amount: '2,100,000,000 VND',
      type: 'deposit',
      status: 'pending',
      agent: 'Trần Thị B',
      details: 'Đặt cọc giữ chỗ lô đất nền',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'TRX-2023-003',
      date: '2023-09-05',
      property: 'Biệt thự Vinhomes Central Park',
      amount: '1,000,000,000 VND',
      type: 'deposit',
      status: 'cancelled',
      agent: 'Lê Văn C',
      details: 'Đặt cọc (đã hủy và hoàn tiền)',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      id: 'TRX-2023-004',
      date: '2023-08-20',
      property: 'Căn hộ Masteri An Phú',
      amount: '8,500,000,000 VND',
      type: 'purchase',
      status: 'completed',
      agent: 'Phạm Thị D',
      details: 'Thanh toán đầy đủ',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
  ];

  useEffect(() => {
    // Mô phỏng API call
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 800);
  }, []);

  // Lọc theo loại giao dịch và tìm kiếm
  const filteredTransactions = transactions
    .filter(transaction => {
      // Lọc theo loại
      if (filter !== 'all' && transaction.type !== filter) {
        return false;
      }
      
      // Lọc theo từ khóa tìm kiếm
      if (searchTerm && !transaction.property.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !transaction.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Lọc theo khoảng thời gian
      if (dateRange.from && new Date(transaction.date) < new Date(dateRange.from)) {
        return false;
      }
      if (dateRange.to && new Date(transaction.date) > new Date(dateRange.to)) {
        return false;
      }
      
      return true;
    });

  // Status badge
  const renderStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return (
          <div className="status-badge status-completed">
            <i className="bi bi-check-circle-fill me-1"></i>
            <span>Hoàn thành</span>
          </div>
        );
      case 'pending':
        return (
          <div className="status-badge status-pending">
            <i className="bi bi-clock-fill me-1"></i>
            <span>Đang xử lý</span>
          </div>
        );
      case 'cancelled':
        return (
          <div className="status-badge status-cancelled">
            <i className="bi bi-x-circle-fill me-1"></i>
            <span>Đã hủy</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Type badge
  const renderTypeBadge = (type) => {
    switch(type) {
      case 'purchase':
        return (
          <div className="type-badge type-purchase">
            <i className="bi bi-house-fill me-1"></i>
            <span>Mua</span>
          </div>
        );
      case 'deposit':
        return (
          <div className="type-badge type-deposit">
            <i className="bi bi-piggy-bank-fill me-1"></i>
            <span>Đặt cọc</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Format số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format ngày tháng
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'HH:mm - dd/MM/yyyy', { locale: vi });
  };

  // Xử lý thay đổi khoảng thời gian
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
  };

  // Xóa bộ lọc
  const clearFilters = () => {
    setFilter('all');
    setSearchTerm('');
    setDateRange({ from: '', to: '' });
  };

  // Hàm để hiển thị thời gian tương đối
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffInDays = differenceInDays(today, date);
    
    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return 'Hôm qua';
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    return format(date, 'dd/MM/yyyy', { locale: vi });
  };

  return (
    <div className="transaction-history-container">
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex gap-2">
            <Button 
              variant={activeView === 'card' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => setActiveView('card')}
            >
              <i className="bi bi-grid-3x3-gap-fill me-1"></i> Card
            </Button>
            <Button 
              variant={activeView === 'table' ? 'primary' : 'outline-primary'} 
              size="sm"
              onClick={() => setActiveView('table')}
            >
              <i className="bi bi-table me-1"></i> Bảng
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <Form.Group className="search-container mb-0">
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Tìm kiếm giao dịch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ps-4"
                  />
                  <i className="bi bi-search position-absolute search-icon"></i>
                </div>
              </Form.Group>
              
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" id="dropdown-filter" className="filter-dropdown">
                  <i className="bi bi-funnel-fill me-1"></i>
                  {filter === 'all'
                    ? 'Tất cả'
                    : filter === 'purchase'
                    ? 'Mua'
                    : filter === 'deposit'
                    ? 'Đặt cọc'
                    : 'Tất cả'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item active={filter === 'all'} onClick={() => setFilter('all')}>
                    <i className="bi bi-funnel me-2"></i>Tất cả giao dịch
                  </Dropdown.Item>
                  <Dropdown.Item active={filter === 'purchase'} onClick={() => setFilter('purchase')}>
                    <i className="bi bi-house me-2"></i>Mua
                  </Dropdown.Item>
                  <Dropdown.Item active={filter === 'deposit'} onClick={() => setFilter('deposit')}>
                    <i className="bi bi-piggy-bank me-2"></i>Đặt cọc
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <Form.Group className="mb-0 position-relative date-picker">
                <Form.Control
                  type="date"
                  name="from"
                  value={dateRange.from}
                  onChange={handleDateRangeChange}
                  placeholder="Từ ngày"
                />
                <i className="bi bi-calendar3 date-icon"></i>
              </Form.Group>
              <Form.Group className="mb-0 position-relative date-picker">
                <Form.Control
                  type="date"
                  name="to"
                  value={dateRange.to}
                  onChange={handleDateRangeChange}
                  placeholder="Đến ngày"
                />
                <i className="bi bi-calendar3 date-icon"></i>
              </Form.Group>
              {(filter !== 'all' || searchTerm || dateRange.from || dateRange.to) && (
                <Button variant="outline-secondary" size="sm" onClick={clearFilters} className="clear-filter-btn">
                  <i className="bi bi-x-circle me-1"></i>Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center my-5 py-5">
              <div className="spinner-container">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
                <div className="spinner-grow text-primary ms-2" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
                <div className="spinner-grow text-primary ms-2" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
              </div>
              <p className="mt-3 text-muted">Đang tải lịch sử giao dịch...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center p-5 bg-light rounded empty-state">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
                alt="No transactions"
                className="empty-state-icon mb-3"
              />
              <h5>Không có giao dịch</h5>
              <p className="text-muted">
                Không tìm thấy giao dịch nào phù hợp với điều kiện lọc.
              </p>
              {(filter !== 'all' || searchTerm || dateRange.from || dateRange.to) && (
                <Button variant="primary" onClick={clearFilters} className="mt-2">
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          ) : activeView === 'card' ? (
            // Card View
            <Row xs={1} md={2} className="g-4">
              {filteredTransactions.map(transaction => (
                <Col key={transaction.id}>
                  <Card className={`transaction-card status-${transaction.status} border-0 shadow-sm h-100`}>
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-3">
                        <div className="transaction-id">
                          {transaction.id}
                        </div>
                        <div className="transaction-date">
                          <i className="bi bi-calendar3 me-1"></i>
                          {getRelativeTime(transaction.date)}
                        </div>
                      </div>
                      
                      <div className="transaction-property d-flex align-items-center mb-3">
                        <div className="property-image me-3">
                          <img src={transaction.image} alt={transaction.property} />
                        </div>
                        <div>
                          <h6 className="mb-0">{transaction.property}</h6>
                          <small className="text-muted">{transaction.details}</small>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>{renderTypeBadge(transaction.type)}</div>
                        <div>{renderStatusBadge(transaction.status)}</div>
                      </div>
                      
                      <div className="transaction-amount">
                        <span className="amount-label">Số tiền:</span>
                        <span className="amount-value">{transaction.amount}</span>
                      </div>
                      
                      <div className="transaction-agent mt-3">
                        <small className="text-muted">
                          <i className="bi bi-person me-1"></i>
                          Nhân viên: {transaction.agent}
                        </small>
                      </div>
                      
                      <Button variant="outline-primary" size="sm" className="mt-3 w-100">
                        <i className="bi bi-eye me-1"></i>
                        Xem chi tiết
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            // Table View
            <div className="transaction-table">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Mã GD</th>
                      <th>Ngày</th>
                      <th>Bất động sản</th>
                      <th>Loại</th>
                      <th>Số tiền</th>
                      <th>Trạng thái</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(transaction => (
                      <tr key={transaction.id} className={`status-${transaction.status}-row`}>
                        <td className="fw-medium">{transaction.id}</td>
                        <td>{new Date(transaction.date).toLocaleDateString('vi-VN')}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="property-image-small me-2">
                              <img src={transaction.image} alt={transaction.property} />
                            </div>
                            <div>
                              {transaction.property}
                              <small className="d-block text-muted">{transaction.details}</small>
                            </div>
                          </div>
                        </td>
                        <td>{renderTypeBadge(transaction.type)}</td>
                        <td className="fw-bold">{transaction.amount}</td>
                        <td>{renderStatusBadge(transaction.status)}</td>
                        <td>
                          <Button variant="link" size="sm" className="text-decoration-none">
                            <i className="bi bi-eye me-1"></i>
                            Chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      <div className="mt-4">
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white">
            <h5 className="mb-0">
              <i className="bi bi-graph-up-arrow me-2 text-primary"></i>
              Thống kê giao dịch
            </h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-4 mb-4">
              <Col md={4}>
                <div className="stat-card completed">
                  <div className="stat-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">
                      {transactions.filter(t => t.status === 'completed').length}
                    </div>
                    <div className="stat-label">Hoàn thành</div>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="stat-card pending">
                  <div className="stat-icon">
                    <i className="bi bi-clock-fill"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">
                      {transactions.filter(t => t.status === 'pending').length}
                    </div>
                    <div className="stat-label">Đang xử lý</div>
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="stat-card cancelled">
                  <div className="stat-icon">
                    <i className="bi bi-x-circle-fill"></i>
                  </div>
                  <div className="stat-content">
                    <div className="stat-value">
                      {transactions.filter(t => t.status === 'cancelled').length}
                    </div>
                    <div className="stat-label">Đã hủy</div>
                  </div>
                </div>
              </Col>
            </Row>
            
            <Tabs defaultActiveKey="recent" className="mb-3 custom-tabs">
              <Tab eventKey="recent" title={<><i className="bi bi-clock-history me-2"></i>Giao dịch gần đây</>}>
                <div className="recent-transactions">
                  {loading ? (
                    <div className="text-center my-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                      </div>
                    </div>
                  ) : transactions.length > 0 ? (
                    transactions.slice(0, 3).map((transaction, index) => (
                      <div className={`recent-transaction-item ${index !== transactions.slice(0, 3).length - 1 ? 'mb-3' : ''}`} key={transaction.id}>
                        <div className="d-flex">
                          <div className={`transaction-icon ${transaction.status}`}>
                            <i className={`bi ${transaction.type === 'purchase' ? 'bi-house-fill' : 'bi-piggy-bank-fill'}`}></i>
                          </div>
                          <div className="transaction-details">
                            <div className="d-flex justify-content-between">
                              <h6 className="mb-1">{transaction.property}</h6>
                              <span className="transaction-date">{getRelativeTime(transaction.date)}</span>
                            </div>
                            <p className="mb-1 text-muted">{transaction.details}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="fw-bold">{transaction.amount}</div>
                              {renderStatusBadge(transaction.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">Không có giao dịch nào</p>
                    </div>
                  )}
                  
                  {transactions.length > 3 && (
                    <div className="text-center mt-3">
                      <Button variant="outline-primary" size="sm">
                        <i className="bi bi-arrow-down-circle me-1"></i>
                        Xem thêm
                      </Button>
                    </div>
                  )}
                </div>
              </Tab>
              <Tab eventKey="reports" title={<><i className="bi bi-bar-chart-fill me-2"></i>Báo cáo tài chính</>}>
                <div className="p-3">
                  <div className="reports-header text-center mb-4">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/6295/6295417.png" 
                      alt="Reports" 
                      style={{ width: '80px', height: '80px', opacity: 0.7 }}
                      className="mb-3"
                    />
                    <h5>Báo cáo tài chính của bạn</h5>
                    <p className="text-muted">
                      Xem tổng quan về tình hình tài chính và các giao dịch bất động sản
                    </p>
                  </div>
                  
                  <Row className="g-4">
                    <Col md={6}>
                      <Card className="report-card h-100">
                        <Card.Body className="text-center">
                          <div className="report-icon mb-3">
                            <i className="bi bi-graph-up"></i>
                          </div>
                          <h5>Báo cáo chi tiêu</h5>
                          <p className="text-muted">Phân tích chi tiêu và đầu tư bất động sản</p>
                          <Button variant="primary" size="sm">
                            <i className="bi bi-bar-chart-line me-1"></i>
                            Xem báo cáo
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="report-card h-100">
                        <Card.Body className="text-center">
                          <div className="report-icon mb-3">
                            <i className="bi bi-file-earmark-text"></i>
                          </div>
                          <h5>Xuất báo cáo</h5>
                          <p className="text-muted">Tải xuống báo cáo giao dịch PDF</p>
                          <Button variant="primary" size="sm">
                            <i className="bi bi-download me-1"></i>
                            Tải xuống
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </div>

      <style jsx="true">{`
        .transaction-history-container {
          font-family: 'Inter', sans-serif;
        }
        
        /* Loader styles */
        .spinner-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .spinner-grow {
          width: 0.7rem;
          height: 0.7rem;
          animation-delay: 0.1s;
        }
        
        .spinner-grow:nth-child(3) {
          animation-delay: 0.2s;
        }
        
        /* Empty state */
        .empty-state {
          padding: 40px 20px;
          border-radius: 12px;
        }
        
        .empty-state-icon {
          width: 80px;
          height: 80px;
          opacity: 0.6;
        }
        
        /* Search and filter styles */
        .search-container {
          width: 250px;
        }
        
        .search-icon {
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          color: #6c757d;
        }
        
        .filter-dropdown {
          border-radius: 8px;
        }
        
        .date-picker {
          width: 140px;
        }
        
        .date-icon {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          color: #6c757d;
          pointer-events: none;
        }
        
        .clear-filter-btn {
          border-radius: 8px;
        }
        
        /* Transaction card styles */
        .transaction-card {
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .transaction-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        
        .transaction-card.status-completed {
          border-left: 5px solid #28a745;
        }
        
        .transaction-card.status-pending {
          border-left: 5px solid #ffc107;
        }
        
        .transaction-card.status-cancelled {
          border-left: 5px solid #dc3545;
        }
        
        .transaction-id {
          font-weight: 600;
          color: #495057;
          font-size: 0.9rem;
        }
        
        .transaction-date {
          font-size: 0.85rem;
          color: #6c757d;
        }
        
        .transaction-property h6 {
          font-weight: 600;
          margin-bottom: 2px;
        }
        
        .property-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .property-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .property-image-small {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          overflow: hidden;
        }
        
        .property-image-small img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .transaction-amount {
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .amount-label {
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .amount-value {
          font-weight: 700;
          color: #495057;
        }
        
        /* Status badges */
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .status-completed {
          background-color: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }
        
        .status-pending {
          background-color: rgba(255, 193, 7, 0.1);
          color: #ffc107;
        }
        
        .status-cancelled {
          background-color: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }
        
        /* Type badges */
        .type-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .type-purchase {
          background-color: rgba(13, 110, 253, 0.1);
          color: #0d6efd;
        }
        
        .type-deposit {
          background-color: rgba(13, 202, 240, 0.1);
          color: #0dcaf0;
        }
        
        /* Table styles */
        .transaction-table th {
          font-weight: 600;
          color: #495057;
          text-transform: uppercase;
          font-size: 0.85rem;
          border-top: none;
          border-bottom: 2px solid #e9ecef;
        }
        
        .transaction-table td {
          vertical-align: middle;
          padding: 12px 8px;
        }
        
        .status-completed-row {
          border-left: 4px solid #28a745;
        }
        
        .status-pending-row {
          border-left: 4px solid #ffc107;
        }
        
        .status-cancelled-row {
          border-left: 4px solid #dc3545;
        }
        
        /* Stat cards */
        .stat-card {
          display: flex;
          align-items: center;
          padding: 20px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
        }
        
        .stat-card.completed {
          background-color: rgba(40, 167, 69, 0.1);
        }
        
        .stat-card.pending {
          background-color: rgba(255, 193, 7, 0.1);
        }
        
        .stat-card.cancelled {
          background-color: rgba(220, 53, 69, 0.1);
        }
        
        .stat-icon {
          font-size: 2.5rem;
          margin-right: 20px;
          opacity: 0.8;
        }
        
        .stat-card.completed .stat-icon {
          color: #28a745;
        }
        
        .stat-card.pending .stat-icon {
          color: #ffc107;
        }
        
        .stat-card.cancelled .stat-icon {
          color: #dc3545;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1;
        }
        
        .stat-label {
          color: #6c757d;
          font-size: 0.9rem;
          margin-top: 5px;
        }
        
        /* Recent transactions */
        .recent-transaction-item {
          padding: 15px;
          border-radius: 10px;
          background-color: #f8f9fa;
          transition: all 0.3s ease;
        }
        
        .recent-transaction-item:hover {
          background-color: #f0f0f0;
          transform: translateX(5px);
        }
        
        .transaction-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 1.4rem;
        }
        
        .transaction-icon.completed {
          background-color: rgba(40, 167, 69, 0.1);
          color: #28a745;
        }
        
        .transaction-icon.pending {
          background-color: rgba(255, 193, 7, 0.1);
          color: #ffc107;
        }
        
        .transaction-icon.cancelled {
          background-color: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }
        
        .transaction-details {
          flex: 1;
        }
        
        /* Report cards */
        .report-card {
          border: none;
          border-radius: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .report-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .report-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: rgba(13, 110, 253, 0.1);
          color: #0d6efd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin: 0 auto;
        }
        
        /* Custom tabs */
        .custom-tabs .nav-link {
          color: #6c757d;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          margin-right: 5px;
          transition: all 0.2s ease;
        }
        
        .custom-tabs .nav-link:hover {
          background-color: #f8f9fa;
          color: #495057;
        }
        
        .custom-tabs .nav-link.active {
          color: #0d6efd !important;
          background-color: rgba(13, 110, 253, 0.1) !important;
          font-weight: 600;
          border: none;
        }
        
        /* Responsive */
        @media (max-width: 767.98px) {
          .search-container {
            width: 100%;
            margin-bottom: 10px;
          }
          
          .transaction-property h6 {
            font-size: 0.9rem;
          }
          
          .stat-card {
            margin-bottom: 15px;
          }
          
          .stat-icon {
            font-size: 2rem;
            margin-right: 15px;
          }
          
          .stat-value {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TransactionHistory; 