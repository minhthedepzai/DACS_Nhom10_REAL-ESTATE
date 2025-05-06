import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, InputGroup, Dropdown, Modal, Badge } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaCheckCircle, FaTimesCircle, FaFileInvoiceDollar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: '', id: null });

  // Dữ liệu mẫu
  useEffect(() => {
    const sampleData = [
      {
        id: 'TRX-001',
        date: '2023-10-15',
        customer: 'Nguyễn Văn A',
        property: 'Căn hộ Vinhomes Central Park',
        amount: 500000000,
        status: 'Đang xử lý',
        paymentMethod: 'Chuyển khoản',
        description: 'Giao dịch đặt cọc căn hộ'
      },
      {
        id: 'TRX-002',
        date: '2023-10-18',
        customer: 'Trần Thị B',
        property: 'Biệt thự Park City',
        amount: 1200000000,
        status: 'Hoàn thành',
        paymentMethod: 'Chuyển khoản',
        description: 'Thanh toán đợt 1 biệt thự'
      },
      {
        id: 'TRX-003',
        date: '2023-10-20',
        customer: 'Lê Văn C',
        property: 'Shophouse Masteri',
        amount: 350000000,
        status: 'Đã hủy',
        paymentMethod: 'Tiền mặt',
        description: 'Giao dịch đặt cọc bị hủy'
      },
      {
        id: 'TRX-004',
        date: '2023-10-22',
        customer: 'Phạm Thị D',
        property: 'Căn hộ Landmark 81',
        amount: 750000000,
        status: 'Đang xử lý',
        paymentMethod: 'Chuyển khoản',
        description: 'Thanh toán đợt 1 căn hộ'
      },
      {
        id: 'TRX-005',
        date: '2023-10-25',
        customer: 'Hoàng Văn E',
        property: 'Đất nền Phú Quốc',
        amount: 2500000000,
        status: 'Chờ xác nhận',
        paymentMethod: 'Chuyển khoản',
        description: 'Giao dịch mua đất'
      }
    ];
    
    setTransactions(sampleData);
  }, []);

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const handleConfirm = (id) => {
    setConfirmAction({ type: 'confirm', id });
    setShowConfirmModal(true);
  };

  const handleCancel = (id) => {
    setConfirmAction({ type: 'cancel', id });
    setShowConfirmModal(true);
  };

  const executeAction = () => {
    const updatedTransactions = transactions.map(transaction => {
      if (transaction.id === confirmAction.id) {
        return {
          ...transaction,
          status: confirmAction.type === 'confirm' ? 'Hoàn thành' : 'Đã hủy'
        };
      }
      return transaction;
    });
    
    setTransactions(updatedTransactions);
    setShowConfirmModal(false);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.property.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Tất cả' || transaction.status === statusFilter;
    
    const transactionDate = new Date(transaction.date);
    const isAfterStartDate = !startDate || transactionDate >= startDate;
    const isBeforeEndDate = !endDate || transactionDate <= endDate;
    
    return matchesSearch && matchesStatus && isAfterStartDate && isBeforeEndDate;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Hoàn thành':
        return <Badge bg="success">Hoàn thành</Badge>;
      case 'Đang xử lý':
        return <Badge bg="primary">Đang xử lý</Badge>;
      case 'Chờ xác nhận':
        return <Badge bg="warning" text="dark">Chờ xác nhận</Badge>;
      case 'Đã hủy':
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý giao dịch</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><a href="/onwer">Dashboard</a></li>
        <li className="breadcrumb-item active">Quản lý giao dịch</li>
      </ol>
      
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div>
            <i className="fas fa-table me-1"></i>
            Danh sách giao dịch
          </div>
          <Button variant="success">
            <FaFileInvoiceDollar className="me-1" /> Tạo giao dịch mới
          </Button>
        </Card.Header>
        <Card.Body>
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm theo ID, khách hàng, bất động sản..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
            <div className="col-md-6 mb-2">
              <div className="d-flex">
                <Dropdown className="me-2">
                  <Dropdown.Toggle variant="outline-secondary">
                    <FaFilter className="me-1" /> {statusFilter}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setStatusFilter('Tất cả')}>Tất cả</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('Hoàn thành')}>Hoàn thành</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('Đang xử lý')}>Đang xử lý</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('Chờ xác nhận')}>Chờ xác nhận</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatusFilter('Đã hủy')}>Đã hủy</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Từ ngày"
                  className="form-control me-2"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="Đến ngày"
                  className="form-control"
                />
              </div>
            </div>
          </div>
          
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ngày</th>
                <th>Khách hàng</th>
                <th>Bất động sản</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.customer}</td>
                  <td>{transaction.property}</td>
                  <td>{formatCurrency(transaction.amount)}</td>
                  <td>{getStatusBadge(transaction.status)}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-1" onClick={() => handleViewDetails(transaction)}>
                      <FaEye />
                    </Button>
                    {transaction.status !== 'Hoàn thành' && transaction.status !== 'Đã hủy' && (
                      <>
                        <Button variant="success" size="sm" className="me-1" onClick={() => handleConfirm(transaction.id)}>
                          <FaCheckCircle />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleCancel(transaction.id)}>
                          <FaTimesCircle />
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Chi tiết giao dịch Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết giao dịch {selectedTransaction?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <p><strong>ID:</strong> {selectedTransaction.id}</p>
                <p><strong>Ngày giao dịch:</strong> {selectedTransaction.date}</p>
                <p><strong>Khách hàng:</strong> {selectedTransaction.customer}</p>
                <p><strong>Bất động sản:</strong> {selectedTransaction.property}</p>
              </div>
              <div className="col-md-6 mb-3">
                <p><strong>Số tiền:</strong> {formatCurrency(selectedTransaction.amount)}</p>
                <p><strong>Trạng thái:</strong> {getStatusBadge(selectedTransaction.status)}</p>
                <p><strong>Phương thức thanh toán:</strong> {selectedTransaction.paymentMethod}</p>
                <p><strong>Mô tả:</strong> {selectedTransaction.description}</p>
              </div>
              <div className="col-12">
                <h5>Lịch sử giao dịch</h5>
                <Table striped bordered size="sm">
                  <thead>
                    <tr>
                      <th>Thời gian</th>
                      <th>Hành động</th>
                      <th>Người thực hiện</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{selectedTransaction.date} 09:00</td>
                      <td>Tạo giao dịch</td>
                      <td>Admin</td>
                    </tr>
                    {selectedTransaction.status === 'Hoàn thành' && (
                      <tr>
                        <td>{selectedTransaction.date} 15:30</td>
                        <td>Xác nhận giao dịch</td>
                        <td>Admin</td>
                      </tr>
                    )}
                    {selectedTransaction.status === 'Đã hủy' && (
                      <tr>
                        <td>{selectedTransaction.date} 14:45</td>
                        <td>Hủy giao dịch</td>
                        <td>Admin</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Đóng
          </Button>
          {selectedTransaction && selectedTransaction.status !== 'Hoàn thành' && selectedTransaction.status !== 'Đã hủy' && (
            <>
              <Button variant="success" onClick={() => {
                setShowDetailsModal(false);
                handleConfirm(selectedTransaction.id);
              }}>
                Xác nhận giao dịch
              </Button>
              <Button variant="danger" onClick={() => {
                setShowDetailsModal(false);
                handleCancel(selectedTransaction.id);
              }}>
                Hủy giao dịch
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmAction.type === 'confirm' ? 
            'Bạn có chắc chắn muốn xác nhận hoàn thành giao dịch này?' : 
            'Bạn có chắc chắn muốn hủy giao dịch này?'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Đóng
          </Button>
          <Button 
            variant={confirmAction.type === 'confirm' ? 'success' : 'danger'} 
            onClick={executeAction}
          >
            {confirmAction.type === 'confirm' ? 'Xác nhận' : 'Hủy giao dịch'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TransactionManagement; 